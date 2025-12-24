
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Calendar, AlertTriangle, CheckCircle, ShieldCheck, HeartPulse } from 'lucide-react';
import { Staff } from '../types';

interface DashboardProps {
  staff: Staff[];
}

const Dashboard: React.FC<DashboardProps> = ({ staff }) => {
  const chartData = staff.map(s => ({
    name: s.name.split(' ')[0],
    hours: s.currentHours,
    contract: s.contractedHours
  }));

  const stats = [
    { label: 'Active Staff', value: staff.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Visits Today', value: 12, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Compliance Alerts', value: staff.filter(s => s.complianceStatus === 'Red').length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'CQC Outlook', value: 'Good', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group hover:border-indigo-200 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black mt-1 text-slate-900 tracking-tight">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Staff Utilization Index</h3>
              <p className="text-sm text-slate-500 font-medium">Actual Hours vs Contract (WTR 48h Filtered)</p>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-xs font-bold text-slate-400 uppercase">Within Contract</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                <span className="text-xs font-bold text-slate-400 uppercase">Over Limit</span>
              </div>
            </div>
          </div>
          <div className="w-full h-[320px] min-w-0">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="hours" name="Actual Hours" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hours > entry.contract ? '#f43f5e' : '#6366f1'} />
                  ))}
                </Bar>
                <Bar dataKey="contract" fill="#e2e8f0" name="Contracted" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center tracking-tight">
              <AlertTriangle size={20} className="text-rose-500 mr-2" />
              Priority Compliance
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-bold text-rose-800">CQC Rota Alert</p>
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Urgent</span>
                </div>
                <p className="text-xs text-rose-700 mt-2 font-medium leading-relaxed">David Thompson is approaching 44h. 11h daily rest period might be breached tomorrow.</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <p className="text-sm font-bold text-amber-800">Unassigned Morning</p>
                <p className="text-xs text-amber-700 mt-1 font-medium">Tomorrow (07:00) requires a Senior Carer for resident Arthur Bentley.</p>
              </div>
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <p className="text-sm font-bold text-indigo-800">CQC Audit Sync</p>
                <p className="text-xs text-indigo-700 mt-1 font-medium">Digital records for this week's visits are 94% complete. Review needed.</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-2xl shadow-xl shadow-indigo-600/20 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="p-2 bg-white/20 rounded-lg w-fit mb-4">
                <HeartPulse size={20} />
              </div>
              <h4 className="font-bold text-lg mb-1 tracking-tight">Ready for inspection?</h4>
              <p className="text-indigo-100 text-xs leading-relaxed font-medium">All care logs are being automatically timestamped and synced with CQC-standard reporting protocols.</p>
              <button className="mt-4 w-full py-2.5 bg-white text-indigo-600 font-bold rounded-xl text-xs hover:bg-indigo-50 transition-all">Generate Evidence Report</button>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <ShieldCheck size={120} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
