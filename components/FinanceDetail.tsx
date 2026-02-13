
import React from 'react';
import { FINANCE_DATA } from '../constants';

const FinanceDetail: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          { label: 'Ngân sách', value: '2.5Bđ', icon: 'account_balance', color: 'text-primary', bgColor: 'bg-primary/10', footer: 'Cập nhật: 05/10', footerColor: 'text-green-600' },
          { label: 'Đã chi (48%)', value: '1.2Bđ', icon: 'payments', color: 'text-red-500', bgColor: 'bg-red-50', progress: 48 },
          { label: 'Còn lại', value: '1.3Bđ', icon: 'savings', color: 'text-green-500', bgColor: 'bg-green-50', footer: 'Hoàn thành: T12', footerColor: 'text-slate-400', isAccent: true }
        ].map((card, i) => (
          <div key={i} className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-transform hover:translate-y-[-2px] ${i === 2 && 'sm:col-span-2 lg:col-span-1'}`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">{card.label}</p>
              <span className={`material-symbols-outlined text-lg sm:text-xl ${card.color} ${card.bgColor} p-2 rounded-lg`}>{card.icon}</span>
            </div>
            <p className={`text-xl sm:text-2xl font-black ${card.isAccent ? 'text-primary' : 'text-slate-900'}`}>{card.value}</p>
            {card.progress !== undefined ? (
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${card.progress}%` }}></div>
              </div>
            ) : (
              <p className={`text-[10px] font-bold mt-2 flex items-center gap-1 ${card.footerColor}`}>
                {card.footer}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Allocation Chart Sim */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold mb-6">Phân bổ chi phí</h3>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
            <div className="relative size-36 sm:size-48 flex items-center justify-center flex-shrink-0">
              <svg className="size-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#e7ebf3" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#144bb8" strokeDasharray="60 100" strokeDashoffset="25" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#4e6797" strokeDasharray="25 100" strokeDashoffset="65" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#8da2c9" strokeDasharray="15 100" strokeDashoffset="90" strokeWidth="4"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base sm:text-xl font-black">1.2B</span>
                <span className="text-[8px] sm:text-[10px] text-slate-500 uppercase font-bold">Tổng chi</span>
              </div>
            </div>
            <div className="flex-1 space-y-3 sm:space-y-4 w-full">
              {[
                { label: 'Vật tư', value: '60%', color: 'bg-primary' },
                { label: 'Nhân công', value: '25%', color: 'bg-slate-500' },
                { label: 'Thiết bị', value: '15%', color: 'bg-slate-300' }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`size-3 rounded-sm ${item.color}`}></div>
                    <span className="text-xs sm:text-sm font-medium truncate max-w-[120px]">{item.label}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold">{item.value}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-dashed border-slate-100 hidden sm:block">
                <p className="text-[10px] text-slate-500 italic">
                  * Biến động giá vật tư +5% so với dự tính.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vendors List - Compact for mobile */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-base sm:text-lg font-bold mb-4">Nhà cung cấp</h3>
          <div className="space-y-3 flex-1">
            {[
              { id: 'ST', name: 'Thép Hòa Phát', sub: 'Thép thô' },
              { id: 'VL', name: 'VLXD Hùng', sub: 'Cát, gạch' }
            ].map((v) => (
              <div key={v.id} className="p-2.5 border border-slate-100 rounded-lg flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 sm:size-9 rounded bg-white border border-slate-100 flex items-center justify-center text-primary font-bold shadow-xs text-xs">{v.id}</div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold truncate">{v.name}</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">{v.sub}</p>
                  </div>
                </div>
                <button className="p-1.5 text-primary hover:bg-blue-50 rounded-md">
                  <span className="material-symbols-outlined text-lg">call</span>
                </button>
              </div>
            ))}
          </div>
          <button className="w-full py-2 border border-dashed border-slate-300 text-[10px] font-bold text-slate-400 rounded-lg mt-4 uppercase tracking-wider">
            Danh bạ
          </button>
        </div>
      </div>

      {/* Invoice Table - Full width scroll */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
          <h3 className="text-base sm:text-lg font-bold">Hóa đơn gần đây</h3>
          <div className="flex items-center gap-2 w-full xs:w-auto">
            <div className="relative flex-1 xs:flex-none">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input 
                className="w-full xs:w-48 pl-8 pr-3 py-1.5 text-xs border-slate-200 rounded-lg focus:ring-primary focus:border-primary" 
                placeholder="Tìm..." 
                type="text"
              />
            </div>
            <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400">
              <span className="material-symbols-outlined text-lg">filter_list</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-4 sm:px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Ngày</th>
                <th className="px-4 sm:px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Vật tư</th>
                <th className="px-4 sm:px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Tổng cộng</th>
                <th className="px-4 sm:px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {FINANCE_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-4 sm:px-6 py-4 text-xs text-slate-500">{item.date}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 truncate max-w-[150px]">{item.name}</div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">{item.vendor}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-right font-black text-slate-900">{item.total.toLocaleString()}đ</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-wider ${
                      item.status === 'paid' ? 'bg-blue-100 text-primary' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status === 'paid' ? 'ĐÃ TRẢ' : 'CHỜ'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceDetail;
