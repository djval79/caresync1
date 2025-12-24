import React, { useState } from 'react';
import { User, Mail, Lock, Building, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface SignUpProps {
    onBackToLogin: () => void;
    onSignUpSuccess: (email: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onBackToLogin, onSignUpSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        organization: '',
        role: 'MANAGER' as 'MANAGER' | 'STAFF'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: formData.role,
                        organization: formData.organization,
                    }
                }
            });

            if (authError) throw authError;

            if (data.user) {
                // Success
                console.log("Account Created:", data.user);
                onSignUpSuccess(formData.email);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to sign up');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Join CareSync UK</h1>
                    <p className="text-slate-500 font-medium mt-2">Create your professional account</p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                                <User size={14} className="mr-2" /> Full Name
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Sarah Jenkins"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                                <Mail size={14} className="mr-2" /> Email Address
                            </label>
                            <input
                                required
                                type="email"
                                placeholder="e.g. s.jenkins@carehome.uk"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                                <Lock size={14} className="mr-2" /> Password
                            </label>
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                                <Building size={14} className="mr-2" /> Organization Name
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Sunny Days Care"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                value={formData.organization}
                                onChange={e => setFormData({ ...formData, organization: e.target.value })}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-slate-500 text-sm font-medium">
                            Already have an account?{' '}
                            <button
                                onClick={onBackToLogin}
                                className="text-indigo-600 font-bold hover:underline"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-center space-x-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                    <span className="flex items-center"><CheckCircle2 size={12} className="mr-1" /> secure</span>
                    <span className="flex items-center"><CheckCircle2 size={12} className="mr-1" /> encrypted</span>
                    <span className="flex items-center"><CheckCircle2 size={12} className="mr-1" /> compliant</span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
