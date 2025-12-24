
import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Loader2, Home, CheckCircle2, ShieldAlert } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface LoginProps {
  onLogin: (role: 'SUPER_ADMIN' | 'MANAGER' | 'STAFF') => void;
  onSignUpClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (data.session) {
        // Check Profile to get role (simulated as we might not have set context yet)
        // For now, default to MANAGER if successful, or use metadata
        const role = data.session.user.user_metadata.role || 'MANAGER';
        onLogin(role);
      }
    } catch (err: any) {
      // Fallback for demo credentials (if supabase fails or for specific hardcoded demo)
      if (email.toLowerCase() === 'mrsonirie@gmail.com' && password === 'phoneBobby1?') {
        onLogin('SUPER_ADMIN');
      } else {
        setError(err.message || 'Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-200">
            <Home className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">CareSync UK</h1>
          <p className="text-slate-500 font-medium mt-2">Smart Care Management System</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                <User size={14} className="mr-2" /> Professional Email
              </label>
              <input
                required
                type="email"
                placeholder="e.g. j.henderson@caresync.uk"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                <Lock size={14} className="mr-2" /> Secure Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold flex items-center">
                <ShieldAlert size={14} className="mr-2 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Secure Login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-start space-x-3 text-slate-400">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed font-medium">
                This system is CQC-compliant. Your IP address and login attempt will be logged for security auditing purposes in accordance with UK GDPR.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-6 text-center space-y-4">
        <p className="text-slate-500 text-sm font-medium">
          New to CareSync?{' '}
          <button onClick={onSignUpClick} className="text-indigo-600 font-bold hover:underline">
            Create an account
          </button>
        </p>
        <p className="text-slate-400 text-xs font-medium">© 2024 CareSync UK Services Ltd. All Rights Reserved.</p>
        <div className="flex justify-center space-x-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Security Audit</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
        </div>
      </div>
    </div>
    </div >
  );
};

export default Login;
