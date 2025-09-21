import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

export interface CreateProjectData {
  name: string;
  location: string;
  type: string;
  status: string;
  developerId: string;
  amenities: string[];
  description?: string;
  brochureFile?: File;
  excelFile?: File;
  createdBy?: string; // For admin-created projects
}

export interface ParsedUnit {
  unitNumber: string;
  floor: number;
  type: string;
  size: string;
  price: string;
  discountPrice?: string;
  registrationFee?: string;
  roiPercentage?: string;
  paymentPlan?: string;
  status: 'Available' | 'Held' | 'Sold';
}

export interface ParsedProject {
  name: string;
  possessionDate?: string;
  units: ParsedUnit[];
}

export const createProject = async (projectData: CreateProjectData, parsedProjects: ParsedProject[]) => {
  let currentUser = null;
  
  try {
    // Get current user for authentication
    currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated. Please log in and try again.');
    }

    if (!currentUser.id) {
      throw new Error('User ID not found. Please log in again.');
    }
    
    // 1. Upload brochure file if provided
    let brochureUrl = null;
    if (projectData.brochureFile) {
      const brochureFileName = `${Date.now()}_${projectData.brochureFile.name}`;
      
      try {
        const { data: brochureUpload, error: brochureError } = await supabase.storage
          .from('project-files')
          .upload(`brochures/${brochureFileName}`, projectData.brochureFile);

        if (brochureError) {
          console.error('Brochure upload error:', brochureError);
          throw new Error(`Failed to upload brochure: ${brochureError.message}`);
        } else {
          const { data: brochureUrlData } = supabase.storage
            .from('project-files')
            .getPublicUrl(brochureUpload.path);
          brochureUrl = brochureUrlData.publicUrl;
        }
      } catch (uploadError) {
        console.error('Brochure upload failed:', uploadError);
        throw new Error(`Brochure upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
      }
    }

    // 2. Upload Excel file if provided
    let excelUrl = null;
    if (projectData.excelFile) {
      const excelFileName = `${Date.now()}_${projectData.excelFile.name}`;
      
      try {
        const { data: excelUpload, error: excelError } = await supabase.storage
          .from('project-files')
          .upload(`excel/${excelFileName}`, projectData.excelFile);

        if (excelError) {
          console.error('Excel upload error:', excelError);
          throw new Error(`Failed to upload Excel file: ${excelError.message}`);
        } else {
          const { data: excelUrlData } = supabase.storage
            .from('project-files')
            .getPublicUrl(excelUpload.path);
          excelUrl = excelUrlData.publicUrl;
        }
      } catch (uploadError) {
        console.error('Excel upload failed:', uploadError);
        throw new Error(`Excel upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
      }
    }

    // 3. Create project record
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        developer_id: parseInt(projectData.developerId),
        name: projectData.name,
        description: projectData.description || `${projectData.type} project in ${projectData.location}`,
        location: projectData.location,
        brochure_url: brochureUrl,
        unit_excel_url: excelUrl,
        created_by: currentUser.id ? parseInt(currentUser.id) : null
      })
      .select()
      .single();

    if (projectError) {
      console.error('Project creation error:', projectError);
      throw new Error(`Failed to create project: ${projectError.message}`);
    }

    // 4. Create units from parsed Excel data
    const allUnits: any[] = [];
    
    for (const parsedProject of parsedProjects) {
      for (const unit of parsedProject.units) {
        // Parse price to number (remove currency symbols and commas)
        const priceStr = unit.price.replace(/[₹,\s]/g, '');
        const price = parseFloat(priceStr);
        
        // Parse optional pricing fields
        const discountPrice = unit.discountPrice ? 
          parseFloat(unit.discountPrice.replace(/[₹,\s]/g, '')) : null;
        const registrationFee = unit.registrationFee ? 
          parseFloat(unit.registrationFee.replace(/[₹,\s]/g, '')) : null;
        const roiPercentage = unit.roiPercentage ? 
          parseFloat(unit.roiPercentage.replace(/[%\s]/g, '')) : null;

        allUnits.push({
          project_id: project.id,
          name: unit.unitNumber,
          type: unit.type,
          price: price,
          status: unit.status,
          discount_price: discountPrice,
          registration_fee: registrationFee,
          roi_percentage: roiPercentage,
          payment_plan: unit.paymentPlan || null
        });
      }
    }

    // Insert units in batches
    if (allUnits.length > 0) {
      const { error: unitsError } = await supabase
        .from('units')
        .insert(allUnits);

      if (unitsError) {
        console.error('Units creation error:', unitsError);
        // Don't throw here, project is already created
      }
    }

    // 5. Log the upload
    if (currentUser.id) {
      const { error: logError } = await supabase
        .from('upload_logs')
        .insert({
          project_id: project.id,
          uploaded_by: parseInt(currentUser.id),
          file_url: excelUrl || '',
          file_type: 'excel',
          status: 'success'
        });

      if (logError) {
        console.warn('Failed to log upload:', logError);
        // Don't fail the entire operation for logging issues
      }
    }

    return {
      success: true,
      project,
      unitsCreated: allUnits.length
    };

  } catch (error) {
    console.error('Project creation error:', error);
    
    // Log the error
    if (projectData.excelFile && currentUser?.id) {
      await supabase
        .from('upload_logs')
        .insert({
          uploaded_by: parseInt(currentUser.id),
          file_url: '',
          file_type: 'excel',
          status: 'failed',
          errors: error instanceof Error ? error.message : 'Unknown error'
        });
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const getProjects = async (developerId?: string) => {
  let query = supabase
    .from('projects')
    .select(`
      *,
      units(count)
    `);

  if (developerId) {
    query = query.eq('developer_id', developerId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return data;
};

export const getProjectUnits = async (projectId: string) => {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .eq('project_id', projectId)
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch units: ${error.message}`);
  }

  return data;
};