import React, { useState } from 'react';
import { Search, MapPin, Building, DollarSign, Bed, Clock } from 'lucide-react';

const SearchFilters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    priceRange: '',
    bedrooms: '',
    status: ''
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 mx-4 -mt-8 relative z-10">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by Project, Developer, or Property ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <select
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="w-full pl-10 pr-8 py-3 bg-neutral-50 border-0 rounded-lg text-neutral-700 font-montserrat text-sm focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
          >
            <option value="">Location</option>
            <option value="gurgaon">Gurgaon</option>
            <option value="bangalore">Bangalore</option>
            <option value="mumbai">Mumbai</option>
            <option value="pune">Pune</option>
          </select>
        </div>

        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="w-full pl-10 pr-8 py-3 bg-neutral-50 border-0 rounded-lg text-neutral-700 font-montserrat text-sm focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
          >
            <option value="">Type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="flat">Flat</option>
            <option value="plot">Plot</option>
            <option value="office">Office</option>
          </select>
        </div>

        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            className="w-full pl-10 pr-8 py-3 bg-neutral-50 border-0 rounded-lg text-neutral-700 font-montserrat text-sm focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
          >
            <option value="">Price Range</option>
            <option value="50-100">₹50L - ₹1Cr</option>
            <option value="100-200">₹1Cr - ₹2Cr</option>
            <option value="200-500">₹2Cr - ₹5Cr</option>
            <option value="500+">₹5Cr+</option>
          </select>
        </div>

        <div className="relative">
          <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <select
            value={filters.bedrooms}
            onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
            className="w-full pl-10 pr-8 py-3 bg-neutral-50 border-0 rounded-lg text-neutral-700 font-montserrat text-sm focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
          >
            <option value="">Bedrooms</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4+">4+ BHK</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="w-full pl-10 pr-8 py-3 bg-neutral-50 border-0 rounded-lg text-neutral-700 font-montserrat text-sm focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
          >
            <option value="">Status</option>
            <option value="ready">Ready</option>
            <option value="under-construction">Under Construction</option>
            <option value="off-plan">Off-plan</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;