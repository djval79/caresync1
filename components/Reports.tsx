import React, { useState, useMemo } from 'react';
import { Calendar, Filter, Download, DollarSign, Clock, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Printer } from 'lucide-react';
import { Shift, Staff, Client } from '../types';
import { format, parseISO, isWithinInterval, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface ReportsProps {
    shifts: Shift[];
    staff: Staff[];
    clients: Client[];
}

const Reports: React.FC<ReportsProps> = ({ shifts, staff, clients }) => {
    const [dateRange, setDateRange] = useState({
        start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    });
    const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
    const [selectedClientId, setSelectedClientId] = useState<string>('all');

    // Filter Shifts
    const filteredData = useMemo(() => {
        return shifts.filter(shift => {
            // 1. Date Check
            const shiftDate = parseISO(shift.date);
            const isInDateRange = isWithinInterval(shiftDate, {
                start: parseISO(dateRange.start),
                end: parseISO(dateRange.end)
            });
            if (!isInDateRange) return false;

            // 2. Staff Check
            if (selectedStaffId !== 'all' && shift.staffId !== selectedStaffId) return false;

            // 3. Client Check
            if (selectedClientId !== 'all' && shift.clientId !== selectedClientId) return false;

            // 4. Status Check (Only confirmed/completed shifts count for audit/billing)
            if (shift.status !== 'Confirmed') return false;

            return true;
        });
    }, [shifts, dateRange, selectedStaffId, selectedClientId]);

    // Calculate Aggregates
    const stats = useMemo(() => {
        let totalHours = 0;
        let totalStaffCost = 0;
        let totalRevenue = 0;

        filteredData.forEach(shift => {
            const durationHours = shift.duration / 60;
            totalHours += durationHours;

            // Staff Cost
            const staffMember = staff.find(s => s.id === shift.staffId);
            if (staffMember) {
                totalStaffCost += durationHours * (staffMember.hourlyRate || 0);
            }

            // Client Revenue
            const client = clients.find(c => c.id === shift.clientId);
            if (client) {
                totalRevenue += durationHours * (client.hourlyRate || 0);
            }
        });

        return {
            totalHours,
            totalStaffCost,
            totalRevenue,
            margin: totalRevenue - totalStaffCost
        };
    }, [filteredData, staff, clients]);

    const handlePrint = () => {
        window.print();
    };

    const handleExportCSV = () => {
        // 1. Define Headers
        const headers = ['Date', 'Time', 'Client', 'Staff', 'Duration (mins)', 'Staff Pay', 'Client Charge', 'Status'];

        // 2. Generate Rows
        const rows = filteredData.map(shift => {
            const staffMember = staff.find(s => s.id === shift.staffId);
            const client = clients.find(c => c.id === shift.clientId);
            const durationHours = shift.duration / 60;
            const pay = staffMember ? (durationHours * (staffMember.hourlyRate || 0)).toFixed(2) : '0.00';
            const charge = client ? (durationHours * (client.hourlyRate || 0)).toFixed(2) : '0.00';

            return [
                shift.date,
                shift.startTime,
                client?.name || 'Unknown',
                staffMember?.name || 'Unassigned',
                shift.duration,
                pay,
                charge,
                shift.status
            ].map(cell => `"${cell}"`).join(','); // Quote cells to handle commas
        });

        // 3. Combine
        const csvContent = [headers.join(','), ...rows].join('\n');

        // 4. Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `financial_report_${dateRange.start}_to_${dateRange.end}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Financial Reports & Audit</h1>
                        <p className="text-slate-500">Track hours, staff costs, and generate client invoices</p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center shadow-sm"
                        >
                            <Printer size={16} className="mr-2" />
                            Print Report
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-lg shadow-indigo-600/20"
                        >
                            <Download size={16} className="mr-2" />
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date Range Start</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date Range End</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Staff</label>
                        <div className="relative">
                            <select
                                className="w-full px-3 py-2 pl-9 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none font-medium text-slate-700"
                                value={selectedStaffId}
                                onChange={(e) => setSelectedStaffId(e.target.value)}
                            >
                                <option value="all">All Staff Members</option>
                                {staff.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                                ))}
                            </select>
                            <Users size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Client</label>
                        <div className="relative">
                            <select
                                className="w-full px-3 py-2 pl-9 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none font-medium text-slate-700"
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                            >
                                <option value="all">All Clients</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <Users size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Hours</p>
                            <h3 className="text-2xl font-black text-slate-800 mt-1">{stats.totalHours.toFixed(1)} hrs</h3>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-medium text-slate-500">
                        Based on {filteredData.length} visits
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Staff Cost (Est)</p>
                            <h3 className="text-2xl font-black text-slate-800 mt-1">£{stats.totalStaffCost.toFixed(2)}</h3>
                        </div>
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-medium text-rose-500">
                        <ArrowUpRight size={14} className="mr-1" />
                        Payroll estimate
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Revenue (Est)</p>
                            <h3 className="text-2xl font-black text-slate-800 mt-1">£{stats.totalRevenue.toFixed(2)}</h3>
                        </div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-medium text-emerald-500">
                        <ArrowUpRight size={14} className="mr-1" />
                        Invoiceable amount
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Net Margin</p>
                            <h3 className={`text-2xl font-black mt-1 ${stats.margin >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                                £{stats.margin.toFixed(2)}
                            </h3>
                        </div>
                        <div className={`p-2 rounded-lg ${stats.margin >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-medium text-slate-500">
                        Profit after staff costs
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-lg">Detailed Visit Log</h3>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{filteredData.length} Records</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Client</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Member</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Duration</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Staff Pay</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Client Charge</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredData.length > 0 ? (
                                filteredData.map(shift => {
                                    const staffMember = staff.find(s => s.id === shift.staffId);
                                    const client = clients.find(c => c.id === shift.clientId);
                                    const durationHours = shift.duration / 60;
                                    const pay = staffMember ? durationHours * (staffMember.hourlyRate || 0) : 0;
                                    const charge = client ? durationHours * (client.hourlyRate || 0) : 0;

                                    return (
                                        <tr key={shift.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-slate-800">{format(parseISO(shift.date), 'dd MMM yyyy')}</div>
                                                <div className="text-xs text-slate-500 font-medium">{shift.startTime} ({shift.duration} mins)</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-slate-900">{client?.name || 'Unknown'}</div>
                                                <div className="text-xs text-slate-400">{client?.careType}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-slate-900">{staffMember?.name || 'Unassigned'}</div>
                                                <div className="text-xs text-slate-400">{staffMember?.role}</div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                    {shift.duration} mins
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right font-medium text-slate-600">
                                                £{pay.toFixed(2)}
                                            </td>
                                            <td className="py-4 px-6 text-right font-bold text-emerald-600">
                                                £{charge.toFixed(2)}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                                    Completed
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                                        No records found for the selected period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
