
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CalendarDays, Users, Home, Settings as SettingsIcon, LogOut, Bell, Search, Bot, Heart, ShieldCheck, User as UserIcon, RefreshCw, Loader2, CreditCard, ShieldAlert } from 'lucide-react';
import Dashboard from './components/Dashboard';
import RotaGrid from './components/RotaGrid';
import SmartAssistant from './components/SmartAssistant';
import StaffDirectory from './components/StaffDirectory';
import ClientDirectory from './components/ResidentsDirectory';
import Settings from './components/Settings';
import SubscriptionView from './components/SubscriptionView';
import Login from './components/Login';
import AddStaffModal from './components/AddStaffModal';
import AddShiftModal from './components/AddShiftModal';
import AddClientModal from './components/AddResidentModal';
import { INITIAL_STAFF, MOCK_SHIFTS, INITIAL_CLIENTS } from './constants';
import { Staff, Shift, StaffRole, Client, CareType } from './types';

type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'STAFF';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('MANAGER');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rota' | 'staff' | 'residents' | 'assistant' | 'settings' | 'billing'>('dashboard');
  
  // Local storage keys
  const STORAGE_KEY_STAFF = 'caresync_staff_v1';
  const STORAGE_KEY_SHIFTS = 'caresync_shifts_v1';
  const STORAGE_KEY_CLIENTS = 'caresync_clients_v1';

  // State initialization with Persistence
  const [staffList, setStaffList] = useState<Staff[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STAFF);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });
  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SHIFTS);
    return saved ? JSON.parse(saved) : MOCK_SHIFTS;
  });
  const [residentsList, setResidentsList] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CLIENTS);
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);
  const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  // Sync state to local storage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SHIFTS, JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(residentsList));
  }, [residentsList]);

  // Initial loading simulation for production feel
  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-switch tab if role changes and current tab is restricted
  useEffect(() => {
    if (userRole === 'STAFF' && activeTab !== 'rota') {
      setActiveTab('rota');
    }
  }, [userRole]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleAssignShift = (shiftId: string, staffId: string) => {
    if (userRole === 'STAFF') return;
    setShifts(prev => prev.map(s => 
      s.id === shiftId ? { ...s, staffId, status: 'Confirmed' } : s
    ));
    const shift = shifts.find(s => s.id === shiftId);
    if (shift) {
      const hours = shift.duration / 60;
      setStaffList(prev => prev.map(s => 
        s.id === staffId ? { ...s, currentHours: s.currentHours + hours } : s
      ));
    }
  };

  const handleAddStaff = (data: { name: string, role: StaffRole, contractedHours: number }) => {
    const newStaff: Staff = {
      id: Date.now().toString(),
      name: data.name,
      role: data.role,
      contractedHours: data.contractedHours,
      currentHours: 0,
      rating: 5.0,
      complianceStatus: 'Green'
    };
    setStaffList([...staffList, newStaff]);
    setIsAddStaffModalOpen(false);
  };

  const handleAddShift = (data: any) => {
    const newShift: Shift = {
      id: `s-${Date.now()}`,
      date: data.date,
      type: data.type,
      clientId: data.clientId,
      startTime: data.startTime,
      duration: data.duration,
      staffId: data.staffId || null,
      status: data.staffId ? 'Confirmed' : 'Unassigned'
    };
    setShifts([...shifts, newShift]);
    if (data.staffId) {
      const hours = data.duration / 60;
      setStaffList(prev => prev.map(s => 
        s.id === data.staffId ? { ...s, currentHours: s.currentHours + hours } : s
      ));
    }
    setIsAddShiftModalOpen(false);
  };

  const handleAddResident = (data: { name: string, careType: CareType, roomNumber?: string, address?: string, postcode?: string, careLevel: 'Low' | 'Medium' | 'High' }) => {
    const newResident: Client = {
      id: `c${Date.now()}`,
      name: data.name,
      careType: data.careType,
      roomNumber: data.roomNumber,
      address: data.address,
      postcode: data.postcode,
      careLevel: data.careLevel
    };
    setResidentsList([...residentsList, newResident]);
    setIsAddResidentModalOpen(false);
  };

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'MANAGER'] },
    { id: 'rota', label: 'Care Schedule', icon: CalendarDays, roles: ['SUPER_ADMIN', 'MANAGER', 'STAFF'] },
    { id: 'staff', label: 'Staff Directory', icon: Users, roles: ['SUPER_ADMIN', 'MANAGER'] },
    { id: 'residents', label: 'Client Care', icon: Heart, roles: ['SUPER_ADMIN', 'MANAGER'] },
    { id: 'assistant', label: 'AI Optimizer', icon: Bot, roles: ['SUPER_ADMIN', 'MANAGER'] },
    { id: 'billing', label: 'Subscription', icon: CreditCard, roles: ['SUPER_ADMIN', 'MANAGER'] },
  ];

  const visibleNavItems = allNavItems.filter(item => item.roles.includes(userRole));

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (appLoading) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="text-indigo-600 animate-spin mb-4" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Initialising CareSync Environment...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 relative z-20">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Home className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">CareSync UK</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          {['SUPER_ADMIN', 'MANAGER'].includes(userRole) && (
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'settings' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <SettingsIcon size={20} />
              <span className="font-medium">Settings</span>
            </button>
          )}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-950/30 transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96 flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search schedule or locations..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">
                  {userRole === 'SUPER_ADMIN' ? 'Owner / Admin' : (userRole === 'MANAGER' ? 'James Henderson' : 'Sarah Jenkins')}
                </p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${userRole === 'SUPER_ADMIN' ? 'bg-rose-500' : (userRole === 'MANAGER' ? 'bg-indigo-500' : 'bg-emerald-500')}`}></span>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    {userRole === 'SUPER_ADMIN' ? 'Super Administrator' : (userRole === 'MANAGER' ? 'Registered Manager' : 'Care Professional')}
                  </p>
                </div>
              </div>
              <img 
                src={`https://picsum.photos/seed/${userRole === 'SUPER_ADMIN' ? 'super' : (userRole === 'MANAGER' ? 'jhenderson' : 'sjenkins')}/64`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-indigo-100 object-cover"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {activeTab === 'settings' ? 'System Settings' : (activeTab === 'billing' ? 'Billing & Plans' : allNavItems.find(i => i.id === activeTab)?.label)}
                </h2>
                <div className="flex items-center space-x-2 text-slate-500 text-sm mt-1">
                  {userRole === 'SUPER_ADMIN' ? <ShieldAlert size={14} className="text-rose-500" /> : <ShieldCheck size={14} className="text-emerald-500" />}
                  <p className="font-medium">
                    {userRole === 'SUPER_ADMIN' ? 'Root Access Enabled' : "St. Jude's Care Service • CQC Provider: 1-1039485721"}
                  </p>
                </div>
              </div>
              
              {['SUPER_ADMIN', 'MANAGER'].includes(userRole) && activeTab !== 'billing' && (
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-sm shadow-sm">Audit Log</button>
                  <button 
                    onClick={() => setIsAddShiftModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all text-sm flex items-center space-x-2"
                  >
                    <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>New Visit</span>
                  </button>
                </div>
              )}
            </div>

            <div className="animate-in fade-in zoom-in-95 duration-700">
              {activeTab === 'dashboard' && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && <Dashboard staff={staffList} />}
              {activeTab === 'rota' && (
                <RotaGrid 
                  shifts={shifts} 
                  staff={staffList} 
                  clients={residentsList}
                  isAdmin={['SUPER_ADMIN', 'MANAGER'].includes(userRole)}
                  onAssignShift={handleAssignShift} 
                  onOpenAddShift={() => setIsAddShiftModalOpen(true)} 
                />
              )}
              {activeTab === 'assistant' && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && <SmartAssistant staff={staffList} shifts={shifts} />}
              {activeTab === 'staff' && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && <StaffDirectory staff={staffList} onAddStaffClick={() => setIsAddStaffModalOpen(true)} />}
              {activeTab === 'residents' && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && <ClientDirectory residents={residentsList} onAddResidentClick={() => setIsAddResidentModalOpen(true)} />}
              {activeTab === 'settings' && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && <Settings />}
              {activeTab === 'billing' && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && <SubscriptionView />}
            </div>

            {userRole === 'STAFF' && activeTab !== 'rota' && (
              <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl shadow-slate-200/50">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={48} className="text-indigo-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Restricted Access</h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">As a care professional, your access is strictly limited to the care delivery schedule. For adjustments, please contact your registered manager.</p>
                <button 
                  onClick={() => setActiveTab('rota')}
                  className="mt-4 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
                >
                  Return to Schedule
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {isAddStaffModalOpen && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && (
        <AddStaffModal 
          onClose={() => setIsAddStaffModalOpen(false)} 
          onAdd={handleAddStaff} 
        />
      )}
      {isAddShiftModalOpen && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && (
        <AddShiftModal 
          staff={staffList}
          clients={residentsList}
          onClose={() => setIsAddShiftModalOpen(false)} 
          onAdd={handleAddShift} 
        />
      )}
      {isAddResidentModalOpen && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && (
        <AddClientModal
          onClose={() => setIsAddResidentModalOpen(false)}
          onAdd={handleAddResident}
        />
      )}
    </div>
  );
};

export default App;
