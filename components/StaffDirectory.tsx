
import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, ShieldCheck, AlertCircle, Clock, UserPlus } from 'lucide-react';
import { Staff, StaffRole } from '../types';

interface StaffDirectoryProps {
  staff: Staff[];
  onAddStaffClick: () => void;
}

const StaffDirectory: React.FC<StaffDirectoryProps> = ({ staff, onAddStaffClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getComplianceBadge = (status: string) => {
    switch (status) {
      case 'Green': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Amber': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Red': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
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
              placeholder="Search staff members..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              className="pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              {Object.values(StaffRole).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={onAddStaffClick}
          className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
        >
          <UserPlus size={18} />
          <span className="font-semibold text-sm">Add New Staff</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Member</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Hours</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStaff.map((person) => (
              <tr key={person.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://picsum.photos/seed/${person.id}/64`}
                      alt={person.name}
                      className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-800">{person.name}</p>
                      <p className="text-xs text-slate-500">ID: CARE-{person.id.padStart(4, '0')}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-600">{person.role}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1.5 w-32">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>{person.currentHours}h worked</span>
                      <span>{person.contractedHours}h max</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${person.currentHours > person.contractedHours ? 'bg-red-500' : 'bg-indigo-500'}`}
                        style={{ width: `${Math.min(100, (person.currentHours / person.contractedHours) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-tight ${getComplianceBadge(person.complianceStatus)}`}>
                    {person.complianceStatus === 'Green' ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
                    <span>{person.complianceStatus}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStaff.length === 0 && (
          <div className="p-12 text-center">
            <Search className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No staff members found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDirectory;
