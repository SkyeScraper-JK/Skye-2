import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, FileText, CheckCircle, AlertCircle, X, Download, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { createProject, CreateProjectData } from '../services/projectService';
import { getCurrentUser } from '../lib/auth';

interface ExcelUploadSystemProps {
  projectId?: string;
  developerId?: string;
  onUploadComplete?: (data: any) => void;
  isAdmin?: boolean;
  projectFormData?: {
    name: string;
    location: string;
    type: string;
    status: string;
    amenities: string[];
    description?: string;
  };
}

interface UploadStatus {
  stage: 'idle' | 'uploading' | 'parsing' | 'validating' | 'saving' | 'complete' | 'error';
  progress: number;
  message: string;
  errors?: string[];
  summary?: {
    totalUnits: number;
    processed: number;
    skipped: number;
    projects?: number;
  };
}

interface ValidationError {
  row: number;
  column: string;
  error: string;
  value: string;
}

interface ParsedUnit {
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

interface ParsedProject {
  name: string;
  possessionDate?: string;
  units: ParsedUnit[];
}

const ExcelUploadSystem: React.FC<ExcelUploadSystemProps> = ({
  projectId,
  developerId,
  onUploadComplete,
  isAdmin = false,
  projectFormData
}) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    stage: 'idle',
    progress: 0,
    message: ''
  });
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedProject[]>([]);

  const handleBrochureUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (validTypes.includes(file.type)) {
        setBrochureFile(file);
      } else {
        alert('Please upload a PDF, JPG, or PNG file for the brochure.');
      }
    }
  }, []);

  const handleExcelUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      if (validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.csv')) {
        setExcelFile(file);
      } else {
        alert('Please upload an Excel (.xlsx) or CSV file.');
      }
    }
  }, []);

  const parseExcelFile = async (file: File): Promise<ParsedProject[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const projects: ParsedProject[] = [];

          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length < 2) return; // Skip empty sheets
            
            // Extract project metadata from sheet name
            const projectName = sheetName.includes(' - ') ? 
              sheetName.split(' - ')[0] : sheetName;
            const possessionDate = sheetName.includes(' - ') ? 
              sheetName.split(' - ')[1] : undefined;

            // Find header row (first row with data)
            const headers = jsonData[0] as string[];
            const dataRows = jsonData.slice(1) as any[][];

            // Map column headers to our expected fields
            const columnMap = mapColumns(headers);
            
            const units: ParsedUnit[] = [];
            
            dataRows.forEach((row, index) => {
              if (!row || row.length === 0) return;
              
              try {
                const unit = parseUnitRow(row, columnMap, index + 2);
                if (unit) {
                  units.push(unit);
                }
              } catch (error) {
                console.warn(`Error parsing row ${index + 2}:`, error);
              }
            });

            if (units.length > 0) {
              projects.push({
                name: projectName,
                possessionDate,
                units
              });
            }
          });

          resolve(projects);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const mapColumns = (headers: string[]): Record<string, number> => {
    const map: Record<string, number> = {};
    
    headers.forEach((header, index) => {
      const normalizedHeader = header?.toString().toLowerCase().trim();
      
      // Unit number variations
      if (['unit', 'unit no', 'unit number', 'unit_number', 'unitno'].includes(normalizedHeader)) {
        map.unitNumber = index;
      }
      // Floor variations
      else if (['floor', 'floor no', 'floor_no', 'floorno'].includes(normalizedHeader)) {
        map.floor = index;
      }
      // Type variations
      else if (['type', 'unit type', 'unit_type', 'configuration', 'config'].includes(normalizedHeader)) {
        map.type = index;
      }
      // Size variations
      else if (['size', 'area', 'sq ft', 'sqft', 'area_sqft', 'carpet area'].includes(normalizedHeader)) {
        map.size = index;
      }
      // Price variations
      else if (['price', 'base price', 'unit price', 'total price', 'amount'].includes(normalizedHeader)) {
        map.price = index;
      }
      // Discount price
      else if (['discount price', 'discounted price', 'offer price', 'special price'].includes(normalizedHeader)) {
        map.discountPrice = index;
      }
      // Registration fee
      else if (['registration fee', 'reg fee', 'registration', 'booking fee'].includes(normalizedHeader)) {
        map.registrationFee = index;
      }
      // ROI percentage
      else if (['roi', 'roi%', 'roi percentage', 'return', 'yield'].includes(normalizedHeader)) {
        map.roiPercentage = index;
      }
      // Payment plan
      else if (['payment plan', 'plan', 'payment_plan', 'payment scheme'].includes(normalizedHeader)) {
        map.paymentPlan = index;
      }
      // Status
      else if (['status', 'availability', 'unit status'].includes(normalizedHeader)) {
        map.status = index;
      }
    });
    
    return map;
  };

  const parseUnitRow = (row: any[], columnMap: Record<string, number>, rowNumber: number): ParsedUnit | null => {
    const getValue = (key: string): string => {
      const index = columnMap[key];
      return index !== undefined ? (row[index]?.toString().trim() || '') : '';
    };

    const unitNumber = getValue('unitNumber');
    const floorStr = getValue('floor');
    const type = getValue('type');
    const size = getValue('size');
    const price = getValue('price');

    // Skip rows with missing essential data
    if (!unitNumber || !type || !price) {
      return null;
    }

    // Parse floor number
    let floor = 0;
    if (floorStr) {
      const floorMatch = floorStr.match(/\d+/);
      floor = floorMatch ? parseInt(floorMatch[0]) : 0;
    } else {
      // Try to extract floor from unit number
      const unitFloorMatch = unitNumber.match(/(\d+)/);
      if (unitFloorMatch) {
        const unitNum = parseInt(unitFloorMatch[0]);
        floor = Math.floor(unitNum / 100); // Assuming format like A101, A201, etc.
      }
    }

    // Parse status
    const statusStr = getValue('status').toLowerCase();
    let status: 'Available' | 'Held' | 'Sold' = 'Available';
    if (statusStr.includes('held') || statusStr.includes('reserved')) {
      status = 'Held';
    } else if (statusStr.includes('sold') || statusStr.includes('booked')) {
      status = 'Sold';
    }

    return {
      unitNumber,
      floor,
      type,
      size: size || 'N/A',
      price,
      discountPrice: getValue('discountPrice') || undefined,
      registrationFee: getValue('registrationFee') || undefined,
      roiPercentage: getValue('roiPercentage') || undefined,
      paymentPlan: getValue('paymentPlan') || undefined,
      status
    };
  };

  const validateUnits = (projects: ParsedProject[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    let rowCounter = 2; // Start from row 2 (after headers)

    projects.forEach(project => {
      const unitNumbers = new Set<string>();
      
      project.units.forEach((unit, index) => {
        const currentRow = rowCounter + index;

        // Check for duplicate unit numbers
        if (unitNumbers.has(unit.unitNumber)) {
          errors.push({
            row: currentRow,
            column: 'unit_number',
            error: 'Duplicate unit number found',
            value: unit.unitNumber
          });
        }
        unitNumbers.add(unit.unitNumber);

        // Validate price format and reasonability
        const priceStr = unit.price.replace(/[₹,\s]/g, '');
        const priceNum = parseFloat(priceStr);
        if (isNaN(priceNum) || priceNum <= 0) {
          errors.push({
            row: currentRow,
            column: 'price',
            error: 'Invalid price format',
            value: unit.price
          });
        } else if (priceNum > 100000000) { // 10 crores seems unreasonable
          errors.push({
            row: currentRow,
            column: 'price',
            error: 'Price seems unreasonably high',
            value: unit.price
          });
        }

        // Validate floor consistency with unit number
        if (unit.floor > 0) {
          const unitFloorFromNumber = Math.floor(parseInt(unit.unitNumber.replace(/\D/g, '')) / 100);
          if (unitFloorFromNumber > 0 && unitFloorFromNumber !== unit.floor) {
            errors.push({
              row: currentRow,
              column: 'floor',
              error: 'Floor number inconsistent with unit number',
              value: unit.floor.toString()
            });
          }
        }

        // Validate unit type
        const validTypes = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', 'Studio', 'Penthouse', 'Villa', 'Plot'];
        if (!validTypes.some(type => unit.type.toLowerCase().includes(type.toLowerCase()))) {
          errors.push({
            row: currentRow,
            column: 'type',
            error: 'Unit type not recognized',
            value: unit.type
          });
        }
      });

      rowCounter += project.units.length;
    });

    return errors;
  };

  const processExcelFile = async () => {
    if (!excelFile) return;

    try {
      // Stage 1: Uploading
      setUploadStatus({
        stage: 'uploading',
        progress: 10,
        message: 'Uploading files to storage...'
      });

      // Stage 2: Parsing
      setUploadStatus({
        stage: 'parsing',
        progress: 30,
        message: 'Parsing Excel file and detecting structure...'
      });

      const projects = await parseExcelFile(excelFile);
      setParsedData(projects);

      // Stage 3: Validating
      setUploadStatus({
        stage: 'validating',
        progress: 60,
        message: 'Validating unit data and pricing...'
      });

      const errors = validateUnits(projects);
      setValidationErrors(errors);

      // Stage 4: Saving
      setUploadStatus({
        stage: 'saving',
        progress: 85,
        message: 'Creating project and saving units to database...',
        errors: errors.length > 0 ? [`${errors.length} validation issues found - units will be skipped`] : undefined
      });

      // Create the actual project in the database only if we have valid project form data
      if (projectFormData && developerId) {
        // Ensure user is authenticated
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          throw new Error('User not authenticated. Please log in and try again.');
        }
        
        if (!currentUser.id) {
          throw new Error('User ID not found. Please log in again.');
        }
        
        console.log('Creating project with data:', { projectFormData, developerId, projects });
        
        const projectData: CreateProjectData = {
          name: projectFormData.name,
          location: projectFormData.location,
          type: projectFormData.type,
          status: projectFormData.status,
          developerId: developerId,
          amenities: projectFormData.amenities,
          description: projectFormData.description,
          brochureFile: brochureFile,
          excelFile: excelFile,
          createdBy: isAdmin && currentUser.id ? currentUser.id : undefined
        };

        const result = await createProject(projectData, projects);
        console.log('Project creation result:', result);
        
        if (!result || !result.success) {
          throw new Error(`Failed to create project: ${result.error || 'Unknown error'}`);
        }
      } else {
        console.warn('Missing project form data or developer ID:', { projectFormData, developerId });
        throw new Error('Missing required project information. Please go back and fill in all required fields.');
      }

      // Calculate summary
      const totalUnits = projects.reduce((sum, project) => sum + project.units.length, 0);
      const processedUnits = totalUnits - errors.length;

      // Stage 5: Complete
      setUploadStatus({
        stage: 'complete',
        progress: 100,
        message: 'Project created successfully!',
        summary: {
          totalUnits,
          processed: processedUnits,
          skipped: errors.length,
          projects: projects.length
        }
      });

      if (onUploadComplete) {
        onUploadComplete({
          projectId,
          projects,
          unitsProcessed: processedUnits,
          unitsSkipped: errors.length,
          errors,
          success: true
        });
      }

    } catch (error) {
      console.error('Excel processing error:', error);
      setUploadStatus({
        stage: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Failed to create project. Please try again.',
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
    }
  };

  const handleStartUpload = () => {
    if (!excelFile) {
      alert('Please select an Excel file to upload.');
      return;
    }
    processExcelFile();
  };

  const handleReset = () => {
    setUploadStatus({ stage: 'idle', progress: 0, message: '' });
    setValidationErrors([]);
    setShowErrorDetails(false);
    setBrochureFile(null);
    setExcelFile(null);
    setParsedData([]);
  };

  const downloadErrorReport = () => {
    const errorData = validationErrors.map(error => 
      `Row ${error.row}: ${error.column} - ${error.error} (Value: ${error.value})`
    ).join('\n');
    
    const blob = new Blob([errorData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validation_errors.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSampleTemplate = () => {
    // Create a sample Excel template
    const sampleData = [
      ['Unit Number', 'Floor', 'Type', 'Area (sq.ft)', 'Price', 'Discount Price', 'Registration Fee', 'ROI %', 'Payment Plan', 'Status'],
      ['A101', '1', '2BHK', '1200', '₹1,20,00,000', '₹1,15,00,000', '₹2,00,000', '8.5', 'Standard', 'Available'],
      ['A102', '1', '2BHK', '1200', '₹1,20,00,000', '', '₹2,00,000', '8.5', 'Standard', 'Available'],
      ['A201', '2', '3BHK', '1650', '₹1,80,00,000', '₹1,70,00,000', '₹3,00,000', '9.2', 'Flexi', 'Available'],
      ['A202', '2', '3BHK', '1650', '₹1,80,00,000', '', '₹3,00,000', '9.2', 'Standard', 'Held']
    ];

    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sample Project - Q4 2025');
    XLSX.writeFile(wb, 'PropertyAgent_Excel_Template.xlsx');
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'uploading':
        return <Upload className="w-5 h-5 text-blue-600 animate-pulse" strokeWidth={1.5} />;
      case 'parsing':
        return <FileSpreadsheet className="w-5 h-5 text-purple-600 animate-pulse" strokeWidth={1.5} />;
      case 'validating':
        return <CheckCircle className="w-5 h-5 text-yellow-600 animate-pulse" strokeWidth={1.5} />;
      case 'saving':
        return <RefreshCw className="w-5 h-5 text-green-600 animate-spin" strokeWidth={1.5} />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" strokeWidth={1.5} />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={1.5} />;
      default:
        return <Upload className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Brochure Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
            <FileText className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Project Brochure</h3>
        </div>

        <div className="border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleBrochureUpload}
            className="hidden"
            id="brochure-upload"
          />
          <label htmlFor="brochure-upload" className="cursor-pointer">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" strokeWidth={1.5} />
            <h4 className="text-lg font-medium text-neutral-700 font-montserrat mb-2">
              Upload Project Brochure
            </h4>
            <p className="text-sm text-neutral-500 font-montserrat mb-4">
              PDF, JPG, or PNG files accepted
            </p>
            <div className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors inline-block">
              Choose Brochure File
            </div>
          </label>
        </div>

        {brochureFile && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" strokeWidth={1.5} />
                <span className="text-sm font-medium text-green-800 font-montserrat">
                  {brochureFile.name}
                </span>
              </div>
              <button
                onClick={() => setBrochureFile(null)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Excel Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
              <FileSpreadsheet className="w-5 h-5 text-green-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Unit Inventory Excel</h3>
          </div>
          <button
            onClick={downloadSampleTemplate}
            className="flex items-center text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700"
          >
            <Download className="w-4 h-4 mr-1" strokeWidth={1.5} />
            Download Template
          </button>
        </div>

        <div className="border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center mb-4">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleExcelUpload}
            className="hidden"
            id="excel-upload"
          />
          <label htmlFor="excel-upload" className="cursor-pointer">
            <FileSpreadsheet className="w-12 h-12 text-neutral-400 mx-auto mb-4" strokeWidth={1.5} />
            <h4 className="text-lg font-medium text-neutral-700 font-montserrat mb-2">
              Upload Unit Inventory
            </h4>
            <p className="text-sm text-neutral-500 font-montserrat mb-4">
              Excel (.xlsx) or CSV files with unit details, pricing, and availability
            </p>
            <div className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors inline-block">
              Choose Excel File
            </div>
          </label>
        </div>

        {/* Excel Format Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-blue-800 font-montserrat mb-2">Excel Format Guide</h4>
          <div className="text-sm text-blue-700 font-montserrat space-y-1">
            <p><strong>Required Columns:</strong> Unit Number, Floor, Type, Area (sq.ft), Price</p>
            <p><strong>Optional Columns:</strong> Discount Price, Registration Fee, ROI %, Payment Plan</p>
            <p><strong>Sheet Name:</strong> Use format "Project Name - Possession Date" (e.g., "Sky Tower BBay - Q4 2028")</p>
            <p><strong>Multi-Project:</strong> Use separate sheets for each project</p>
          </div>
        </div>

        {excelFile && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" strokeWidth={1.5} />
                <span className="text-sm font-medium text-green-800 font-montserrat">
                  {excelFile.name}
                </span>
              </div>
              <button
                onClick={() => setExcelFile(null)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploadStatus.stage !== 'idle' && (
          <div className="bg-neutral-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                {getStageIcon(uploadStatus.stage)}
                <span className="ml-2 font-medium text-neutral-800 font-montserrat">
                  {uploadStatus.message}
                </span>
              </div>
              <span className="text-sm font-bold text-primary-600 font-montserrat">
                {uploadStatus.progress}%
              </span>
            </div>
            
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadStatus.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload Summary */}
        {uploadStatus.stage === 'complete' && uploadStatus.summary && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" strokeWidth={1.5} />
              <h4 className="font-bold text-green-800 font-montserrat">Upload Successful!</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700 font-montserrat">Total Units:</span>
                <span className="font-bold text-green-800 font-montserrat ml-2">
                  {uploadStatus.summary.totalUnits}
                </span>
              </div>
              <div>
                <span className="text-green-700 font-montserrat">Processed:</span>
                <span className="font-bold text-green-800 font-montserrat ml-2">
                  {uploadStatus.summary.processed}
                </span>
              </div>
              <div>
                <span className="text-green-700 font-montserrat">Skipped:</span>
                <span className="font-bold text-green-800 font-montserrat ml-2">
                  {uploadStatus.summary.skipped}
                </span>
              </div>
              {uploadStatus.summary.projects && (
                <div>
                  <span className="text-green-700 font-montserrat">Projects:</span>
                  <span className="font-bold text-green-800 font-montserrat ml-2">
                    {uploadStatus.summary.projects}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {uploadStatus.stage === 'error' && uploadStatus.errors && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-3">
              <AlertCircle className="w-6 h-6 text-red-600 mr-2" strokeWidth={1.5} />
              <h4 className="font-bold text-red-800 font-montserrat">Upload Failed</h4>
            </div>
            <div className="space-y-2">
              {uploadStatus.errors.map((error, index) => (
                <p key={index} className="text-sm text-red-700 font-montserrat">
                  {error}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" strokeWidth={1.5} />
                <h4 className="font-bold text-yellow-800 font-montserrat">
                  {validationErrors.length} Validation Issues Found
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={downloadErrorReport}
                  className="flex items-center text-yellow-700 text-sm font-medium font-montserrat hover:text-yellow-800"
                >
                  <Download className="w-4 h-4 mr-1" strokeWidth={1.5} />
                  Download Report
                </button>
                <button
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                  className="text-yellow-700 text-sm font-medium font-montserrat hover:text-yellow-800"
                >
                  {showErrorDetails ? 'Hide' : 'Show'} Details
                </button>
              </div>
            </div>

            {showErrorDetails && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {validationErrors.map((error, index) => (
                  <div key={index} className="text-sm bg-white rounded p-3 border border-yellow-300">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-yellow-800 font-montserrat">
                        Row {error.row} - {error.column}
                      </span>
                      <span className="text-xs text-yellow-600 font-montserrat">
                        Value: {error.value}
                      </span>
                    </div>
                    <p className="text-yellow-700 font-montserrat mt-1">{error.error}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Parsed Data Preview */}
        {parsedData.length > 0 && uploadStatus.stage === 'complete' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-blue-800 font-montserrat mb-3">Parsed Data Preview</h4>
            <div className="space-y-3">
              {parsedData.map((project, index) => (
                <div key={index} className="bg-white rounded p-3 border border-blue-300">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-blue-800 font-montserrat">{project.name}</h5>
                    <span className="text-xs text-blue-600 font-montserrat">
                      {project.units.length} units
                    </span>
                  </div>
                  {project.possessionDate && (
                    <p className="text-xs text-blue-700 font-montserrat">
                      Possession: {project.possessionDate}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-blue-600 font-montserrat">
                    Sample units: {project.units.slice(0, 3).map(u => u.unitNumber).join(', ')}
                    {project.units.length > 3 && '...'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {uploadStatus.stage === 'idle' && (
            <button
              onClick={handleStartUpload}
              disabled={!excelFile}
              className="flex-1 flex items-center justify-center py-3 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Start Upload
            </button>
          )}
          
          {uploadStatus.stage === 'complete' && (
            <>
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Upload More
              </button>
              <button
                onClick={() => onUploadComplete?.({ success: true, data: parsedData })}
                className="flex-1 flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-lg font-medium font-montserrat hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Complete
              </button>
            </>
          )}
          
          {uploadStatus.stage === 'error' && (
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center py-3 px-4 bg-red-100 text-red-700 rounded-lg font-medium font-montserrat hover:bg-red-200 transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Try Again
            </button>
          )}
          
          {uploadStatus.stage !== 'idle' && uploadStatus.stage !== 'complete' && uploadStatus.stage !== 'error' && (
            <button
              disabled
              className="flex-1 flex items-center justify-center py-3 px-4 bg-neutral-100 text-neutral-500 rounded-lg font-medium font-montserrat cursor-not-allowed"
            >
              Processing...
            </button>
          )}
        </div>
      </div>

      {/* Smart Detection Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-bold text-purple-800 font-montserrat mb-2">Smart Excel Detection</h4>
        <div className="text-sm text-purple-700 font-montserrat space-y-1">
          <p>✓ Automatically detects single vs multi-project sheets</p>
          <p>✓ Extracts project metadata from sheet names</p>
          <p>✓ Maps columns with flexible naming (Unit No./Unit Number/Unit)</p>
          <p>✓ Validates pricing reasonability and unit consistency</p>
          <p>✓ Supports complex pricing structures and payment plans</p>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploadSystem;