import React, { useState } from 'react';

import { X, User, Home, Heart, ShieldCheck, MapPin, Plus, Pill, Clock, Trash2 } from 'lucide-react';
import { CareType, Client } from '../types';

interface VisitScheduleItem {
  label: string;
  time: string;
  duration: number;
  active: boolean;
}

interface MedicationIntake {
  name: string;
  dosage: string;
  frequency: string;
  times: string; // Comma separated for input, e.g. "08:00, 18:00"
  instructions: string;
}

interface AddClientModalProps {
  onClose: () => void;
  onAdd: (clientData: any) => void;
  initialData?: Client | null;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    careType: initialData?.careType || CareType.RESIDENTIAL,
    roomNumber: initialData?.roomNumber || '',
    address: initialData?.address || '',
    postcode: initialData?.postcode || '',
    careLevel: initialData?.careLevel || 'Medium',
  });

  const [scheduleItems, setScheduleItems] = useState<VisitScheduleItem[]>([
    { label: 'Morning Call', time: '08:00', duration: 45, active: false },
    { label: 'Lunch Call', time: '12:30', duration: 30, active: false },
    { label: 'Teatime Call', time: '16:30', duration: 30, active: false },
    { label: 'Bed Call', time: '20:00', duration: 45, active: false },
  ]);

  const [medications, setMedications] = useState<MedicationIntake[]>(
    initialData?.medications?.map(m => ({
      name: m.name,
      dosage: m.dosage,
      frequency: m.frequency,
      times: m.times.join(', '),
      instructions: m.instructions || ''
    })) || []
  );
  const [newMed, setNewMed] = useState<MedicationIntake>({
    name: '',
    dosage: '',
    frequency: 'Daily',
    times: '08:00',
    instructions: ''
  });

  const handleAddMed = () => {
    if (newMed.name && newMed.dosage) {
      setMedications([...medications, newMed]);
      setNewMed({
        name: '',
        dosage: '',
        frequency: 'Daily',
        times: '08:00',
        instructions: ''
      });
    }
  };

  const removeMed = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      visitSchedule: scheduleItems.filter(item => item.active),
      medications: medications.map((m, i) => ({
        id: initialData?.medications?.[i]?.id || `m-${Date.now()}-${i}`,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        times: m.times.split(',').map(t => t.trim()),
        instructions: m.instructions,
        stockLevel: initialData?.medications?.[i]?.stockLevel || 30 // Preserve or default
      }))
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] transform animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <h3 className="text-lg font-bold text-slate-800">{initialData ? 'Edit Client Profile' : 'New Client Intake'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, careType: CareType.RESIDENTIAL })}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.careType === CareType.RESIDENTIAL ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              Residential
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, careType: CareType.DOMICILIARY })}
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
              onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
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
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
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
                  onChange={e => setFormData({ ...formData, postcode: e.target.value })}
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
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${formData.careLevel === level
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 p-1 rounded mr-2">
                ⚡️
              </span>
              Auto-Schedule (Premium)
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Daily Visit Pattern</p>
              <div className="space-y-2">
                {scheduleItems.map((item, idx) => (
                  <div key={idx} className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${item.active ? 'bg-white border-indigo-200 shadow-sm' : 'bg-slate-50/50 border-slate-200 opacity-60'}`}>
                    <div className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 shrink-0"
                        checked={item.active}
                        onChange={(e) => {
                          const newItems = [...scheduleItems];
                          newItems[idx].active = e.target.checked;
                          setScheduleItems(newItems);
                        }}
                      />
                      <input
                        type="text"
                        value={item.label}
                        disabled={!item.active}
                        className="ml-3 text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 p-0 w-full disabled:text-slate-500"
                        onChange={(e) => {
                          const newItems = [...scheduleItems];
                          newItems[idx].label = e.target.value;
                          setScheduleItems(newItems);
                        }}
                      />
                    </div>
                    {item.active && (
                      <input
                        type="time"
                        value={item.time}
                        onChange={(e) => {
                          const newItems = [...scheduleItems];
                          newItems[idx].time = e.target.value;
                          setScheduleItems(newItems);
                        }}
                        className="text-xs font-mono text-slate-600 bg-slate-100 border-none rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 w-24"
                      />
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setScheduleItems([...scheduleItems, { label: 'Extra Visit', time: '14:00', duration: 30, active: true }])}
                  className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-xs font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center space-x-2"
                >
                  <Plus size={14} />
                  <span>Add Visiting Time</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
              <span className="bg-emerald-100 text-emerald-600 p-1 rounded mr-2">
                <Pill size={14} />
              </span>
              Medication Plan
            </h4>

            {/* Added Medications List */}
            {medications.length > 0 && (
              <div className="space-y-2 mb-4">
                {medications.map((med, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-sm">{med.name}</span>
                        <span className="px-1.5 py-0.5 bg-white text-emerald-600 text-[10px] uppercase font-bold rounded border border-emerald-100">{med.dosage}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        <span className="font-medium">{med.frequency}</span> • {med.times}
                      </p>
                      {med.instructions && <p className="text-[10px] text-slate-400 italic mt-0.5">"{med.instructions}"</p>}
                    </div>
                    <button type="button" onClick={() => removeMed(idx)} className="text-slate-400 hover:text-rose-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Med Form*/}
            <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Medication Name"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newMed.name}
                  onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 500mg)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newMed.dosage}
                  onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newMed.frequency}
                  onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}
                >
                  <option>Daily</option>
                  <option>Twice Daily</option>
                  <option>Three Times Daily</option>
                  <option>Four Times Daily</option>
                  <option>Weekly</option>
                  <option>PRN (As Needed)</option>
                </select>
                <input
                  type="text"
                  placeholder="Times (e.g. 08:00, 20:00)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newMed.times}
                  onChange={e => setNewMed({ ...newMed, times: e.target.value })}
                />
              </div>
              <input
                type="text"
                placeholder="Instructions (e.g. Take with food)"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={newMed.instructions}
                onChange={e => setNewMed({ ...newMed, instructions: e.target.value })}
              />
              <button
                type="button"
                onClick={handleAddMed}
                disabled={!newMed.name || !newMed.dosage}
                className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <Plus size={14} /> <span>Add Medication</span>
              </button>
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
              <span>{initialData ? 'Save Changes' : 'Register Client'}</span>
            </button>
          </div>
        </form>
      </div >
    </div >
  );
};

export default AddClientModal;
