import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Building, CreditCard, Calendar, CheckCircle } from 'lucide-react';
import { getMockPropertyDetails } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const BookingFormPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Buyer Details
    buyerName: '',
    phone: '',
    email: '',
    address: '',
    
    // Unit Selection
    selectedUnit: '',
    
    // Booking Details
    bookingAmount: '',
    paymentMethod: 'bank_transfer',
    
    // Agreement
    termsAccepted: false
  });

  const property = getMockPropertyDetails(propertyId!);

  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Property not found</h2>
          <button 
            onClick={() => navigate(-1)}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const availableUnits = property.units.filter(unit => unit.status === 'Available');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Create booking
    console.log('Creating booking:', formData);
    navigate('/bookings');
  };

  const steps = [
    { id: 1, title: 'Buyer Details', icon: User },
    { id: 2, title: 'Unit Selection', icon: Building },
    { id: 3, title: 'Booking Details', icon: CreditCard },
    { id: 4, title: 'Confirmation', icon: CheckCircle }
  ];

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(`/property/${propertyId}`)}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            
            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                PROPERTY AGENT
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">Book Property</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <span className={`text-xs font-medium font-montserrat ${
                  currentStep >= step.id ? 'text-primary-600' : 'text-neutral-500'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Property Header */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="flex items-center space-x-3">
          <img 
            src={property.image} 
            alt={property.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-lg font-bold text-neutral-800 font-montserrat">{property.name}</h2>
            <p className="text-sm text-neutral-500 font-montserrat">{property.location}</p>
            <p className="text-sm text-primary-600 font-montserrat">by {property.developer}</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-4 py-6 pb-32">
        {/* Step 1: Buyer Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Buyer Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                    placeholder="Enter buyer's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                    placeholder="buyer@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200 resize-none"
                    placeholder="Enter buyer's address"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Unit Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Select Unit</h3>
              
              <div className="space-y-3">
                {availableUnits.map((unit) => (
                  <label key={unit.id} className="block">
                    <input
                      type="radio"
                      name="selectedUnit"
                      value={unit.id}
                      checked={formData.selectedUnit === unit.id}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.selectedUnit === unit.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-neutral-800 font-montserrat">{unit.unitNumber}</h4>
                          <p className="text-sm text-neutral-600 font-montserrat">{unit.type} • Floor {unit.floor}</p>
                          <p className="text-sm text-neutral-500 font-montserrat">{unit.size}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600 font-montserrat">{unit.price}</p>
                          <div className="w-3 h-3 bg-green-500 rounded-full ml-auto"></div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Booking Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Booking Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Booking Amount *
                  </label>
                  <input
                    type="text"
                    name="bookingAmount"
                    value={formData.bookingAmount}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                    placeholder="₹5,00,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Payment Method *
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="demand_draft">Demand Draft</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <h4 className="font-bold text-neutral-800 font-montserrat mb-2">Buyer Details</h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-montserrat"><span className="text-neutral-500">Name:</span> {formData.buyerName}</p>
                    <p className="font-montserrat"><span className="text-neutral-500">Phone:</span> {formData.phone}</p>
                    <p className="font-montserrat"><span className="text-neutral-500">Email:</span> {formData.email}</p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 rounded-lg">
                  <h4 className="font-bold text-neutral-800 font-montserrat mb-2">Unit Details</h4>
                  {formData.selectedUnit && (
                    <div className="text-sm">
                      {(() => {
                        const selectedUnit = availableUnits.find(u => u.id === formData.selectedUnit);
                        return selectedUnit ? (
                          <div className="space-y-1">
                            <p className="font-montserrat"><span className="text-neutral-500">Unit:</span> {selectedUnit.unitNumber}</p>
                            <p className="font-montserrat"><span className="text-neutral-500">Type:</span> {selectedUnit.type}</p>
                            <p className="font-montserrat"><span className="text-neutral-500">Floor:</span> {selectedUnit.floor}</p>
                            <p className="font-montserrat"><span className="text-neutral-500">Size:</span> {selectedUnit.size}</p>
                            <p className="font-montserrat"><span className="text-neutral-500">Price:</span> {selectedUnit.price}</p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-neutral-50 rounded-lg">
                  <h4 className="font-bold text-neutral-800 font-montserrat mb-2">Booking Details</h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-montserrat"><span className="text-neutral-500">Booking Amount:</span> {formData.bookingAmount}</p>
                    <p className="font-montserrat"><span className="text-neutral-500">Payment Method:</span> {formData.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-600"
                  />
                  <label className="text-sm text-neutral-700 font-montserrat">
                    I agree to the terms and conditions and booking policies
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-neutral-200 p-4">
        <div className="flex space-x-3 max-w-md mx-auto">
          {currentStep > 1 && (
            <button 
              onClick={handlePrevious}
              className="flex-1 py-3 px-6 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
            >
              Previous
            </button>
          )}
          
          {currentStep < 4 ? (
            <button 
              onClick={handleNext}
              disabled={
                (currentStep === 1 && (!formData.buyerName || !formData.phone || !formData.email)) ||
                (currentStep === 2 && !formData.selectedUnit) ||
                (currentStep === 3 && (!formData.bookingAmount || !formData.paymentMethod))
              }
              className="flex-1 py-3 px-6 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={!formData.termsAccepted}
              className="flex-1 py-3 px-6 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Booking
            </button>
          )}
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default BookingFormPage;