import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, FileText, CheckCircle, AlertCircle, X, Download, RefreshCw } from 'lucide-react';

interface ExcelUploadSystemProps {
  projectId?: string;
  developerId?: string;
  onUploadComplete?: (data: any) => void;
  isAdmin?: boolean;
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

const ExcelUploadSystem: React.FC<ExcelUploadSystemProps> = ({
  projectId,
  developerId,
  onUploadComplete,
  isAdmin = false
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

  const simulateUploadProcess = async () => {
    if (!excelFile) return;

    // Stage 1: Uploading
    setUploadStatus({
      stage: 'uploading',
      progress: 10,
      message: 'Uploading files...'
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Stage 2: Parsing
    setUploadStatus({
      stage: 'parsing',
      progress: 30,
      message: 'Parsing Excel file and detecting structure...'
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Stage 3: Validating
    setUploadStatus({
      stage: 'validating',
      progress: 60,
      message: 'Validating unit data and pricing...'
    });

    // Simulate some validation errors
    const mockErrors: ValidationError[] = [
      { row: 15, column: 'price', error: 'Price per sq.ft seems unreasonable (₹45,000)', value: '₹54,00,000' },
      { row: 23, column: 'unit_number', error: 'Duplicate unit number found', value: 'A-101' },
      { row: 31, column: 'floor', error: 'Floor number inconsistent with unit number', value: '5' }
    ];

    setValidationErrors(mockErrors);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Stage 4: Saving
    setUploadStatus({
      stage: 'saving',
      progress: 85,
      message: 'Saving validated units to database...'
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Stage 5: Complete
    setUploadStatus({
      stage: 'complete',
      progress: 100,
      message: 'Upload completed successfully!',
      summary: {
        totalUnits: 120,
        processed: 117,
        skipped: 3,
        projects: 1
      }
    });

    if (onUploadComplete) {
      onUploadComplete({
        projectId,
        unitsProcessed: 117,
        unitsSkipped: 3,
        errors: mockErrors
      });
    }
  };

  const handleStartUpload = () => {
    if (!excelFile) {
      alert('Please select an Excel file to upload.');
      return;
    }
    simulateUploadProcess();
  };

  const handleReset = () => {
    setUploadStatus({ stage: 'idle', progress: 0, message: '' });
    setValidationErrors([]);
    setShowErrorDetails(false);
    setBrochureFile(null);
    setExcelFile(null);
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
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
            <FileSpreadsheet className="w-5 h-5 text-green-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Unit Inventory Excel</h3>
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
                onClick={() => onUploadComplete?.({ success: true })}
                className="flex-1 flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-lg font-medium font-montserrat hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Continue
              </button>
            </>
          )}
          
          {uploadStatus.stage !== 'idle' && uploadStatus.stage !== 'complete' && (
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