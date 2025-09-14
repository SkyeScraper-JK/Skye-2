import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, TrendingUp, Building, Users, DollarSign, Activity, Eye } from 'lucide-react';
import { mockDeveloperProfile, mockProjects, mockActivities } from '../data/mockData';
import ProjectCard from '../components/ProjectCard';
import DeveloperBottomNavigation from '../components/DeveloperBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const DeveloperDashboard: React.FC = () => {
  const navigate = useNavigate();
  const profile = mockDeveloperProfile;
  
  // Create a developer user for the layout
  const developerUser = {
    ...mockCurrentUser,
    role: 'developer' as const,
    profile: profile
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Users className="w-4 h-4 text-green-600" strokeWidth={1.5} />;
      case 'upload':
        return <Building className="w-4 h-4 text-blue-600" strokeWidth={1.5} />;
      case 'lead':
        return <TrendingUp className="w-4 h-4 text-purple-600" strokeWidth={1.5} />;
      case 'price_update':
        return <DollarSign className="w-4 h-4 text-yellow-600" strokeWidth={1.5} />;
      default:
        return <Activity className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />;
    }
  };

  return (
    <RoleBasedLayout user={developerUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                PROPERTY AGENT
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">Developer Dashboard</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                <Bell className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold font-montserrat text-sm">
                  {profile.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-bold text-neutral-800 font-montserrat">
              Welcome back, {profile.name}
            </h2>
            <p className="text-sm text-neutral-500 font-montserrat">
              {profile.companyName} • {profile.designation}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold text-blue-600 font-montserrat">
                {profile.stats.totalProjects}
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-700 font-montserrat">Total Projects</p>
            <p className="text-xs text-neutral-500 font-montserrat">{profile.stats.activeListings} active</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold text-green-600 font-montserrat">
                {profile.stats.unitsSold}
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-700 font-montserrat">Units Sold</p>
            <p className="text-xs text-neutral-500 font-montserrat">This quarter</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-accent-gold bg-opacity-20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-accent-gold" strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold text-accent-gold font-montserrat">
                {profile.stats.revenue}
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-700 font-montserrat">Total Revenue</p>
            <p className="text-xs text-neutral-500 font-montserrat">Year to date</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/developer/projects/new')}
              className="flex items-center justify-center p-4 bg-primary-600 text-white rounded-xl font-medium font-montserrat hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Add Project
            </button>
            <button 
              onClick={() => navigate('/developer/projects')}
              className="flex items-center justify-center p-4 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-medium font-montserrat hover:bg-neutral-50 transition-colors"
            >
              <Eye className="w-5 h-5 mr-2" strokeWidth={1.5} />
              View All
            </button>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Recent Projects</h3>
            <button 
              onClick={() => navigate('/developer/projects')}
              className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {mockProjects.slice(0, 2).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/developer/projects/${project.id}`)}
                showActions={true}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="pb-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Recent Activity</h3>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-neutral-100 last:border-b-0 last:pb-0">
                  <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-neutral-800 font-montserrat">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-neutral-600 font-montserrat">
                      {activity.description}
                    </p>
                    {activity.projectName && (
                      <p className="text-xs text-primary-600 font-montserrat mt-1">
                        {activity.projectName}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-neutral-500 font-montserrat whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </RoleBasedLayout>
  );
};

export default DeveloperDashboard;