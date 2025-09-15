import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X, MapPin, Calendar, Building, DollarSign, CreditCard, Grid3X3, Trash2 } from 'lucide-react';
import DeveloperBottomNavigation from '../components/DeveloperBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser, mockDeveloperProfile } from '../data/mockData';

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
    startingPrice: '',
    possessionDate: '',
    status: 'Planning',
    totalUnits: '',
    description: '',
    amenities: [] as string[],
    paymentPlans: [] as Array<{
      id: string;
      name: string;
      downPayment: string;
      installments: string;
      possessionPayment: string;
      emiAmount?: string;
      tenure?: string;
    }>,
    availabilityGrid: {
      totalFloors: '',
      unitsPerFloor: '',
      unitTypes: [] as Array<{
        type: string;
        count: number;
        area: string;
        price: string;
      }>
    }
  });
  const [newAmenity, setNewAmenity] = useState('');
  const [newPaymentPlan, setNewPaymentPlan] = useState({
    name: '',
    downPayment: '',
    installments: '',
    possessionPayment: '',
    emiAmount: '',
    tenure: ''
  });
  const [newUnitType, setNewUnitType] = useState({
    type: '',
    count: '',
    area: '',
    price: ''
  });

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

  const addPaymentPlan = () => {
    if (newPaymentPlan.name && newPaymentPlan.downPayment && newPaymentPlan.installments && newPaymentPlan.possessionPayment) {
      setFormData(prev => ({
        ...prev,
        paymentPlans: [...prev.paymentPlans, {
          id: Date.now().toString(),
          ...newPaymentPlan
        }]
      }));
      setNewPaymentPlan({
        name: '',
        downPayment: '',
        installments: '',
        possessionPayment: '',
        emiAmount: '',
        tenure: ''
      });
    }
  };

  const removePaymentPlan = (id: string) => {
    setFormData(prev => ({
      ...prev,
      paymentPlans: prev.paymentPlans.filter(plan => plan.id !== id)
    }));
  };

  const addUnitType = () => {
    if (newUnitType.type && newUnitType.count && newUnitType.area && newUnitType.price) {
      setFormData(prev => ({
        ...prev,
        availabilityGrid: {
          ...prev.availabilityGrid,
          unitTypes: [...prev.availabilityGrid.unitTypes, {
            type: newUnitType.type,
            count: parseInt(newUnitType.count),
            area: newUnitType.area,
            price: newUnitType.price
          }]
        }
      }));
      setNewUnitType({
        type: '',
        count: '',
        area: '',
        price: ''
      });
    }
  };

  const removeUnitType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availabilityGrid: {
        ...prev.availabilityGrid,
        unitTypes: prev.availabilityGrid.unitTypes.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Project data:', formData);
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Starting Price *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      name="startingPrice"
                      value={formData.startingPrice}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                      placeholder="₹1.2 Cr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Possession Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      name="possessionDate"
                      value={formData.possessionDate}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                      placeholder="Dec 2025"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Total Units *
                </label>
                <input
                  type="number"
                  name="totalUnits"
                  value={formData.totalUnits}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                  placeholder="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200 resize-none"
                  placeholder="Enter project description..."
                />
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

          {/* Project Images */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Project Images</h3>
            
            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" strokeWidth={1.5} />
              <h4 className="text-lg font-medium text-neutral-700 font-montserrat mb-2">
                Upload Project Images
              </h4>
              <p className="text-sm text-neutral-500 font-montserrat mb-4">
                Drag and drop images here, or click to browse
              </p>
              <button
                type="button"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                Choose Files
              </button>
            </div>
          </div>

          {/* Payment Plans */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="w-5 h-5 text-green-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Payment Plans</h3>
            </div>
            
            <div className="space-y-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Plan Name (e.g., Standard Plan)"
                  value={newPaymentPlan.name}
                  onChange={(e) => setNewPaymentPlan(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                />
                <input
                  type="text"
                  placeholder="Down Payment (e.g., 20%)"
                  value={newPaymentPlan.downPayment}
                  onChange={(e) => setNewPaymentPlan(prev => ({ ...prev, downPayment: e.target.value }))}
                  className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Installments (e.g., 70% in 24 months)"
                  value={newPaymentPlan.installments}
                  onChange={(e) => setNewPaymentPlan(prev => ({ ...prev, installments: e.target.value }))}
                  className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                />
                <input
                  type="text"
                  placeholder="Possession Payment (e.g., 10%)"
                  value={newPaymentPlan.possessionPayment}
                  onChange={(e) => setNewPaymentPlan(prev => ({ ...prev, possessionPayment: e.target.value }))}
                  className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="EMI Amount (Optional)"
                  value={newPaymentPlan.emiAmount}
                  onChange={(e) => setNewPaymentPlan(prev => ({ ...prev, emiAmount: e.target.value }))}
                  className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                />
                <input
                  type="text"
                  placeholder="Tenure (Optional)"
                  value={newPaymentPlan.tenure}
                  onChange={(e) => setNewPaymentPlan(prev => ({ ...prev, tenure: e.target.value }))}
                  className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                />
              </div>
              
              <button
                type="button"
                onClick={addPaymentPlan}
                className="w-full flex items-center justify-center py-3 px-4 bg-primary-600 text-white rounded-xl font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Add Payment Plan
              </button>
            </div>

            {formData.paymentPlans.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-neutral-700 font-montserrat">Added Payment Plans:</h4>
                {formData.paymentPlans.map((plan) => (
                  <div key={plan.id} className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-bold text-primary-800 font-montserrat mb-2">{plan.name}</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm text-primary-700">
                          <div>Down Payment: <span className="font-medium">{plan.downPayment}</span></div>
                          <div>Installments: <span className="font-medium">{plan.installments}</span></div>
                          <div>Possession: <span className="font-medium">{plan.possessionPayment}</span></div>
                          {plan.emiAmount && <div>EMI: <span className="font-medium">{plan.emiAmount}</span></div>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePaymentPlan(plan.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability Grid Setup */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <Grid3X3 className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Availability Grid Setup</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Total Floors
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 15"
                    value={formData.availabilityGrid.totalFloors}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      availabilityGrid: { ...prev.availabilityGrid, totalFloors: e.target.value }
                    }))}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Units Per Floor
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 8"
                    value={formData.availabilityGrid.unitsPerFloor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      availabilityGrid: { ...prev.availabilityGrid, unitsPerFloor: e.target.value }
                    }))}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-neutral-700 font-montserrat mb-3">Unit Types Configuration</h4>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    placeholder="Unit Type (e.g., 2 BHK)"
                    value={newUnitType.type}
                    onChange={(e) => setNewUnitType(prev => ({ ...prev, type: e.target.value }))}
                    className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                  />
                  <input
                    type="number"
                    placeholder="Count per Floor"
                    value={newUnitType.count}
                    onChange={(e) => setNewUnitType(prev => ({ ...prev, count: e.target.value }))}
                    className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    placeholder="Area (e.g., 1200 sq.ft)"
                    value={newUnitType.area}
                    onChange={(e) => setNewUnitType(prev => ({ ...prev, area: e.target.value }))}
                    className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Starting Price (e.g., ₹1.2 Cr)"
                    value={newUnitType.price}
                    onChange={(e) => setNewUnitType(prev => ({ ...prev, price: e.target.value }))}
                    className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={addUnitType}
                  className="w-full flex items-center justify-center py-3 px-4 bg-primary-600 text-white rounded-xl font-medium font-montserrat hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" strokeWidth={1.5} />
                  Add Unit Type
                </button>
              </div>
            </div>

            {formData.availabilityGrid.unitTypes.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-neutral-700 font-montserrat">Unit Types:</h4>
                {formData.availabilityGrid.unitTypes.map((unitType, index) => (
                  <div key={index} className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 text-sm text-primary-700">
                          <span className="font-bold">{unitType.type}</span>
                          <span>{unitType.count} units/floor</span>
                          <span>{unitType.area}</span>
                          <span className="font-medium">{unitType.price}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUnitType(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              Create Project
            </button>
          </div>
        </form>
      </div>

    </RoleBasedLayout>
  );
};

export default AddProject;