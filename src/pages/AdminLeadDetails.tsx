import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, Phone, Mail, Star, RotateCcw, AlertTriangle, User, Building } from 'lucide-react';
import { mockLeads } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser } from '../data/mockData';

const AdminLeadDetails: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignReason, setReassignReason] = useState('');
  
  const lead = mockLeads.find(l => l.id === leadId);

  if (!lead) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Lead not found</h2>
          <button 
            onClick={() => navigate('/admin/leads')}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back to leads
          </button>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    stage: lead.stage,
    status: lead.status,
    budget: lead.budget,
    requirements: lead.requirements,
    score: lead.score.toString()
  });

  const stageOptions = ['New', 'Contacted', 'Site Visit', 'Negotiation', 'Closed'];
  const statusOptions = ['Hot', 'Warm', 'Cold'];
  const agentOptions = ['Arjun Mehta', 'Sarah Wilson', 'David Kumar', 'Priya Patel'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Admin updating lead:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      stage: lead.stage,
      status: lead.status,
      budget: lead.budget,
      requirements: lead.requirements,
      score: lead.score.toString()
    });
    setIsEditing(false);
  };

  const handleReassign = () => {
    console.log(`Reassigning lead to new agent. Reason: ${reassignReason}`);
    setShowReassignModal(false);
    setReassignReason('');
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New':
        return 'bg-blue-100 text-blue-700';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-700';
      case 'Site Visit':
        return 'bg-purple-100 text-purple-700';
      case 'Negotiation':
        return 'bg-orange-100 text-orange-700';
      case 'Closed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot':
        return 'bg-red-100 text-red-700';
      case 'Warm':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cold':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <RoleBasedLayout user={mockAdminUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/admin/leads')}
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
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg font-medium font-montserrat hover:bg-red-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Save
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg font-medium font-montserrat hover:bg-red-700 transition-colors"
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
        {/* Lead Header */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-neutral-800 font-montserrat mb-2">
                  {lead.buyerName}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-2">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" strokeWidth={1.5} />
                    <span className="font-montserrat">{lead.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" strokeWidth={1.5} />
                    <span className="font-montserrat">{lead.email}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className={`w-5 h-5 mr-1 ${getScoreColor(lead.score)}`} strokeWidth={1.5} />
                  {isEditing ? (
                    <input
                      type="number"
                      name="score"
                      value={formData.score}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-16 px-2 py-1 bg-neutral-50 border-0 rounded text-sm font-montserrat focus:ring-2 focus:ring-primary-600"
                    />
                  ) : (
                    <span className={`text-lg font-bold font-montserrat ${getScoreColor(lead.score)}`}>
                      {lead.score}/10
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              {isEditing ? (
                <>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleInputChange}
                    className="px-3 py-2 bg-neutral-50 border-0 rounded-lg text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer"
                  >
                    {stageOptions.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="px-3 py-2 bg-neutral-50 border-0 rounded-lg text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium font-montserrat ${getStageColor(lead.stage)}`}>
                    {lead.stage}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium font-montserrat ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Admin Actions</h3>
          
          <div className="space-y-3">
            <button 
              onClick={() => setShowReassignModal(true)}
              className="w-full flex items-center justify-center py-3 px-4 bg-blue-100 text-blue-700 rounded-lg font-medium font-montserrat hover:bg-blue-200 transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Reassign to Different Agent
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => console.log('Resolving conflict for lead:', leadId)}
                className="flex items-center justify-center py-3 px-4 bg-yellow-100 text-yellow-700 rounded-lg font-medium font-montserrat hover:bg-yellow-200 transition-colors"
              >
                <AlertTriangle className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Resolve Conflict
              </button>
              
              <button 
                onClick={() => console.log('Generating lead report for:', leadId)}
                className="flex items-center justify-center py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                <Building className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Lead Report
              </button>
            </div>
          </div>
        </div>

        {/* Lead Information */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Lead Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center">
                <Building className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
                <span className="text-sm text-neutral-600 font-montserrat">Project Interest</span>
              </div>
              <span className="font-medium text-neutral-800 font-montserrat">{lead.projectName}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
                <span className="text-sm text-neutral-600 font-montserrat">Developer</span>
              </div>
              <span className="font-medium text-neutral-800 font-montserrat">{lead.developerName}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-600 font-montserrat">Budget Range</span>
              {isEditing ? (
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-montserrat focus:ring-2 focus:ring-primary-600"
                />
              ) : (
                <span className="font-medium text-primary-600 font-montserrat">{lead.budget}</span>
              )}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-600 font-montserrat">Requirements</span>
              {isEditing ? (
                <input
                  type="text"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-montserrat focus:ring-2 focus:ring-primary-600"
                />
              ) : (
                <span className="font-medium text-neutral-800 font-montserrat">{lead.requirements}</span>
              )}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-600 font-montserrat">Last Interaction</span>
              <span className="font-medium text-neutral-800 font-montserrat">{lead.lastInteraction}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
              Reassign Lead
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Select New Agent
                </label>
                <select className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer">
                  <option value="">Choose agent...</option>
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
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200 resize-none"
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
                onClick={handleReassign}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium font-montserrat hover:bg-red-700 transition-colors"
              >
                Confirm Reassign
              </button>
            </div>
          </div>
        </div>
      )}

    </RoleBasedLayout>
  );
};

export default AdminLeadDetails;