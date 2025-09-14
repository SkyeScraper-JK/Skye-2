import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Phone, Mail, MessageCircle, Eye } from 'lucide-react';
import { mockLeads } from '../data/mockData';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const LeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filters = ['All', 'Hot', 'Warm', 'Cold'];

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
    const matchesFilter = activeFilter === 'All' || lead.status === activeFilter;
    const matchesSearch = lead.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.developerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            
            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                PROPERTY AGENT
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">My Leads</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search leads by name, project, or developer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium font-montserrat transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
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
                <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getStatusColor(lead.status)}`}>
                  {lead.status}
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
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <span className="text-xs text-neutral-500 font-montserrat">
                  Last contact: {lead.lastInteraction}
                </span>
                <div className="flex space-x-2">
                  <button className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors">
                    <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat text-sm hover:bg-primary-700 transition-colors">
                    View Details
                  </button>
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

export default LeadsPage;