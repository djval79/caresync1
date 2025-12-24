
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, ShieldCheck, Heart, Timer, Repeat, CalendarRange, PenTool, Pill, AlertTriangle } from 'lucide-react';
import { ShiftType, Staff, Client, Shift, Medication } from '../types';
import { addDays, isWeekend, parseISO, format, isBefore, isEqual } from 'date-fns';

interface AddShiftModalProps {
  staff: Staff[];
  clients: Client[];
  onClose: () => void;
  onAdd: (shiftData: any) => void; // This acts as onSave/onUpdate
  editShift?: Shift | null;
}

const AddShiftModal: React.FC<AddShiftModalProps> = ({ staff, clients, onClose, onAdd, editShift }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: ShiftType.MORNING,
    startTime: '08:00',
    duration: 60,
    staffId: '',
    clientId: clients[0]?.id || '',
  });

  useEffect(() => {
    if (editShift) {
      setFormData({
        date: editShift.date,
        type: editShift.type,
        startTime: editShift.startTime,
        duration: editShift.duration,
        staffId: editShift.staffId || '',
        clientId: editShift.clientId || '',
      });
    }
  }, [editShift]);

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'DAILY' | 'WEEKLY' | 'WEEKDAY'>('DAILY');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!!editShift) {
      // If editing, just pass back the updated form data with the existing ID implicitly via parent handling
      onAdd({ ...formData, id: editShift.id });
      return;
    }

    if (isRecurring && endDate) {
      const shifts = [];
      let currentDate = parseISO(formData.date);
      const end = parseISO(endDate);

      // Safety break to prevent infinite loops or massive allocations
      let safetyCounter = 0;
      const MAX_SHIFTS = 365; // Cap at 1 year of daily shifts for safety

      while ((isBefore(currentDate, end) || isEqual(currentDate, end)) && safetyCounter < MAX_SHIFTS) {
        let shouldAdd = false;

        if (recurrenceType === 'DAILY') {
          shouldAdd = true;
        } else if (recurrenceType === 'WEEKDAY') {
          shouldAdd = !isWeekend(currentDate);
        } else if (recurrenceType === 'WEEKLY') {
          // logic handled by incrementing 7 days, so always add if loop hit this date
          shouldAdd = true;
        }

        if (shouldAdd) {
          shifts.push({
            ...formData,
            date: format(currentDate, 'yyyy-MM-dd'),
          });
        }

        // Increment logic
        if (recurrenceType === 'WEEKLY') {
          currentDate = addDays(currentDate, 7);
        } else {
          currentDate = addDays(currentDate, 1);
        }

        // If we are skipping weekends in valid check but incrementing daily, we just loop.
        // Safety counter increments every loop iteration? No, every added shift? 
        // Better to increment every loop to avoid infinite while.
        safetyCounter++;
      }

      onAdd(shifts);
    } else {
      onAdd(formData);
    }
  };

  const handleSetDuration = (months: number) => {
    const start = parseISO(formData.date);
    const end = addDays(start, months * 30); // Approx
    setEndDate(format(end, 'yyyy-MM-dd'));
  };

  // Helper to find due meds
  const getDueMeds = () => {
    const client = clients.find(c => c.id === formData.clientId);
    if (!client || !client.medications) return [];

    const startMinutes = parseInt(formData.startTime.split(':')[0]) * 60 + parseInt(formData.startTime.split(':')[1]);
    const endMinutes = startMinutes + formData.duration;

    return client.medications.filter(med => {
      return med.times.some(t => {
        const medMinutes = parseInt(t.split(':')[0]) * 60 + parseInt(t.split(':')[1]);
        // detailed check: med time falls within visit window
        return medMinutes >= startMinutes && medMinutes < endMinutes;
      });
    });
  };

  const dueMeds = getDueMeds();
  const selectedClient = clients.find(c => c.id === formData.clientId);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            {editShift ? <PenTool size={18} className="mr-2 text-indigo-600" /> : null}
            {editShift ? 'Edit Care Visit' : 'Schedule New Care Visit'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <Heart size={14} className="mr-2 text-rose-500" /> Client / Resident
                </label>
                <select
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.clientId}
                  onChange={e => setFormData({ ...formData, clientId: e.target.value })}
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
                  <Calendar size={14} className="mr-2" /> Start Date
                </label>
                <input
                  required
                  type="date"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <Clock size={14} className="mr-2" /> Shift Block
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as ShiftType })}
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
                  onChange={e => setFormData({ ...formData, startTime: e.target.value })}
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
                  onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <Users size={14} className="mr-2" /> Assign Staff (Optional)
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.staffId}
                  onChange={e => setFormData({ ...formData, staffId: e.target.value })}
                >
                  <option value="">-- Leave Unassigned / For Bidding --</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>

              {/* Care Plan / Medical Context - Displayed for visibility */}
              {selectedClient && (
                <div className="col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="flex items-center text-sm font-bold text-slate-800">
                    <Pill size={16} className="text-indigo-600 mr-2" />
                    Medical Requirements
                  </h4>

                  {/* Due Meds Highlight */}
                  {dueMeds.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-amber-600 flex items-center">
                        <AlertTriangle size={12} className="mr-1" />
                        To Administer This Visit
                      </p>
                      {dueMeds.map(med => (
                        <div key={med.id} className="flex items-center justify-between bg-white p-2 rounded border border-amber-200 shadow-sm">
                          <div>
                            <p className="text-sm font-bold text-slate-800">{med.name} <span className="text-slate-500 font-medium text-xs">({med.dosage})</span></p>
                            <p className="text-xs text-slate-500">{med.instructions || 'Standard Protocol'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-700">{med.times.join(', ')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No specific medications scheduled for this time block.</p>
                  )}

                  {/* Full Med List Toggle could go here, but for now just show Due */}
                </div>
              )}

              {/* Bulk Allocation Section */}
              <div className="col-span-2 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${isRecurring ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Repeat size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 text-sm">Bulk Allocation</h4>
                      <p className="text-[10px] text-slate-500">Repeat this visit schedule</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isRecurring}
                      disabled={!!editShift}
                      onChange={e => setIsRecurring(e.target.checked)}
                    />
                    <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isRecurring ? 'peer-checked:bg-indigo-600' : ''} ${!!editShift ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                  </label>
                </div>

                {isRecurring && !editShift && (
                  <div className="bg-slate-50 p-4 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Frequency</label>
                        <select
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={recurrenceType}
                          onChange={e => setRecurrenceType(e.target.value as any)}
                        >
                          <option value="DAILY">Every Day</option>
                          <option value="WEEKDAY">Mon - Fri Only</option>
                          <option value="WEEKLY">Weekly</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                          <CalendarRange size={12} className="mr-1" /> End Date
                        </label>
                        <input
                          required={isRecurring}
                          type="date"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={endDate}
                          onChange={e => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {[1, 3, 6].map(months => (
                        <button
                          key={months}
                          type="button"
                          onClick={() => handleSetDuration(months)}
                          className="flex-1 py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                          {months} Months
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex space-x-3">
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
                <span>{editShift ? 'Update Visit' : (isRecurring ? 'Confirm Allocation' : 'Confirm Visit')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddShiftModal;
