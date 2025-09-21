import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Phone, Mail, Star, Eye, RotateCcw, MessageCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { mockLeads } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser } from '../data/mockData';

const AdminLeads: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');
  const [showReassignModal, setShowReassignModal] = useState<string | null>(null);
  const [reassignReason, setReassignReason] = useState('');

  const stageOptions = ['All', 'New', 'Contacted', 'Site Visit', 'Negotiation', 'Closed'];
  const statusOptions = ['All', 'Hot', 'Warm', 'Cold'];
  const agentOptions = ['All', 'Arjun Mehta', 'Sarah Wilson', 'David Kumar', 'Priya Patel'];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Site Visit':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Negotiation':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Closed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
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

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.developerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'All' || lead.stage === stageFilter;
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    // For demo purposes, we'll use mock agent names
    const matchesAgent = agentFilter === 'All' || true; // Would filter by actual agent
    return matchesSearch && matchesStage && matchesStatus && matchesAgent;
  });

  const handleReassignLead = (leadId: string) => {
    setShowReassignModal(leadId);
  };

  const handleConfirmReassign = () => {
    console.log(`Reassigning lead ${showReassignModal} to new agent. Reason: ${reassignReason}`);
    setShowReassignModal(null);
    setReassignReason('');
  };

  const handleUpdateStage = (leadId: string, newStage: string) => {
    console.log(`Admin updating lead ${leadId} stage to ${newStage}`);
  };

  const handleViewDetails = (leadId: string) => {
    navigate(`/admin/leads/${leadId}`);
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
              <p className="text-sm text-neutral-500 font-montserrat">Lead Management</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search leads by buyer, project, or developer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-3">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              {stageOptions.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              {agentOptions.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lead Stats */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="grid grid-cols-5 gap-2 text-center">
          <div>
            <div className="text-sm font-bold text-blue-600 font-montserrat">
              {mockLeads.filter(l => l.stage === 'New').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">New</div>
          </div>
          <div>
            <div className="text-sm font-bold text-yellow-600 font-montserrat">
              {mockLeads.filter(l => l.stage === 'Contacted').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Contacted</div>
          </div>
          <div>
            <div className="text-sm font-bold text-purple-600 font-montserrat">
              {mockLeads.filter(l => l.stage === 'Site Visit').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Site Visit</div>
          </div>
          <div>
            <div className="text-sm font-bold text-orange-600 font-montserrat">
              {mockLeads.filter(l => l.stage === 'Negotiation').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Negotiation</div>
          </div>
          <div>
            <div className="text-sm font-bold text-green-600 font-montserrat">
              {mockLeads.filter(l => l.stage === 'Closed').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Closed</div>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="px-4 py-6 pb-24">
        <div className="mb-4">
          <span className="text-sm text-neutral-600 font-montserrat">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-neutral-800 font-montserrat">
                      {lead.buyerName}
                    </h3>
                    <div className="flex items-center">
                      <Star className={`w-4 h-4 mr-1 ${getScoreColor(lead.score)}`} strokeWidth={1.5} />
                      <span className={`text-sm font-bold font-montserrat ${getScoreColor(lead.score)}`}>
                        {lead.score}/10
                      </span>
                    </div>
                  </div>
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
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {lead.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium font-montserrat rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getStageColor(lead.stage)}`}>
                    {lead.stage}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Project:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{lead.projectName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Developer:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{lead.developerName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Budget:</span>
                  <span className="font-medium text-primary-600 font-montserrat">{lead.budget}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Last Interaction:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{lead.lastInteraction}</span>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex space-x-2 pt-3 border-t border-neutral-100">
                <button 
                  onClick={() => handleViewDetails(lead.id)}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat text-sm hover:bg-neutral-200 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  View Details
                </button>
                <button 
                  onClick={() => handleReassignLead(lead.id)}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-blue-100 text-blue-700 rounded-lg font-medium font-montserrat text-sm hover:bg-blue-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Reassign
                </button>
                <button 
                  onClick={() => handleUpdateStage(lead.id, 'Contacted')}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-red-600 text-white rounded-lg font-medium font-montserrat text-sm hover:bg-red-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Update Stage
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No leads found</h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
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
                  {agentOptions.slice(1).map(agent => (
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
                onClick={() => setShowReassignModal(null)}
                className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReassign}
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

export default AdminLeads;