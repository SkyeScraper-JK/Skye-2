import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Edit, Check, X } from 'lucide-react';
import { mockProjects, getMockPropertyDetails } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser } from '../data/mockData';

const AdminUnitManagement: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [editingUnit, setEditingUnit] = useState<string | null>(null);
  const [unitChanges, setUnitChanges] = useState<Record<string, any>>({});
  
  const project = mockProjects.find(p => p.id === projectId);
  const propertyDetails = getMockPropertyDetails(projectId!);

  if (!project || !propertyDetails) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500 text-white';
      case 'Held':
        return 'bg-yellow-500 text-white';
      case 'Sold':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusOptions = () => ['Available', 'Held', 'Sold'];

  const handleEditUnit = (unitId: string) => {
    const unit = propertyDetails.units.find(u => u.id === unitId);
    if (unit) {
      setEditingUnit(unitId);
      setUnitChanges({
        [unitId]: {
          price: unit.price,
          status: unit.status,
          size: unit.size
        }
      });
    }
  };

  const handleSaveUnit = (unitId: string) => {
    // Here you would typically save to backend
    console.log('Saving unit changes:', unitChanges[unitId]);
    setEditingUnit(null);
    setUnitChanges(prev => {
      const updated = { ...prev };
      delete updated[unitId];
      return updated;
    });
  };

  const handleCancelEdit = (unitId: string) => {
    setEditingUnit(null);
    setUnitChanges(prev => {
      const updated = { ...prev };
      delete updated[unitId];
      return updated;
    });
  };

  const handleUnitChange = (unitId: string, field: string, value: string) => {
    setUnitChanges(prev => ({
      ...prev,
      [unitId]: {
        ...prev[unitId],
        [field]: value
      }
    }));
  };

  // Group units by floor
  const unitsByFloor = propertyDetails.units.reduce((acc, unit) => {
    if (!acc[unit.floor]) {
      acc[unit.floor] = [];
    }
    acc[unit.floor].push(unit);
    return acc;
  }, {} as Record<number, typeof propertyDetails.units>);

  const floors = Object.keys(unitsByFloor).map(Number).sort((a, b) => b - a);

  return (
    <RoleBasedLayout user={mockAdminUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(`/admin/projects/${projectId}`)}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                  ADMIN DASHBOARD
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
                </h1>
                <p className="text-sm text-neutral-500 font-montserrat">Unit Management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Summary */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-neutral-800 font-montserrat">{project.name}</h2>
            <p className="text-sm text-neutral-500 font-montserrat">{project.location}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-primary-600 font-montserrat">{project.startingPrice}</p>
            <p className="text-xs text-neutral-500 font-montserrat">Starting Price</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="font-montserrat text-neutral-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span className="font-montserrat text-neutral-600">Held</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
            <span className="font-montserrat text-neutral-600">Sold</span>
          </div>
        </div>
      </div>

      {/* Units Management */}
      <div className="p-4 pb-24">
        <div className="space-y-6">
          {floors.map((floorNumber) => (
            <div key={floorNumber} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4 text-center">
                Floor {floorNumber}
              </h3>
              
              <div className="space-y-3">
                {unitsByFloor[floorNumber].map((unit) => {
                  const isEditing = editingUnit === unit.id;
                  const changes = unitChanges[unit.id] || {};
                  
                  return (
                    <div key={unit.id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium font-montserrat ${getStatusColor(changes.status || unit.status)}`}>
                            {changes.status || unit.status}
                          </div>
                          <span className="font-bold text-neutral-800 font-montserrat">{unit.unitNumber}</span>
                          <span className="text-sm text-neutral-600 font-montserrat">{unit.type}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {isEditing ? (
                            <>
                              <button 
                                onClick={() => handleSaveUnit(unit.id)}
                                className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                              >
                                <Check className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                              <button 
                                onClick={() => handleCancelEdit(unit.id)}
                                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <X className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleEditUnit(unit.id)}
                              className="p-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                            >
                              <Edit className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-neutral-500 font-montserrat mb-1">Price</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={changes.price || unit.price}
                              onChange={(e) => handleUnitChange(unit.id, 'price', e.target.value)}
                              className="w-full px-3 py-2 bg-neutral-50 border-0 rounded-lg text-sm font-montserrat focus:ring-2 focus:ring-primary-600"
                            />
                          ) : (
                            <span className="text-sm font-medium text-neutral-800 font-montserrat">{unit.price}</span>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs text-neutral-500 font-montserrat mb-1">Size</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={changes.size || unit.size}
                              onChange={(e) => handleUnitChange(unit.id, 'size', e.target.value)}
                              className="w-full px-3 py-2 bg-neutral-50 border-0 rounded-lg text-sm font-montserrat focus:ring-2 focus:ring-primary-600"
                            />
                          ) : (
                            <span className="text-sm font-medium text-neutral-800 font-montserrat">{unit.size}</span>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs text-neutral-500 font-montserrat mb-1">Status</label>
                          {isEditing ? (
                            <select
                              value={changes.status || unit.status}
                              onChange={(e) => handleUnitChange(unit.id, 'status', e.target.value)}
                              className="w-full px-3 py-2 bg-neutral-50 border-0 rounded-lg text-sm font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer"
                            >
                              {getStatusOptions().map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-sm font-medium text-neutral-800 font-montserrat">{unit.status}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default AdminUnitManagement;