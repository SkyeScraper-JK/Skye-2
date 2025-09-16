import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Building, MapPin, Calendar, Users, TrendingUp, Edit, Eye, MoreVertical } from 'lucide-react';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser, mockProjects, mockDevelopers } from '../data/mockData';

const AdminProjects: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const statusOptions = ['all', 'Planning', 'Under Construction', 'Ready', 'Completed'];

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

  const getDeveloperName = (developerId: string) => {
    const developer = mockDevelopers.find(d => d.id === developerId);
    return developer?.name || 'Unknown Developer';
  };

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getDeveloperName(project.developerId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (projectId: string, action: string) => {
    setShowActionMenu(null);
    
    switch (action) {
      case 'view':
        navigate(`/developer/projects/${projectId}`);
        break;
      case 'edit':
        navigate(`/developer/projects/${projectId}/edit`);
        break;
      case 'units':
        navigate(`/property/${projectId}/availability`);
        break;
      default:
        break;
    }
  };

  return (
    <RoleBasedLayout user={mockAdminUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            
            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                ADMIN DASHBOARD
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">Project Management</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects by name, location, or developer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status}
                  </option>
                ))}
              </select>
            </div>
            <button className="p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
              <Filter className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="px-4 py-6 pb-24">
        <div className="mb-4">
          <span className="text-sm text-neutral-600 font-montserrat">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const occupancyPercentage = ((project.soldUnits + project.heldUnits) / project.totalUnits) * 100;
            
            return (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-primary-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-neutral-600 font-montserrat mb-2">
                        by {getDeveloperName(project.developerId)}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-2">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" strokeWidth={1.5} />
                          <span className="font-montserrat">{project.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" strokeWidth={1.5} />
                          <span className="font-montserrat">{project.possessionDate}</span>
                        </div>
                      </div>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium font-montserrat ${getStatusColor(project.status)}`}>
                        {project.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowActionMenu(showActionMenu === project.id ? null : project.id)}
                      className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                    </button>
                    
                    {showActionMenu === project.id && (
                      <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-10 min-w-[160px]">
                        <button 
                          onClick={() => handleAction(project.id, 'view')}
                          className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 font-montserrat"
                        >
                          <Eye className="w-4 h-4 mr-3" strokeWidth={1.5} />
                          View Details
                        </button>
                        <button 
                          onClick={() => handleAction(project.id, 'edit')}
                          className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 font-montserrat"
                        >
                          <Edit className="w-4 h-4 mr-3" strokeWidth={1.5} />
                          Edit Project
                        </button>
                        <button 
                          onClick={() => handleAction(project.id, 'units')}
                          className="w-full flex items-center px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 font-montserrat"
                        >
                          <Building className="w-4 h-4 mr-3" strokeWidth={1.5} />
                          Manage Units
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-neutral-50 rounded-lg">
                    <div className="text-lg font-bold text-neutral-800 font-montserrat">{project.totalUnits}</div>
                    <div className="text-xs text-neutral-500 font-montserrat">Total Units</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600 font-montserrat">{project.soldUnits}</div>
                    <div className="text-xs text-green-700 font-montserrat">Sold</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600 font-montserrat">{project.availableUnits}</div>
                    <div className="text-xs text-blue-700 font-montserrat">Available</div>
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

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-3 border-t border-neutral-100">
                  <button 
                    onClick={() => handleAction(project.id, 'view')}
                    className="flex-1 py-2 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat text-sm hover:bg-neutral-200 transition-colors"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleAction(project.id, 'units')}
                    className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat text-sm hover:bg-primary-700 transition-colors"
                  >
                    Manage Units
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No projects found</h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </RoleBasedLayout>
  );
};

export default AdminProjects;