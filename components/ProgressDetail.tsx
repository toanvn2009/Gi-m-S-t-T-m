
import React from 'react';
import { TIMELINE_STEPS, AI_LOGS } from '../constants';

const ProgressDetail: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Summary Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-6 gap-2">
            <h3 className="text-base sm:text-lg font-bold">Tổng quan dự án</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">24/10/2023</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90">
                {/* Fix: Merged duplicate className attributes */}
                <circle className="text-slate-100 sm:hidden" cx="48" cy="48" r="42" fill="transparent" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-slate-100 hidden sm:block" cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="10"></circle>
                <circle 
                  /* Fix: Merged duplicate className attributes */
                  className="text-primary rounded-full transition-all duration-1000 hidden sm:block" 
                  cx="64" cy="64" r="58" 
                  fill="transparent" stroke="currentColor" strokeWidth="10"
                  strokeDasharray="364.42"
                  strokeDashoffset="200.43"
                ></circle>
                <circle 
                  className="text-primary rounded-full transition-all duration-1000 sm:hidden" 
                  cx="48" cy="48" r="42" 
                  fill="transparent" stroke="currentColor" strokeWidth="8"
                  strokeDasharray="263.89"
                  strokeDashoffset="145"
                ></circle>
              </svg>
              <span className="absolute text-xl sm:text-2xl font-black">45%</span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4 w-full">
              {[
                { label: 'DỰ KIẾN', value: '15/12' },
                { label: 'CÒN LẠI', value: '52 Ngày' },
                { label: 'HẠNG MỤC', value: '24 Bước' },
                { label: 'TRẠNG THÁI', value: 'Đúng hạn', isStatus: true }
              ].map((stat) => (
                <div key={stat.label} className="p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-500 font-bold mb-0.5">{stat.label}</p>
                  {stat.isStatus ? (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs sm:text-sm font-bold text-green-600 truncate">{stat.value}</span>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-lg font-bold text-slate-900 truncate">{stat.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Logs */}
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-5 sm:p-6 flex flex-col relative overflow-hidden min-h-[250px] lg:min-h-0">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
            <span className="material-symbols-outlined text-6xl sm:text-8xl">auto_awesome</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary fill text-lg sm:text-xl">auto_awesome</span>
            <h3 className="text-base sm:text-lg font-bold text-primary">Nhật ký AI</h3>
          </div>
          <div className="space-y-4 flex-1">
            {AI_LOGS.map((log) => (
              <div key={log.id} className="bg-white/80 p-3 rounded-lg border border-primary/10 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-black text-primary/60 uppercase">{log.type}</span>
                  <span className="text-[9px] text-slate-400">{log.time}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic line-clamp-2">"{log.content}"</p>
              </div>
            ))}
          </div>
          <button className="mt-4 text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
            Xem thêm ghi chú
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Itemized Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold">Lộ trình chi tiết</h3>
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400">
            <span className="material-symbols-outlined text-xl">filter_list</span>
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-0">
            {TIMELINE_STEPS.map((step, idx) => (
              <div key={step.id} className="relative pl-8 sm:pl-10 pb-6 sm:pb-8 group last:pb-0">
                {idx !== TIMELINE_STEPS.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-100 group-last:hidden"></div>
                )}
                
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-white ring-4 ring-white z-10 shadow-sm ${
                  step.status === 'completed' ? 'bg-green-500' : 
                  step.status === 'current' ? 'bg-primary ring-primary/20 scale-110 shadow-lg' : 
                  'bg-slate-200 text-slate-400'
                }`}>
                  <span className="material-symbols-outlined text-[10px] sm:text-sm font-bold">
                    {step.status === 'completed' ? 'check' : step.status === 'current' ? 'sync' : 'hourglass_top'}
                  </span>
                </div>

                <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all p-3 sm:p-4 rounded-xl ${
                  step.status === 'current' ? 'bg-primary/5 border border-primary/10 shadow-sm shadow-primary/5' : ''
                }`}>
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-sm sm:text-base font-bold truncate ${step.status === 'current' ? 'text-primary' : step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>
                      {step.label}
                    </h4>
                    <p className={`text-[11px] sm:text-sm mt-1 truncate ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-500'}`}>
                      {step.contractor || 'Cần xác định'} • {step.date}
                    </p>
                    {step.status === 'current' && (
                      <div className="mt-3 max-w-[200px] h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '75%' }}></div>
                      </div>
                    )}
                  </div>
                  <span className={`px-2.5 py-1 text-[9px] sm:text-xs font-bold rounded-full w-max flex-shrink-0 ${
                    step.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    step.status === 'current' ? 'bg-primary text-white' : 
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {step.status === 'completed' ? 'XÂU XONG' : step.status === 'current' ? 'ĐANG LÀM' : 'SẮP TỚI'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDetail;
