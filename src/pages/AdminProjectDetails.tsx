import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, MapPin, Calendar, Building, DollarSign, Users, TrendingUp, Grid3X3 } from 'lucide-react';
import { mockProjects, mockDevelopers } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser } from '../data/mockData';

const AdminProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const project = mockProjects.find(p => p.id === projectId);
  const developer = mockDevelopers.find(d => d.id === project?.developerId);

  if (!project || !developer) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Project not found</h2>
          <button 
            onClick={() => navigate('/admin/projects')}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back to projects
          </button>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: project.name,
    location: project.location,
    description: project.description,
    startingPrice: project.startingPrice,
    possessionDate: project.possessionDate,
    status: project.status,
    totalUnits: project.totalUnits.toString()
  });

  const statusOptions = ['Planning', 'Under Construction', 'Ready', 'Completed'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving project changes:', formData);
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    setFormData({
      name: project.name,
      location: project.location,
      description: project.description,
      startingPrice: project.startingPrice,
      possessionDate: project.possessionDate,
      status: project.status,
      totalUnits: project.totalUnits.toString()
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-700';
      case 'Under Construction':
        return 'bg-yellow-100 text-yellow-700';
      case 'Planning':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const occupancyPercentage = ((project.soldUnits + project.heldUnits) / project.totalUnits) * 100;

  return (
    <RoleBasedLayout user={mockAdminUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/admin/projects')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                  ADMIN DASHBOARD
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
                </h1>
                <p className="text-sm text-neutral-500 font-montserrat">Project Details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center px-3 py-2 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Save
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Edit Project
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <img 
                src={project.image} 
                alt={project.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full text-xl font-bold text-neutral-800 font-montserrat mb-2 px-3 py-2 bg-neutral-50 border-0 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-neutral-800 font-montserrat mb-2">
                    {project.name}
                  </h2>
                )}
                
                <p className="text-sm text-primary-600 font-montserrat mb-2">
                  by {developer.name}
                </p>
                
                {isEditing ? (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-0 rounded-lg text-neutral-600 font-montserrat focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    <span className="font-montserrat">{project.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            {!isEditing && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium font-montserrat ${getStatusColor(project.status)}`}>
                {project.status}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Total Units
                </label>
                <input
                  type="number"
                  name="totalUnits"
                  value={formData.totalUnits}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <span className="block text-lg font-bold text-neutral-800 font-montserrat">
                {project.totalUnits}
              </span>
              <span className="text-xs text-neutral-500 font-montserrat">Total Units</span>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <span className="block text-lg font-bold text-green-600 font-montserrat">
                {project.soldUnits}
              </span>
              <span className="text-xs text-green-700 font-montserrat">Sold</span>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <span className="block text-lg font-bold text-blue-600 font-montserrat">
                {project.availableUnits}
              </span>
              <span className="text-xs text-blue-700 font-montserrat">Available</span>
            </div>
          </div>

          {/* Occupancy Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-600 font-montserrat">Occupancy</span>
              <span className="text-sm font-bold text-primary-600 font-montserrat">{occupancyPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Project Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Starting Price
                </label>
                {isEditing ? (
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                      type="text"
                      name="startingPrice"
                      value={formData.startingPrice}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                ) : (
                  <p className="text-lg font-bold text-primary-600 font-montserrat">{project.startingPrice}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Possession Date
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                      type="text"
                      name="possessionDate"
                      value={formData.possessionDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                ) : (
                  <p className="text-lg font-medium text-neutral-800 font-montserrat">{project.possessionDate}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                Description
              </label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 resize-none"
                />
              ) : (
                <p className="text-neutral-600 font-montserrat leading-relaxed">{project.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm text-neutral-500 font-montserrat">Project Type:</span>
                <span className="font-medium text-neutral-800 font-montserrat ml-2">{project.type}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm text-neutral-500 font-montserrat">Developer:</span>
                <span className="font-medium text-neutral-800 font-montserrat ml-2">{developer.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Amenities</h3>
          <div className="grid grid-cols-2 gap-2">
            {project.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center text-sm text-neutral-600 p-3 bg-neutral-50 rounded-lg">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                <span className="font-montserrat">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unit Management */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Unit Management</h3>
            <button 
              onClick={() => navigate(`/admin/projects/${projectId}/units`)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
            >
              <Grid3X3 className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Manage Units
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 font-montserrat">
                {project.availableUnits}
              </div>
              <div className="text-sm text-green-700 font-montserrat">Available</div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 font-montserrat">
                {project.heldUnits}
              </div>
              <div className="text-sm text-yellow-700 font-montserrat">Held</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600 font-montserrat">
                {project.soldUnits}
              </div>
              <div className="text-sm text-gray-700 font-montserrat">Sold</div>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default AdminProjectDetails;