import React, { useState } from 'react';
import { Pill, Check, X, AlertTriangle, Clock, ChevronDown, ChevronUp, History } from 'lucide-react';
import { Client, Medication, MedicationLog, MedicationStatus } from '../types';

interface eMARProps {
    clients: Client[];
    medicationLogs: MedicationLog[];
    onAdminister: (clientId: string, medId: string, status: MedicationStatus, notes?: string) => void;
}

const EMARDashboard: React.FC<eMARProps> = ({ clients, medicationLogs, onAdminister }) => {
    const [selectedTime, setSelectedTime] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedClientId, setExpandedClientId] = useState<string | null>(null);

    // Helper to filter meds by time of day
    const getMedsForTime = (meds: Medication[], timeOfDay: string) => {
        return meds.filter(m => {
            if (timeOfDay === 'Morning') return m.times.some(t => parseInt(t.split(':')[0]) < 12);
            if (timeOfDay === 'Afternoon') return m.times.some(t => { const h = parseInt(t.split(':')[0]); return h >= 12 && h < 17; });
            if (timeOfDay === 'Evening') return m.times.some(t => parseInt(t.split(':')[0]) >= 17);
            return false;
        });
    };

    const filteredClients = clients.filter(c => {
        const nameMatch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const hasMeds = c.medications && c.medications.length > 0;
        return nameMatch && hasMeds;
    });

    const handleAdministerClick = (client: Client, med: Medication) => {
        if (med.stockLevel <= 0) {
            alert('Cannot administer: Out of stock!');
            return;
        }
        onAdminister(client.id, med.id, MedicationStatus.TAKEN);
    };

    const handleRefuseClick = (client: Client, med: Medication) => {
        const reason = window.prompt("Reason for refusal/skipping:", "Patient refused");
        if (reason !== null) {
            onAdminister(client.id, med.id, MedicationStatus.REFUSED, reason);
        }
    };

    const getLogForSession = (medId: string) => {
        // Find a log for today and current session time range
        // For simplicity: just match by day. In real app, match window
        const today = new Date().toISOString().split('T')[0];

        return medicationLogs.find(log => {
            const logDate = log.timestamp.split('T')[0];
            // check if log happened "today"
            if (logDate !== today || log.medicationId !== medId) return false;

            // Check time range
            const hour = new Date(log.timestamp).getHours();
            if (selectedTime === 'Morning' && hour < 12) return true;
            if (selectedTime === 'Afternoon' && hour >= 12 && hour < 17) return true;
            if (selectedTime === 'Evening' && hour >= 17) return true;

            return false;
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                        <Pill className="mr-3 text-indigo-600" />
                        eMAR Dashboard
                    </h1>
                    <p className="text-slate-500">Electronic Medication Administration Record</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['Morning', 'Afternoon', 'Evening'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setSelectedTime(t as any)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedTime === t
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredClients.map(client => {
                    const dueMeds = getMedsForTime(client.medications || [], selectedTime);
                    if (dueMeds.length === 0) return null; // Only show clients with meds due this round

                    const isExpanded = expandedClientId === client.id;

                    return (
                        <div key={client.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
                                onClick={() => setExpandedClientId(isExpanded ? null : client.id)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{client.name}</h3>
                                        <p className="text-xs text-slate-500">{client.roomNumber ? `Rm ${client.roomNumber}` : client.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {/* Summary Pills */}
                                    <div className="flex space-x-2">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 flex items-center">
                                            <Clock size={12} className="mr-1" />
                                            {dueMeds.length} Due
                                        </span>
                                    </div>
                                    {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                </div>
                            </div>

                            {/* Meds List */}
                            {isExpanded && (
                                <div className="p-4 border-t border-slate-100 space-y-3">
                                    {dueMeds.map(med => (
                                        <div key={med.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-indigo-100 transition-colors">
                                            <div className="mb-4 md:mb-0">
                                                <div className="flex items-center mb-1">
                                                    <h4 className="font-bold text-slate-900 text-lg mr-2">{med.name}</h4>
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">{med.dosage}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-2">{med.instructions || 'Follow standard protocol'}</p>
                                                <div className="flex items-center space-x-4 text-xs font-medium text-slate-400">
                                                    <span className="flex items-center"><Clock size={12} className="mr-1" /> Scheduled: {med.times.filter(t =>
                                                        (selectedTime === 'Morning' && parseInt(t) < 12) ||
                                                        (selectedTime === 'Afternoon' && parseInt(t) >= 12 && parseInt(t) < 17) ||
                                                        (selectedTime === 'Evening' && parseInt(t) >= 17)
                                                    ).join(', ')}</span>
                                                    <span className={`flex items-center ${med.stockLevel < 7 ? 'text-rose-500 font-bold' : 'text-emerald-600'}`}>
                                                        {med.stockLevel < 7 && <AlertTriangle size={12} className="mr-1" />}
                                                        Stock: {med.stockLevel}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                {(() => {
                                                    const log = getLogForSession(med.id);
                                                    if (log) {
                                                        return (
                                                            <span className={`px-4 py-2 font-bold rounded-lg flex items-center border ${log.status === MedicationStatus.TAKEN
                                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                : 'bg-rose-100 text-rose-700 border-rose-200'
                                                                }`}>
                                                                {log.status === MedicationStatus.TAKEN ? <Check size={16} className="mr-2" /> : <History size={16} className="mr-2" />}
                                                                {log.status} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        );
                                                    }
                                                    return (
                                                        <>
                                                            <button
                                                                onClick={() => handleAdministerClick(client, med)}
                                                                className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100 transition-colors flex items-center border border-emerald-200"
                                                            >
                                                                <Check size={16} className="mr-2" />
                                                                Administer
                                                            </button>
                                                            <button
                                                                onClick={() => handleRefuseClick(client, med)}
                                                                className="px-4 py-2 bg-rose-50 text-rose-700 font-bold rounded-lg hover:bg-rose-100 transition-colors flex items-center border border-rose-200"
                                                            >
                                                                <X size={16} className="mr-2" />
                                                                Refuse/Skip
                                                            </button>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredClients.length === 0 && (
                    <div className="text-center p-12 text-slate-400">
                        <Pill size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No medications due found for this period.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EMARDashboard;
