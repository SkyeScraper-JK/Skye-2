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
  try {
    // Get current user for authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated. Please log in and try again.');
    }

    if (!currentUser.id) {
      throw new Error('User ID not found. Please log in again.');
    }
    
    // 1. Create project record (skip file uploads for now)
    console.log('Creating project with data:', {
      developer_id: parseInt(projectData.developerId),
      name: projectData.name,
      description: projectData.description,
      location: projectData.location,
      created_by: parseInt(currentUser.id)
    });
    
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        developer_id: parseInt(projectData.developerId),
        name: projectData.name,
        description: projectData.description || `${projectData.type} project in ${projectData.location}`,
        location: projectData.location,
        brochure_url: null, // Skip file upload for now
        unit_excel_url: null, // Skip file upload for now
        created_by: currentUser.id ? parseInt(currentUser.id) : null
      })
      .select()
      .single();

    if (projectError) {
      console.error('Project creation error:', projectError);
      throw new Error(`Failed to create project: ${projectError.message}`);
    }

    console.log('Project created successfully:', project);

    // 2. Create units from parsed Excel data
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
        console.warn('Some units may not have been created, but project creation succeeded');
      }
    }

    console.log('Units processed:', allUnits.length);

    return {
      success: true,
      project,
      unitsCreated: allUnits.length
    };

  } catch (error) {
    console.error('Project creation error:', error);
    
    // Log the error to console for debugging
    console.error('Full error details:', {
      error,
      projectData: { ...projectData, brochureFile: projectData.brochureFile?.name, excelFile: projectData.excelFile?.name },
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });

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