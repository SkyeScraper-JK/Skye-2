import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          
          <h1 className="text-lg font-bold text-neutral-800 font-montserrat">{title}</h1>
          
          <div className="w-10"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="w-10 h-10 text-primary-600" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-bold text-neutral-800 font-montserrat mb-4">
            Coming Soon
          </h2>
          
          <p className="text-neutral-500 font-montserrat mb-8 leading-relaxed">
            {description}
          </p>
          
          <button 
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PlaceholderPage;