
import React, { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, UserPlus, Info, X, Clock, User, ShieldCheck, AlertCircle, CalendarDays, Heart, MapPin, Building2 } from 'lucide-react';
import { Shift, Staff, ShiftType, Client, CareType } from '../types';

interface RotaGridProps {
  shifts: Shift[];
  staff: Staff[];
  clients: Client[];
  isAdmin: boolean;
  onAssignShift: (shiftId: string, staffId: string) => void;
  onOpenAddShift: () => void;
}

const RotaGrid: React.FC<RotaGridProps> = ({ shifts, staff, clients, isAdmin, onAssignShift, onOpenAddShift }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const shiftSlots = Object.values(ShiftType);

  const getShiftsForDayAndSlot = (day: Date, slot: ShiftType) => {
    return shifts.filter(s => s.date === format(day, 'yyyy-MM-dd') && s.type === slot);
  };

  const selectedShift = shifts.find(s => s.id === selectedShiftId);
  const selectedStaff = selectedShift ? staff.find(s => s.id === selectedShift.staffId) : null;
  const selectedClient = selectedShift ? clients.find(c => c.id === selectedShift.clientId) : null;

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'Green': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Amber': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Red': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-slate-800">Weekly Care Schedule</h2>
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-1 hover:bg-white rounded shadow-sm transition-all"><ChevronLeft size={20} /></button>
            <span className="px-3 font-medium text-sm">{format(startDate, 'MMM d')} - {format(addDays(startDate, 6), 'MMM d, yyyy')}</span>
            <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-1 hover:bg-white rounded shadow-sm transition-all"><ChevronRight size={20} /></button>
          </div>
        </div>
        {isAdmin && (
          <button 
            onClick={onOpenAddShift}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            <span>New Visit</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-r bg-slate-50 w-48 text-left text-xs font-semibold text-slate-500 uppercase">Timing Category</th>
              {weekDays.map((day, idx) => (
                <th key={idx} className="p-4 border-b bg-slate-50 min-w-[220px] text-center">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{format(day, 'EEE')}</p>
                  <p className="text-lg font-bold text-slate-800">{format(day, 'd')}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shiftSlots.map((slot, sIdx) => (
              <tr key={sIdx}>
                <td className="p-4 border-b border-r bg-slate-50 font-medium text-sm text-slate-600">
                  {slot.split(' (')[0]}
                  <p className="text-[10px] text-slate-400 font-normal uppercase tracking-wider">{slot.match(/\(([^)]+)\)/)?.[1]}</p>
                </td>
                {weekDays.map((day, dIdx) => {
                  const dayShifts = getShiftsForDayAndSlot(day, slot);
                  
                  return (
                    <td key={dIdx} className="p-2 border-b group relative align-top min-h-[140px]">
                      <div className="space-y-3">
                        {dayShifts.map(shift => {
                          const assignedStaff = staff.find(s => s.id === shift.staffId);
                          const client = clients.find(c => c.id === shift.clientId);
                          
                          return (
                            <div key={shift.id} className={`p-3 rounded-xl border transition-all ${
                              shift.status === 'Confirmed' 
                                ? 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md' 
                                : 'bg-orange-50 border-orange-200 border-dashed shadow-sm'
                            }`}>
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-1.5 overflow-hidden">
                                  <div className={`p-1 rounded-md ${client?.careType === CareType.RESIDENTIAL ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                                    {client?.careType === CareType.RESIDENTIAL ? <Building2 size={10} /> : <MapPin size={10} />}
                                  </div>
                                  <p className="text-sm font-bold text-slate-800 leading-tight truncate">{client?.name || 'Unknown'}</p>
                                </div>
                                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full shrink-0">
                                  {shift.duration}m
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3 font-semibold">
                                <div className="flex items-center space-x-1">
                                  <Clock size={10} />
                                  <span>{shift.startTime}</span>
                                </div>
                                <span className="text-slate-400 truncate max-w-[80px]">
                                  {client?.careType === CareType.RESIDENTIAL ? `Rm ${client.roomNumber}` : client?.address?.split(',')[0]}
                                </span>
                              </div>

                              {assignedStaff ? (
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                                  <div className="flex items-center space-x-1.5 overflow-hidden">
                                    <img 
                                      src={`https://picsum.photos/seed/${assignedStaff.id}/32`} 
                                      className="w-5 h-5 rounded-full" 
                                      alt={assignedStaff.name} 
                                    />
                                    <p className="text-[10px] font-bold text-slate-600 truncate">{assignedStaff.name.split(' ')[0]}</p>
                                  </div>
                                  <button 
                                    onClick={() => setSelectedShiftId(shift.id)}
                                    className="p-1 hover:bg-slate-50 rounded-full text-slate-300 hover:text-indigo-600 transition-colors"
                                  >
                                    <Info size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                                  <p className="text-[9px] font-black text-orange-600 tracking-tighter uppercase">Needs Staff</p>
                                  {isAdmin && (
                                    <button 
                                      onClick={() => onAssignShift(shift.id, '3')}
                                      className="p-1 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-600 hover:text-white transition-all shadow-sm shadow-orange-200"
                                    >
                                      <UserPlus size={12} />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {isAdmin && dayShifts.length === 0 && (
                          <button 
                            onClick={onOpenAddShift}
                            className="w-full py-6 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-50/80 border border-slate-200 border-dashed rounded-xl transition-all hover:bg-indigo-50 hover:border-indigo-300"
                          >
                            <Plus size={20} className="text-slate-400 mb-1" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Add Visit</span>
                          </button>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visit Info Modal */}
      {selectedShift && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">Visit Detail View</h3>
              <button 
                onClick={() => setSelectedShiftId(null)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={`https://picsum.photos/seed/${selectedClient.id}/128`} 
                  alt={selectedClient.name} 
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-50 shadow-md"
                />
                <div>
                  <h4 className="text-xl font-black text-slate-900 leading-tight">{selectedClient.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border ${selectedClient.careType === CareType.RESIDENTIAL ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                      {selectedClient.careType}
                    </div>
                    <p className="text-slate-500 font-bold text-xs">
                      {selectedClient.careType === CareType.RESIDENTIAL ? `Room ${selectedClient.roomNumber}` : selectedClient.postcode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                {selectedClient.careType === CareType.DOMICILIARY && (
                  <div className="flex items-start space-x-3 pb-3 border-b border-slate-200/50">
                    <MapPin size={16} className="text-slate-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Address</p>
                      <p className="text-sm font-bold text-slate-700">{selectedClient.address}, {selectedClient.postcode}</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-slate-400 mb-1">
                      <CalendarDays size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Scheduled Date</span>
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{format(new Date(selectedShift.date), 'EEE, do MMM')}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-slate-400 mb-1">
                      <Clock size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Timing & Duration</span>
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{selectedShift.startTime} ({selectedShift.duration}m)</p>
                  </div>
                </div>
              </div>

              {selectedStaff ? (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Staff Assigned</span>
                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <img src={`https://picsum.photos/seed/${selectedStaff.id}/40`} className="w-10 h-10 rounded-full border-2 border-indigo-50 shadow-sm" alt={selectedStaff.name} />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{selectedStaff.name}</p>
                        <p className="text-xs text-indigo-600 font-bold">{selectedStaff.role}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter ${getComplianceColor(selectedStaff.complianceStatus)}`}>
                      {selectedStaff.complianceStatus}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-orange-50 border-2 border-orange-200 border-dashed rounded-2xl flex items-center justify-center text-orange-600 space-x-3">
                  <AlertCircle size={20} />
                  <span className="font-black text-xs uppercase tracking-widest">Attention: No Staff Assigned</span>
                </div>
              )}

              <div className="pt-4 flex space-x-3">
                <button 
                  onClick={() => setSelectedShiftId(null)}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-sm"
                >
                  Close
                </button>
                {isAdmin && (
                  <button className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all text-sm">
                    Update Visit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RotaGrid;
