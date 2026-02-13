
import React, { useState } from 'react';
import { ViewType } from './types';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import ProgressDetail from './components/ProgressDetail';
import FinanceDetail from './components/FinanceDetail';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.OVERVIEW);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false); // Close menu on selection
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewType.OVERVIEW:
        return <DashboardOverview />;
      case ViewType.PROGRESS:
        return <ProgressDetail />;
      case ViewType.FINANCE:
        return <FinanceDetail />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 p-4 text-center">
            <span className="material-symbols-outlined text-6xl mb-4">construction</span>
            <h2 className="text-xl font-bold">Màn hình "{currentView}" đang được xây dựng</h2>
            <button 
              onClick={() => handleViewChange(ViewType.OVERVIEW)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-bold"
            >
              Quay lại Tổng quan
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-[#0e121b] antialiased flex flex-col lg:flex-row">
      {/* Sidebar - Hidden on mobile unless toggled */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
      />
      
      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
      )}

      <main className="flex-1 w-full lg:ml-64 flex flex-col min-w-0">
        {/* Top Header Navigation */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="text-slate-400 text-xs sm:text-sm font-medium truncate max-w-[150px] sm:max-w-none">
              Dự án / Nhà Phố Q2 / <span className="text-primary font-bold uppercase tracking-tight">{currentView}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
              <span className="material-symbols-outlined text-xl sm:text-2xl">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">Minh Anh</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Chủ đầu tư</p>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 ring-2 ring-slate-100 flex-shrink-0">
                <img 
                  alt="User Avatar" 
                  src="https://picsum.photos/100/100?random=1" 
                  loading="lazy" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 pb-16">
          {/* Header Action Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {currentView === ViewType.OVERVIEW ? 'Giám sát Công trình' : 
                 currentView === ViewType.PROGRESS ? 'Theo dõi Tiến độ' : 'Quản lý Ngân sách'}
              </h2>
              <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-sm">location_on</span>
                Khu dân cư An Phú, Quận 2, TP. Thủ Đức
              </p>
            </div>
            
            <div className="flex gap-2 sm:gap-3">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-slate-200 rounded-lg font-bold text-xs sm:text-sm hover:bg-slate-50 transition-all shadow-sm">
                <span className="material-symbols-outlined text-lg">file_download</span>
                <span className="hidden xs:inline">Báo cáo</span>
                <span className="xs:hidden">Xuất</span>
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
                Cập nhật
              </button>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
