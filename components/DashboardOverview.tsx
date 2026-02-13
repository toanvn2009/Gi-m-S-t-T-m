
import React from 'react';
import { TIMELINE_STEPS, DAILY_PHOTOS } from '../constants';

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Main Section */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Construction Timeline */}
          <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100">
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-6 gap-2">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">route</span>
                Lộ trình thi công
              </h3>
              <span className="text-[10px] sm:text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold whitespace-nowrap">
                Phần thô (Đang thi công)
              </span>
            </div>
            
            <div className="relative flex justify-between items-start pt-4 px-2 sm:px-4 overflow-x-auto pb-4 custom-scrollbar">
              <div className="absolute top-8 left-0 min-w-[600px] w-full h-0.5 bg-slate-100"></div>
              {TIMELINE_STEPS.map((step, idx) => (
                <div key={step.id} className="relative flex flex-col items-center min-w-[120px] flex-1">
                  <div className={`size-8 rounded-full flex items-center justify-center z-10 mb-2 transition-all ${
                    step.status === 'completed' ? 'bg-green-500 text-white' :
                    step.status === 'current' ? 'bg-primary text-white ring-4 ring-primary/20 scale-110' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {step.status === 'completed' ? 'check' : step.status === 'current' ? 'construction' : 'pending'}
                    </span>
                  </div>
                  <p className={`text-[11px] sm:text-xs font-bold text-center ${step.status === 'current' ? 'text-primary' : 'text-slate-900'}`}>
                    {step.label}
                  </p>
                  <p className={`text-[9px] sm:text-[10px] text-center ${step.status === 'current' ? 'text-primary font-medium' : 'text-slate-400'}`}>
                    {step.date === 'Hiện tại' ? `${step.progress}%` : step.date}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Daily Photos */}
          <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">photo_library</span>
                Ảnh hàng ngày
              </h3>
              <button className="text-primary text-xs sm:text-sm font-bold hover:underline">Tất cả</button>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {DAILY_PHOTOS.map((photo) => (
                <div key={photo.id} className="group relative rounded-lg overflow-hidden border border-slate-100 aspect-square sm:aspect-auto sm:h-48">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    src={photo.url} 
                    alt={photo.aiTag} 
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
                    <p className="text-white text-[10px] font-bold">{photo.timestamp}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`size-1.5 rounded-full ${photo.aiColor}`}></span>
                      <p className="text-white text-[9px] line-clamp-1">{photo.aiTag}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Cost Management */}
          <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              Quản lý chi phí
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold mb-1.5">
                  <span className="text-slate-500 uppercase">TIẾN ĐỘ NGÂN SÁCH</span>
                  <span className="text-primary">1.25B / 5.0B</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-primary h-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Gạch</p>
                  <p className="text-xs sm:text-sm font-black text-slate-800">45Mđ</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Cát/Đá</p>
                  <p className="text-xs sm:text-sm font-black text-slate-800">28.5Mđ</p>
                </div>
              </div>
              <button className="w-full py-2 bg-primary/5 text-primary text-xs font-bold rounded-lg hover:bg-primary/10 transition-colors">
                Xem chi tiết kê khai
              </button>
            </div>
          </section>

          {/* Lunar Calendar Rituals */}
          <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500">event_note</span>
              Lịch & Ngày Tốt
            </h3>
            <div className="space-y-3">
              <div className="flex gap-4 items-center p-3 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex flex-col items-center bg-white p-2 rounded-lg shadow-sm min-w-[50px]">
                  <span className="text-[10px] font-bold text-orange-600">THÁNG 5</span>
                  <span className="text-xl font-black text-slate-900">22</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">Lễ Cúng Đổ Trần T1</h4>
                  <p className="text-[10px] text-orange-700 font-medium">15/04 ÂL (Hoàng Đạo)</p>
                </div>
                <span className="material-symbols-outlined text-orange-300">notifications_active</span>
              </div>
            </div>
          </section>

          {/* Personnel */}
          <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">groups</span>
              Nhân sự
            </h3>
            <div className="space-y-4">
              {[
                { name: 'KTS. Minh Hải', role: 'Thiết kế chính', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhQMM1h1Zu9aymAj29vGlEHDuTuSHgt9bRXVt1bbtsSSDi0qrYLLI5S4w21hw2QvI8taCnZv4TXmqzp8F1-yKDxoFs22nFD3YkUOpR7NDcwdLJov2_K3D0t0xdF-LezOt2ynIi2brmySmBRa4iVIk1AjubjPa7apGFpDJZFtRtVakVc56BvkFF88jgZXG0mbnuwvkZrkVTD-uhgyxiEiPAOeuHgiuG3ioe38pu0t6wS4eLEA69JvBPOqmX0Oqk1NN-Z3f5ViwOHcA' },
                { name: 'Ông Hùng (Cai)', role: 'Thi công', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtUpWS7fJ2MAiC3tXFbatbwV6WV0-ZLB8h16abp26T9Y0ko2dV7zxJ8gyZZRQvzJflU4PY9HgsEsZy6GlkznC1zOuQKm-WXrERoWohgSai_W69UM5i5xkaAPWM_hJehaYhwb3X5NowWhmqzS0or-WZoVwxjXRrrEZ0ieJC0NKM6BvIz4uItp1KVr8RUqGNok-RDem-CnTr1TCvgbmirZoOB-lbqSniVQjqEu3XnQzwyLbu1hAYg8lJrGgkgv-LQqOx2-jl81Lit6I' }
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <img className="size-9 rounded-full object-cover" src={p.img} alt={p.name} loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{p.role}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-base">call</span>
                    </button>
                    <button className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-base">chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
