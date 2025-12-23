
import React from 'react';
import { CreditCard, CheckCircle2, Download, ShieldCheck, Clock, ArrowRight, Zap, Info } from 'lucide-react';

const SubscriptionView: React.FC = () => {
  const invoices = [
    { id: 'CS-0034', date: '01 May 2024', amount: '£7.79', status: 'Paid' },
    { id: 'CS-0021', date: '01 Apr 2024', amount: '£7.79', status: 'Paid' },
    { id: 'CS-0010', date: '01 Mar 2024', amount: '£7.79', status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Plan Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
          <div className="p-8 flex-1 border-r border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                Current Plan
              </span>
              <span className="text-slate-400 text-xs font-medium">Next billing: 01 Jun 2024</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Standard Care Plan</h3>
            <div className="flex items-baseline space-x-1 mb-8">
              <span className="text-4xl font-black text-indigo-600">£7.79</span>
              <span className="text-slate-400 font-bold">/month</span>
              <span className="text-[10px] text-slate-400 ml-2 font-medium">(VAT Included)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                'Unlimited Staff Members',
                'AI Rota Optimizer',
                'CQC Evidence Reporting',
                'PWA Mobile Access',
                'Digital Care Records',
                'GPDR & CQC Compliant'
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
                <span>Update Card</span>
              </button>
              <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">
                Change Plan
              </button>
            </div>
          </div>

          <div className="p-8 bg-slate-50 w-full md:w-80 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Usage Limits</h4>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Active Staff</span>
                    <span className="text-indigo-600">6 / Unlimited</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Cloud Evidence</span>
                    <span className="text-indigo-600">1.2GB / 10GB</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
              <div className="flex items-start space-x-3 text-slate-400">
                <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed font-medium">
                  Your billing data is processed securely by our UK partners. We do not store full credit card details on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support/Upsell Card */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h4 className="text-xl font-black mb-2 tracking-tight">Need Enterprise?</h4>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">
                For care groups with over 5 locations, we offer custom multi-site reporting and direct CQC API integration.
              </p>
              <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-indigo-50 transition-all">
                <span>Talk to Sales</span>
                <ArrowRight size={18} />
              </button>
            </div>
            <Zap className="absolute -bottom-10 -right-10 text-white opacity-5 group-hover:scale-110 transition-transform" size={240} />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-start space-x-4">
             <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
               <Info size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-slate-800">CQC Tax Relief</p>
               <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                 As a registered care provider, you may be eligible to claim back 100% of CareSync UK costs under HMRC R&D or operational tax relief.
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
        {invoices.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <Clock size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">No billing history found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionView;
