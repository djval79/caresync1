import React from 'react';
import { CreditCard, CheckCircle2, Download, ShieldCheck, Clock, ArrowRight, Zap, Info, Building2, Users } from 'lucide-react';

const SubscriptionView: React.FC = () => {
  const invoices = [
    { id: 'CS-2025-0012', date: '01 Dec 2025', amount: '£149.00', status: 'Paid' },
    { id: 'CS-2025-0008', date: '01 Nov 2025', amount: '£149.00', status: 'Paid' },
    { id: 'CS-2025-0003', date: '01 Oct 2025', amount: '£149.00', status: 'Paid' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Plan Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
          <div className="p-8 flex-1 border-r border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                Active License
              </span>
              <span className="text-slate-400 text-xs font-medium">Auto-renew: 01 Jan 2026</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Professional Care Suite</h3>
            <div className="flex items-baseline space-x-1 mb-8">
              <span className="text-4xl font-black text-slate-900">£149.00</span>
              <span className="text-slate-400 font-bold">/mo</span>
              <span className="text-[10px] text-slate-400 ml-2 font-medium">(Ex. VAT)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                'Smart AI Rostering (Beta)',
                'Real-time CQC Auditing',
                'eMAR & Medication Suite (Coming Soon)',
                'Family & Next of Kin App (Coming Soon)',
                'Offline Mobile Access',
                'Unlimited Staff Accounts'
              ].map((feature, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-600">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2">
                <CreditCard size={18} />
                <span>Manage Payment</span>
              </button>
              <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">
                Upgrade Plan
              </button>
            </div>
          </div>

          <div className="p-8 bg-slate-50 w-full md:w-80 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">License Usage</h4>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600 flex items-center"><Users size={12} className="mr-1.5" /> Active Clients</span>
                    <span className="text-indigo-600">34 / 50</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 text-right">16 licenses remaining</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600 flex items-center"><Building2 size={12} className="mr-1.5" /> Locations</span>
                    <span className="text-indigo-600">1 / 1</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
              <div className="flex items-start space-x-3 text-slate-400">
                <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed font-medium">
                  Protected by UK-GDPR bank-grade security protocols.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support/Upsell Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={24} className="text-indigo-400" />
              </div>
              <h4 className="text-xl font-black mb-2 tracking-tight">Enterprise Scale</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                Managing multiple care homes? Unlock centralized reporting, dedicated Customer Success Manager, and API access.
              </p>
              <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-indigo-500 transition-all border border-indigo-500/50">
                <span>Contact Sales</span>
                <ArrowRight size={18} />
              </button>
            </div>
            <Zap className="absolute -bottom-10 -right-10 text-indigo-500 opacity-10 group-hover:scale-110 transition-transform" size={240} />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-start space-x-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Info size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Digitisation Fund</p>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                CareSync UK is an NHS-assured supplier. You can claim up to 50% funding for your subscription via the Adult Social Care Digital Transformation Fund.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Billing History</h3>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
            Download All (PDF)
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Invoice ID</th>
              <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Billing Date</th>
              <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-4 font-bold text-slate-800 text-sm">{inv.id}</td>
                <td className="px-8 py-4 text-slate-500 text-sm font-medium">{inv.date}</td>
                <td className="px-8 py-4 font-black text-slate-900 text-sm">{inv.amount}</td>
                <td className="px-8 py-4">
                  <div className="flex items-center space-x-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 w-fit text-[10px] font-black uppercase">
                    <CheckCircle2 size={12} />
                    <span>{inv.status}</span>
                  </div>
                </td>
                <td className="px-8 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionView;
