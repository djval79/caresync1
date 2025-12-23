
import React, { useState } from 'react';
import { 
  Building, 
  ShieldAlert, 
  Clock, 
  Bell, 
  UserCircle, 
  Save, 
  CheckCircle2, 
  Info,
  MapPin,
  Lock,
  Globe
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'compliance' | 'defaults' | 'notifications'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const sections = [
    { id: 'profile', label: 'Service Profile', icon: Building },
    { id: 'compliance', label: 'UK Compliance', icon: ShieldAlert },
    { id: 'defaults', label: 'Scheduling Defaults', icon: Clock },
    { id: 'notifications', label: 'Alert Prefs', icon: Bell },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Settings Navigation */}
      <div className="lg:col-span-1 space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeSection === section.id
                ? 'bg-white border-indigo-200 border shadow-sm text-indigo-700 font-bold'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <section.icon size={18} />
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="lg:col-span-3 space-y-6">
        {activeSection === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Care Service Profile</h3>
              <p className="text-xs text-slate-400 font-medium">Updated: 2h ago</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                    <Building size={14} className="mr-2" /> Registered Service Name
                  </label>
                  <input
                    type="text"
                    defaultValue="St. Jude's Care & Domiciliary Services"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                    <Lock size={14} className="mr-2" /> CQC Provider ID
                  </label>
                  <input
                    type="text"
                    defaultValue="1-1039485721"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                    <MapPin size={14} className="mr-2" /> Service Postcode
                  </label>
                  <input
                    type="text"
                    defaultValue="SE1 7PB"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                    <Globe size={14} className="mr-2" /> Region
                  </label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                    <option>London & South East</option>
                    <option>Midlands</option>
                    <option>North West</option>
                    <option>Scotland</option>
                    <option>Wales</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'compliance' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">UK Employment & CQC Compliance</h3>
              <p className="text-sm text-slate-500">Configure safety limits and legal working caps.</p>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">Working Time Regulations (48h Cap)</p>
                  <p className="text-sm text-slate-500 pr-8">Flag any staff exceeding the 48-hour average over a 17-week reference period.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">Minimum Daily Rest (11 Hours)</p>
                  <p className="text-sm text-slate-500 pr-8">Prevent scheduling shifts with less than 11 hours break between them without manager override.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">CQC Safe Staffing Levels</p>
                  <p className="text-sm text-slate-500 pr-8">Auto-calculate required ratios based on Resident Dependency scores.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start space-x-3">
                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  Compliance settings are reviewed against current UK Department of Health & Social Care (DHSC) directives. Last policy sync: 01 May 2024.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'defaults' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Scheduling Defaults</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Default Visit Duration</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                    <option>15 Minutes</option>
                    <option>30 Minutes</option>
                    <option selected>60 Minutes</option>
                    <option>90 Minutes</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Default Travel Time (Domiciliary)</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                    <option>No Offset</option>
                    <option selected>15 Minutes</option>
                    <option>30 Minutes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="p-12 text-center space-y-4">
                <Bell size={48} className="mx-auto text-slate-200" />
                <h4 className="text-lg font-bold text-slate-800">Notification Channels</h4>
                <p className="text-slate-500 max-w-xs mx-auto">Configure how your team receives rota updates and shift alerts.</p>
                <button className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 transition-all">Configure Email/SMS Gateway</button>
             </div>
          </div>
        )}

        {/* Floating Action Bar */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center space-x-2"
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={20} />
                <span>Saved Successfully</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
