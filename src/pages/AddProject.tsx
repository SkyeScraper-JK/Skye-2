import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, MapPin, Building } from 'lucide-react';
import DeveloperBottomNavigation from '../components/DeveloperBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser, mockDeveloperProfile } from '../data/mockData';
import ExcelUploadSystem from '../components/ExcelUploadSystem';

const AddProject: React.FC = () => {
  const navigate = useNavigate();
  
  // Create a developer user for the layout
  const developerUser = {
    ...mockCurrentUser,
    role: 'developer' as const,
    profile: mockDeveloperProfile
  };
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'Apartment',
    status: 'Planning',
    amenities: [] as string[]
  });
  const [newAmenity, setNewAmenity] = useState('');
  const [showUploadSystem, setShowUploadSystem] = useState(false);

  const projectTypes = ['Apartment', 'Villa', 'Flat', 'Plot', 'Office'];
  const statusOptions = ['Planning', 'Under Construction', 'Ready', 'Completed'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.location && formData.type) {
      setShowUploadSystem(true);
    }
  };

  const handleUploadComplete = (data: any) => {
    console.log('Project created with upload data:', { formData, uploadData: data });
    navigate('/developer/projects');
  };

  return (
    <RoleBasedLayout user={developerUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/developer/projects')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                  PROPERTY AGENT
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
                </h1>
                <p className="text-sm text-neutral-500 font-montserrat">Add New Project</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6 pb-24">
        {!showUploadSystem ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                      placeholder="Enter project location"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                      Property Type *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
                      >
                        {projectTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Amenities</h3>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    className="flex-1 px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                    placeholder="Add amenity"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                {formData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-primary-50 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium font-montserrat"
                      >
                        <span>{amenity}</span>
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          <X className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/developer/projects')}
                className="flex-1 py-3 px-6 bg-neutral-100 text-neutral-700 rounded-xl font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-primary-600 text-white rounded-xl font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                Continue to Upload
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Project Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Project Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-500 font-montserrat">Name:</span>
                  <span className="font-medium text-neutral-800 font-montserrat ml-2">{formData.name}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-montserrat">Location:</span>
                  <span className="font-medium text-neutral-800 font-montserrat ml-2">{formData.location}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-montserrat">Type:</span>
                  <span className="font-medium text-neutral-800 font-montserrat ml-2">{formData.type}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-montserrat">Status:</span>
                  <span className="font-medium text-neutral-800 font-montserrat ml-2">{formData.status}</span>
                </div>
              </div>
            </div>

            {/* Excel Upload System */}
            <ExcelUploadSystem
              developerId={mockDeveloperProfile.id}
              onUploadComplete={handleUploadComplete}
              isAdmin={false}
              projectFormData={formData}
            />

            {/* Back Button */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowUploadSystem(false)}
                className="flex-1 py-3 px-6 bg-neutral-100 text-neutral-700 rounded-xl font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                Back to Project Details
              </button>
            </div>
          </div>
        )}
      </div>

    </RoleBasedLayout>
  );
};

export default AddProject;