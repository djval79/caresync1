
import React, { useState } from 'react';
import { Search, Filter, Plus, Home, Heart, MoreVertical, MapPin, Building2 } from 'lucide-react';
import { Client, CareType } from '../types';

interface ClientDirectoryProps {
  residents: Client[];
  onAddResidentClick: () => void;
  onViewResident: (client: Client) => void;
}

const ClientDirectory: React.FC<ClientDirectoryProps> = ({ residents, onAddResidentClick, onViewResident }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [careFilter, setCareFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filteredResidents = residents.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.address?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCare = careFilter === 'All' || r.careLevel === careFilter;
    const matchesType = typeFilter === 'All' || r.careType === typeFilter;
    return matchesSearch && matchesCare && matchesType;
  });

  const getCareLevelStyles = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-700 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Low': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search clients by name, address or room..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <select
              className="pl-4 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Care Types</option>
              <option value={CareType.RESIDENTIAL}>Residential</option>
              <option value={CareType.DOMICILIARY}>Domiciliary</option>
            </select>
            <select
              className="pl-4 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              value={careFilter}
              onChange={(e) => setCareFilter(e.target.value)}
            >
              <option value="All">All Care Levels</option>
              <option value="High">High Support</option>
              <option value="Medium">Medium Support</option>
              <option value="Low">Low Support</option>
            </select>
          </div>
        </div>
        <button
          onClick={onAddResidentClick}
          className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus size={18} />
          <span className="font-semibold text-sm">Add Client</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredResidents.map((resident) => (
          <div key={resident.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md hover:border-indigo-200 transition-all flex flex-col h-full">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <img
                  src={`https://picsum.photos/seed/${resident.id}/128`}
                  alt={resident.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-slate-50 shadow-sm"
                />
                <div className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${resident.careType === CareType.RESIDENTIAL ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                  {resident.careType}
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{resident.name}</h3>

              <div className="mt-3 flex items-start space-x-2 text-slate-500">
                {resident.careType === CareType.RESIDENTIAL ? (
                  <>
                    <Building2 size={14} className="shrink-0 mt-1" />
                    <span className="text-sm font-medium">Room {resident.roomNumber}</span>
                  </>
                ) : (
                  <>
                    <MapPin size={14} className="shrink-0 mt-1" />
                    <span className="text-sm font-medium leading-tight">{resident.address}<br /><span className="text-[10px] text-slate-400">{resident.postcode}</span></span>
                  </>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getCareLevelStyles(resident.careLevel)}`}>
                  {resident.careLevel} CARE
                </div>
                <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <Heart size={10} className="text-rose-500" />
                </div>
              </div>
            </div>
            <button
              onClick={() => onViewResident(resident)}
              className="w-full py-3 bg-slate-50 border-t border-slate-100 text-xs font-bold text-slate-600 uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      {
        filteredResidents.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-500 font-medium">No clients found matching your search criteria.</p>
          </div>
        )
      }
    </div >
  );
};

export default ClientDirectory;
