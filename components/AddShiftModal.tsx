
import React, { useState } from 'react';
import { X, Calendar, Clock, Users, ShieldCheck, Heart, Timer } from 'lucide-react';
import { ShiftType, Staff, Client } from '../types';

interface AddShiftModalProps {
  staff: Staff[];
  clients: Client[];
  onClose: () => void;
  onAdd: (shiftData: any) => void;
}

const AddShiftModal: React.FC<AddShiftModalProps> = ({ staff, clients, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: ShiftType.MORNING,
    startTime: '08:00',
    duration: 60,
    staffId: '',
    clientId: clients[0]?.id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">Schedule New Care Visit</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Heart size={14} className="mr-2 text-rose-500" /> Client / Resident
              </label>
              <select
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.clientId}
                onChange={e => setFormData({...formData, clientId: e.target.value})}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.roomNumber ? `(Room ${c.roomNumber})` : `(${c.postcode})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Calendar size={14} className="mr-2" /> Visit Date
              </label>
              <input
                required
                type="date"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Clock size={14} className="mr-2" /> Shift Block
              </label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as ShiftType})}
              >
                {Object.values(ShiftType).map(type => (
                  <option key={type} value={type}>{type.split(' (')[0]}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Timer size={14} className="mr-2" /> Start Time
              </label>
              <input
                required
                type="time"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.startTime}
                onChange={e => setFormData({...formData, startTime: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Clock size={14} className="mr-2" /> Duration (mins)
              </label>
              <input
                required
                type="number"
                min="15"
                step="15"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Users size={14} className="mr-2" /> Assign Staff (Optional)
              </label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.staffId}
                onChange={e => setFormData({...formData, staffId: e.target.value})}
              >
                <option value="">-- Leave Unassigned / For Bidding --</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <ShieldCheck size={18} />
              <span>Confirm Visit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShiftModal;
