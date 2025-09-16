import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, User, Phone, Mail, Building, DollarSign, Calendar, RefreshCw, MessageCircle } from 'lucide-react';
import { mockLeads, mockDevelopers } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser } from '../data/mockData';

const AdminLeadDetails: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  
  const lead = mockLeads.find(l => l.id === leadId);

  if (!lead) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Lead not found</h2>
          <button 
            onClick={() => navigate('/admin/leads-bookings')}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back to leads
          </button>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    buyerName: lead.buyerName,
    phone: lead.phone,
    email: lead.email,
    status: lead.status,
    budget: lead.budget,
    requirements: lead.requirements
  });

  const statusOptions = ['Hot', 'Warm', 'Cold'];
  const agentOptions = ['Arjun Mehta', 'Sarah Wilson', 'John Smith', 'Priya Patel'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Saving lead changes:', formData);
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    setFormData({
      buyerName: lead.buyerName,
      phone: lead.phone,
      email: lead.email,
      status: lead.status,
      budget: lead.budget,
      requirements: lead.requirements
    });
    setIsEditing(false);
  };

  const handleReassign = (newAgent: string) => {
    console.log(`Reassigning lead ${leadId} to agent: ${newAgent}`);
    setShowReassignModal(false);
    // In real app, this would update the backend and send notifications
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Warm':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cold':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <RoleBasedLayout user={mockAdminUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/admin/leads-bookings')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                  ADMIN DASHBOARD
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
                </h1>
                <p className="text-sm text-neutral-500 font-montserrat">Lead Details</p>
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
                  Edit Lead
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        {/* Lead Information */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleInputChange}
                    className="w-full text-xl font-bold text-neutral-800 font-montserrat mb-2 px-3 py-2 bg-neutral-50 border-0 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-neutral-800 font-montserrat mb-2">
                    {lead.buyerName}
                  </h2>
                )}
                
                <div className="space-y-1 text-sm text-neutral-600">
                  {isEditing ? (
                    <>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-1 bg-neutral-50 border-0 rounded-lg font-montserrat focus:ring-2 focus:ring-primary-600"
                        />
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-1 bg-neutral-50 border-0 rounded-lg font-montserrat focus:ring-2 focus:ring-primary-600"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        <span className="font-montserrat">{lead.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        <span className="font-montserrat">{lead.email}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {!isEditing && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium font-montserrat border ${getStatusColor(lead.status)}`}>
                {lead.status}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                Lead Status
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
          )}
        </div>

        {/* Lead Details */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Lead Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm text-neutral-500 font-montserrat">Project Interest:</span>
                <span className="font-medium text-neutral-800 font-montserrat ml-2">{lead.projectName}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm text-neutral-500 font-montserrat">Developer:</span>
                <span className="font-medium text-neutral-800 font-montserrat ml-2">{lead.developerName}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                Budget Range
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                />
              ) : (
                <p className="text-lg font-bold text-primary-600 font-montserrat">{lead.budget}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                Requirements
              </label>
              {isEditing ? (
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 resize-none"
                />
              ) : (
                <p className="text-neutral-600 font-montserrat">{lead.requirements}</p>
              )}
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-500 font-montserrat">Last Interaction:</span>
              <span className="font-medium text-neutral-800 font-montserrat ml-2">{lead.lastInteraction}</span>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Admin Actions</h3>
          
          <div className="space-y-3">
            <button 
              onClick={() => setShowReassignModal(true)}
              className="w-full flex items-center justify-center py-3 px-4 bg-blue-100 text-blue-700 rounded-lg font-medium font-montserrat hover:bg-blue-200 transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Reassign to Different Agent
            </button>
            
            <button 
              onClick={() => alert('Contact lead functionality would open communication tools')}
              className="w-full flex items-center justify-center py-3 px-4 bg-green-100 text-green-700 rounded-lg font-medium font-montserrat hover:bg-green-200 transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Contact Lead
            </button>
          </div>
        </div>
      </div>

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Reassign Lead</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Select New Agent
                </label>
                <select className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer">
                  {agentOptions.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Reason for Reassignment
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 resize-none"
                  placeholder="Enter reason for reassignment..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowReassignModal(false)}
                className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleReassign('Selected Agent')}
                className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                Reassign
              </button>
            </div>
          </div>
        </div>
      )}
    </RoleBasedLayout>
  );
};

export default AdminLeadDetails;