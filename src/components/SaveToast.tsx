import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const SaveToast: React.FC = () => {
  const { toastMessage, setToastMessage } = useApp();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success' || !toastMessage.type;
  const isWarning = toastMessage.type === 'warning';
  const isInfo = toastMessage.type === 'info';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div 
        className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
          isSuccess 
            ? 'bg-emerald-950/90 text-white border-emerald-500/40 shadow-emerald-950/20' 
            : isWarning 
            ? 'bg-amber-950/90 text-white border-amber-500/40 shadow-amber-950/20'
            : 'bg-slate-900/90 text-white border-slate-700/60 shadow-slate-950/20'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isWarning && <AlertCircle className="w-5 h-5 text-amber-400" />}
          {isInfo && <Info className="w-5 h-5 text-sky-400" />}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm tracking-tight text-white leading-snug">
            {toastMessage.title}
          </h4>
          {toastMessage.desc && (
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {toastMessage.desc}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setToastMessage(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
