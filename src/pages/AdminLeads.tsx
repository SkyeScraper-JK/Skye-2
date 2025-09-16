import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Phone, Mail, MessageCircle, MoreVertical, Eye, RefreshCw, Edit } from 'lucide-react';
import { mockLeads, mockDevelopers } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser } from '../data/mockData';

const AdminLeads: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');
  const [developerFilter, setDeveloperFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const statusOptions = ['All', 'Hot', 'Warm', 'Cold'];
  const agentOptions = ['All', 'Arjun Mehta', 'Sarah Wilson', 'John Smith', 'Priya Patel'];
  const developerOptions = ['All', ...mockDevelopers.map(d => d.name)];
  const projectOptions = ['All', 'Godrej Meridien', 'DLF The Crest', 'Godrej Park Avenue', 'Prestige Lakeside', 'Brigade Gateway'];

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

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesDeveloper = developerFilter === 'All' || lead.developerName === developerFilter;
    const matchesProject = projectFilter === 'All' || lead.projectName === projectFilter;
    return matchesSearch && matchesStatus && matchesDeveloper && matchesProject;
  });

  const handleAction = (leadId: string, action: string) => {
    setShowActionMenu(null);
    
    switch (action) {
      case 'view':
        navigate(`/admin/leads/${leadId}`);
        break;
      case 'reassign':
        navigate(`/admin/leads/${leadId}?action=reassign`);
        break;
      case 'update_status':
        navigate(`/admin/leads/${leadId}?action=status`);
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
              <p className="text-sm text-neutral-500 font-montserrat">Lead Oversight</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search leads by name, email, or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>Status: {status}</option>
              ))}
            </select>

            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              {agentOptions.map(agent => (
                <option key={agent} value={agent}>Agent: {agent}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={developerFilter}
              onChange={(e) => setDeveloperFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              {developerOptions.map(developer => (
                <option key={developer} value={developer}>Developer: {developer}</option>
              ))}
            </select>

            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              {projectOptions.map(project => (
                <option key={project} value={project}>Project: {project}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lead Stats */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-neutral-800 font-montserrat">{mockLeads.length}</div>
            <div className="text-xs text-neutral-500 font-montserrat">Total</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600 font-montserrat">
              {mockLeads.filter(l => l.status === 'Hot').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Hot</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600 font-montserrat">
              {mockLeads.filter(l => l.status === 'Warm').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Warm</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600 font-montserrat">
              {mockLeads.filter(l => l.status === 'Cold').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Cold</div>
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
                  <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1">
                    {lead.buyerName}
                  </h3>
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
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowActionMenu(showActionMenu === lead.id ? null : lead.id)}
                      className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />
                    </button>
                    
                    {showActionMenu === lead.id && (
                      <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-10 min-w-[160px]">
                        <button 
                          onClick={() => handleAction(lead.id, 'view')}
                          className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 font-montserrat"
                        >
                          <Eye className="w-4 h-4 mr-3" strokeWidth={1.5} />
                          View Details
                        </button>
                        <button 
                          onClick={() => handleAction(lead.id, 'reassign')}
                          className="w-full flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 font-montserrat"
                        >
                          <RefreshCw className="w-4 h-4 mr-3" strokeWidth={1.5} />
                          Reassign Lead
                        </button>
                        <button 
                          onClick={() => handleAction(lead.id, 'update_status')}
                          className="w-full flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 font-montserrat"
                        >
                          <Edit className="w-4 h-4 mr-3" strokeWidth={1.5} />
                          Update Status
                        </button>
                      </div>
                    )}
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
                  <span className="text-neutral-500 font-montserrat">Requirements:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{lead.requirements}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Last Contact:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{lead.lastInteraction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No leads found</h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </RoleBasedLayout>
  );
};

export default AdminLeads;