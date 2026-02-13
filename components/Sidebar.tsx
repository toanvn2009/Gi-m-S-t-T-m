
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onClose }) => {
  const navItems = [
    { id: ViewType.OVERVIEW, label: 'Tổng quan', icon: 'dashboard' },
    { id: ViewType.PROGRESS, label: 'Tiến độ', icon: 'timeline' },
    { id: ViewType.FINANCE, label: 'Chi phí', icon: 'payments' },
    { id: ViewType.CONTRACTORS, label: 'Nhà thầu', icon: 'engineering' },
    { id: ViewType.DOCUMENTS, label: 'Tài liệu', icon: 'description' },
  ];

  return (
    <aside className={`
      w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6 flex items-center justify-between lg:justify-start gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">home_work</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Tổ Ấm</h1>
            <p className="text-xs text-primary font-semibold uppercase tracking-wider">Nhà Phố Quận 2</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm sm:text-base ${
              currentView === item.id 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className={`material-symbols-outlined ${currentView === item.id ? 'fill' : ''}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-4">
        <div className="bg-primary/5 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Tiến độ</span>
            <span className="text-xs font-bold text-primary">35%</span>
          </div>
          <div className="w-full bg-primary/20 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: '35%' }}></div>
          </div>
        </div>
        <button 
          onClick={() => onViewChange(ViewType.SETTINGS)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
            currentView === ViewType.SETTINGS ? 'text-primary font-bold' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Cài đặt</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
