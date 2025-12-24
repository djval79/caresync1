
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CalendarDays, Users, Home, Settings as SettingsIcon, LogOut, Bell, Search, Bot, Heart, ShieldCheck, User as UserIcon, RefreshCw, Loader2, CreditCard, ShieldAlert, PieChart, Pill, PartyPopper } from 'lucide-react';
import { addDays, format } from 'date-fns';
import Dashboard from './components/Dashboard';
import RotaGrid from './components/RotaGrid';
import SmartAssistant from './components/SmartAssistant';
import StaffDirectory from './components/StaffDirectory';
import ClientDirectory from './components/ResidentsDirectory';
import Settings from './components/Settings';
import SubscriptionView from './components/SubscriptionView';
import Reports from './components/Reports';
import EMARDashboard from './components/eMARDashboard';
import Login from './components/Login';
import AddStaffModal from './components/AddStaffModal';
import AddShiftModal from './components/AddShiftModal';
import AddClientModal from './components/AddResidentModal';
import SignUp from './components/SignUp';
import { INITIAL_STAFF, MOCK_SHIFTS, INITIAL_CLIENTS } from './constants';
import { Staff, Shift, StaffRole, Client, CareType, MedicationLog, MedicationStatus } from './types';

type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'STAFF';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [authView, setAuthView] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rota' | 'staff' | 'residents' | 'assistant' | 'reports' | 'emar' | 'family' | 'settings' | 'billing'>('dashboard');

  // Local storage keys
  const STORAGE_KEY_STAFF = 'caresync_staff_v1';
  const STORAGE_KEY_SHIFTS = 'caresync_shifts_v1';
  const STORAGE_KEY_CLIENTS = 'caresync_clients_v1';
  const STORAGE_KEY_MED_LOGS = 'caresync_med_logs_v1';

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
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MED_LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);
  const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [editingResident, setEditingResident] = useState<Client | null>(null);

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MED_LOGS, JSON.stringify(medicationLogs));
  }, [medicationLogs]);

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

    // Find previous staff to deduct hours
    const shift = shifts.find(s => s.id === shiftId);

    setShifts(prev => prev.map(s =>
      s.id === shiftId ? { ...s, staffId, status: 'Confirmed' } : s
    ));

    if (shift) {
      const hours = shift.duration / 60;
      setStaffList(prev => prev.map(s => {
        if (s.id === shift.staffId && shift.staffId !== staffId) {
          return { ...s, currentHours: Math.max(0, s.currentHours - hours) };
        }
        if (s.id === staffId) {
          return { ...s, currentHours: s.currentHours + hours };
        }
        return s;
      }));
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
      complianceStatus: 'Green',
      hourlyRate: 15.00 // Default starter rate
    };
    setStaffList([...staffList, newStaff]);
    setIsAddStaffModalOpen(false);
  };

  const handleAddShift = (data: any | any[]) => {
    // Handle Update (Editing existing shift)
    if (!Array.isArray(data) && data.id) {
      const oldShift = shifts.find(s => s.id === data.id);

      setShifts(prev => prev.map(s => s.id === data.id ? { ...s, ...data, status: data.staffId ? 'Confirmed' : 'Unassigned' } : s));

      if (oldShift) {
        setStaffList(prev => prev.map(staff => {
          let newHours = staff.currentHours;
          // Deduct old hours if staff was assigned
          if (oldShift.staffId && staff.id === oldShift.staffId) {
            newHours -= (oldShift.duration / 60);
          }
          // Add new hours if staff is assigned
          if (data.staffId && staff.id === data.staffId) {
            newHours += (data.duration / 60);
          }
          return { ...staff, currentHours: Math.max(0, newHours) };
        }));
      }

      setIsAddShiftModalOpen(false);
      setEditingShift(null);
      return;
    }

    // Handle Create (New shifts)
    const createShift = (shiftData: any, index: number = 0) => ({
      id: `s-${Date.now()}-${index}`,
      date: shiftData.date,
      type: shiftData.type,
      clientId: shiftData.clientId,
      startTime: shiftData.startTime,
      duration: shiftData.duration,
      staffId: shiftData.staffId || null,
      status: shiftData.staffId ? 'Confirmed' : 'Unassigned' as 'Confirmed' | 'Unassigned'
    });

    if (Array.isArray(data)) {
      const newShifts = data.map((d, i) => createShift(d, i));
      setShifts(prev => [...prev, ...newShifts]);

      // Update staff hours for all assigned shifts
      const staffUpdates = new Map<string, number>();
      newShifts.forEach(s => {
        if (s.staffId) {
          const hours = s.duration / 60;
          staffUpdates.set(s.staffId, (staffUpdates.get(s.staffId) || 0) + hours);
        }
      });

      if (staffUpdates.size > 0) {
        setStaffList(prev => prev.map(s => {
          const additionalHours = staffUpdates.get(s.id);
          return additionalHours ? { ...s, currentHours: s.currentHours + additionalHours } : s;
        }));
      }
    } else {
      const newShift = createShift(data);
      setShifts(prev => [...prev, newShift]);
      if (data.staffId) {
        const hours = data.duration / 60;
        setStaffList(prev => prev.map(s =>
          s.id === data.staffId ? { ...s, currentHours: s.currentHours + hours } : s
        ));
      }
    }
    setIsAddShiftModalOpen(false);
  };

  const handleAddResident = (data: {
    name: string,
    careType: CareType,
    roomNumber?: string,
    address?: string,
    postcode?: string,
    careLevel: 'Low' | 'Medium' | 'High',
    visitSchedule?: { label: string, time: string, duration: number, active: boolean }[],
    medications?: any[]
  }) => {
    if (editingResident) {
      // Update Mode
      setResidentsList(prev => prev.map(c =>
        c.id === editingResident.id
          ? {
            ...c,
            ...data,
            // preserve existing ID and other stats
            hourlyRate: data.careLevel === 'High' ? 35.00 : (data.careLevel === 'Medium' ? 30.00 : 25.00),
            medications: data.medications || []
          }
          : c
      ));
      setIsAddResidentModalOpen(false);
      setEditingResident(null);
      return;
    }

    const newResident: Client = {
      id: `c${Date.now()}`,
      name: data.name,
      careType: data.careType,
      roomNumber: data.roomNumber,
      address: data.address,
      postcode: data.postcode,
      careLevel: data.careLevel,
      hourlyRate: data.careLevel === 'High' ? 35.00 : (data.careLevel === 'Medium' ? 30.00 : 25.00),
      medications: data.medications || []
    };
    setResidentsList(prev => [...prev, newResident]);

    // Auto-Schedule Generation (Premium Feature)
    if (data.visitSchedule && data.visitSchedule.length > 0) {
      const generatedShifts: Shift[] = [];
      const startDate = new Date();

      // Helper to determine shift type based on hour
      const getShiftType = (timeStr: string) => {
        const hour = parseInt(timeStr.split(':')[0]);
        if (hour < 12) return 'Morning (07:00-14:30)';
        if (hour < 17) return 'Afternoon (14:00-21:30)';
        return 'Night (21:00-07:30)';
      };

      // Generate for 4 weeks
      for (let i = 0; i < 28; i++) {
        const currentDate = addDays(startDate, i);
        const dateString = format(currentDate, 'yyyy-MM-dd');

        data.visitSchedule.forEach((visit, index) => {
          if (visit.active) {
            generatedShifts.push({
              id: `auto-${newResident.id}-${i}-${index}`,
              staffId: null,
              clientId: newResident.id,
              date: dateString,
              type: getShiftType(visit.time) as any,
              startTime: visit.time,
              duration: visit.duration,
              status: 'Unassigned'
            });
          }
        });
      }

      setShifts(prev => [...prev, ...generatedShifts]);
    }

    setIsAddResidentModalOpen(false);
  };

  const handleAdministerMedication = (clientId: string, medId: string, status: MedicationStatus, notes?: string) => {
    // 1. Create Log Entry
    const newLog: MedicationLog = {
      id: `log-${Date.now()}`,
      clientId,
      medicationId: medId,
      staffId: userRole === 'MANAGER' ? '1' : (userRole === 'STAFF' ? '3' : '0'), // Mock ID mapping
      timestamp: new Date().toISOString(),
      status,
      notes
    };
    setMedicationLogs(prev => [newLog, ...prev]);

    // 2. Decrement Stock if Taken
    if (status === MedicationStatus.TAKEN) {
      setResidentsList(prev => prev.map(client => {
        if (client.id === clientId && client.medications) {
          return {
            ...client,
            medications: client.medications.map(med => {
              if (med.id === medId) {
                return { ...med, stockLevel: Math.max(0, med.stockLevel - 1) };
              }
              return med;
            })
          };
        }
        return client;
      }));
    }
  };

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'MANAGER'] },
    { id: 'rota', label: 'Care Schedule', icon: CalendarDays, roles: ['SUPER_ADMIN', 'MANAGER', 'STAFF'] },
    { id: 'staff', label: 'Staff Directory', icon: Users, roles: ['SUPER_ADMIN', 'MANAGER'] },
    { id: 'residents', label: 'Client Care', icon: Heart, roles: ['SUPER_ADMIN', 'MANAGER'] },
    { id: 'emar', label: 'Pharmacy (eMAR)', icon: Pill, roles: ['SUPER_ADMIN', 'MANAGER', 'STAFF'] },
    { id: 'reports', label: 'Finance & Audit', icon: PieChart, roles: ['SUPER_ADMIN', 'MANAGER'] },
    { id: 'family', label: 'Family Portal', icon: PartyPopper, roles: ['SUPER_ADMIN', 'MANAGER'] },
    { id: 'assistant', label: 'AI Optimizer', icon: Bot, roles: ['SUPER_ADMIN', 'MANAGER'] },
    { id: 'billing', label: 'My Subscription', icon: CreditCard, roles: ['SUPER_ADMIN', 'MANAGER'] },
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

  if (!userRole) {
    if (authView === 'SIGNUP') {
      return (
        <SignUp
          onBackToLogin={() => setAuthView('LOGIN')}
          onSignUpSuccess={(email) => {
            alert(`Account created for ${email}! Please log in.`);
            setAuthView('LOGIN'); // Redirect to login
          }}
        />
      );
    }
    return <Login
      onLogin={(role) => { setUserRole(role); setIsAuthenticated(true); }}
      onSignUpClick={() => setAuthView('SIGNUP')}
    />;
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'settings'
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
                    onClick={() => { setEditingShift(null); setIsAddShiftModalOpen(true); }}
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
                  onOpenAddShift={() => { setEditingShift(null); setIsAddShiftModalOpen(true); }}
                  onEditShift={(shift) => { setEditingShift(shift); setIsAddShiftModalOpen(true); }}
                />
              )}
              {activeTab === 'assistant' && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && <SmartAssistant staff={staffList} shifts={shifts} />}
              {activeTab === 'staff' && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && <StaffDirectory staff={staffList} onAddStaffClick={() => setIsAddStaffModalOpen(true)} />}
              {activeTab === 'residents' && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) &&
                <ClientDirectory
                  residents={residentsList}
                  onAddResidentClick={() => { setEditingResident(null); setIsAddResidentModalOpen(true); }}
                  onViewResident={(client) => { setEditingResident(client); setIsAddResidentModalOpen(true); }}
                />
              }
              {activeTab === 'reports' && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && <Reports shifts={shifts} staff={staffList} clients={residentsList} />}
              {activeTab === 'emar' && ['SUPER_ADMIN', 'MANAGER', 'STAFF'].includes(userRole) &&
                <EMARDashboard
                  clients={residentsList}
                  medicationLogs={medicationLogs}
                  onAdminister={handleAdministerMedication}
                />
              }
              {activeTab === 'family' && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && (
                <div className="flex flex-col items-center justify-center p-24 text-center bg-white rounded-3xl border border-slate-200">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <PartyPopper size={48} className="text-indigo-500" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4">Family Connect App</h2>
                  <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
                    We are building a dedicated portal for family members to stay updated with their loved ones' care journey.
                  </p>
                  <span className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-full text-sm">
                    Coming Soon - Q3 2025
                  </span>
                </div>
              )}
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
          onClose={() => { setIsAddShiftModalOpen(false); setEditingShift(null); }}
          onAdd={handleAddShift}
          editShift={editingShift}
        />
      )}
      {isAddResidentModalOpen && ['SUPER_ADMIN', 'MANAGER'].includes(userRole) && (
        <AddClientModal
          onClose={() => { setIsAddResidentModalOpen(false); setEditingResident(null); }}
          onAdd={handleAddResident}
          initialData={editingResident}
        />
      )}
    </div>
  );
};

export default App;
