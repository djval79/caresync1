
import React, { useState } from 'react';
import { X, User, Home, Heart, ShieldCheck, MapPin } from 'lucide-react';
import { CareType } from '../types';

interface AddClientModalProps {
  onClose: () => void;
  onAdd: (clientData: any) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    careType: CareType.RESIDENTIAL,
    roomNumber: '',
    address: '',
    postcode: '',
    careLevel: 'Medium' as 'Low' | 'Medium' | 'High',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">New Client Intake</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, careType: CareType.RESIDENTIAL})}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.careType === CareType.RESIDENTIAL ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              Residential
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, careType: CareType.DOMICILIARY})}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.careType === CareType.DOMICILIARY ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              Domiciliary (Home)
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <User size={14} className="mr-2" /> Full Name
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. Martha Stewart"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {formData.careType === CareType.RESIDENTIAL ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Home size={14} className="mr-2" /> Room Number
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="e.g. 102-B"
                value={formData.roomNumber}
                onChange={e => setFormData({...formData, roomNumber: e.target.value})}
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <MapPin size={14} className="mr-2" /> Home Address
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. 12 High Street"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  Postcode
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. SW1A 1AA"
                  value={formData.postcode}
                  onChange={e => setFormData({...formData, postcode: e.target.value})}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <Heart size={14} className="mr-2" /> Required Care Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, careLevel: level })}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    formData.careLevel === level
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex space-x-3">
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
              <span>Register Client</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
