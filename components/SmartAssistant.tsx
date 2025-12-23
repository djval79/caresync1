
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { getRotaInsights } from '../services/geminiService';
import { Staff, Shift, RotaInsight } from '../types';

interface SmartAssistantProps {
  staff: Staff[];
  shifts: Shift[];
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ staff, shifts }) => {
  const [insights, setInsights] = useState<RotaInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const analyzeRota = async () => {
    setLoading(true);
    const result = await getRotaInsights(staff, shifts);
    setInsights(result);
    setLoading(false);
  };

  useEffect(() => {
    analyzeRota();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'compliance': return { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-800', icon: AlertCircle, iconColor: 'text-red-500' };
      case 'optimization': return { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-800', icon: TrendingUp, iconColor: 'text-indigo-500' };
      default: return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-800', icon: CheckCircle2, iconColor: 'text-emerald-500' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">CareSync AI Assistant</h2>
              <p className="text-indigo-100 text-sm">Smart optimization for your UK care setting</p>
            </div>
          </div>
          <button 
            onClick={analyzeRota}
            disabled={loading}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Refresh Insights</span>}
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-slate-500 animate-pulse">Consulting CQC guidelines and shift data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, idx) => {
              const styles = getTypeStyles(insight.type);
              const Icon = styles.icon;
              return (
                <div key={idx} className={`${styles.bg} ${styles.border} border rounded-xl p-5 relative overflow-hidden group hover:shadow-md transition-all`}>
                  <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                    <Icon size={64} />
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon className={`${styles.iconColor} shrink-0 mt-0.5`} size={20} />
                    <div>
                      <h4 className={`font-bold ${styles.text}`}>{insight.title}</h4>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                  <button className="mt-4 text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800">Apply Recommendation →</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400">CareSync AI models are updated with the latest UK DHSC and CQC staffing guidelines.</p>
      </div>
    </div>
  );
};

export default SmartAssistant;
