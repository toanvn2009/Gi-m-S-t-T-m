
import React, { useState, useEffect } from 'react';
import { ViewType } from './types';
import { useStore } from './store/useStore';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import ProgressDetail from './components/ProgressDetail';
import FinanceDetail from './components/FinanceDetail';
import ContractorsPage from './components/ContractorsPage';
import DocumentsPage from './components/DocumentsPage';
import SettingsPage from './components/SettingsPage';
import IssuesPage from './components/IssuesPage';
import ToastContainer from './components/Toast';
import UpdateProjectModal from './components/UpdateProjectModal';
import { exportProjectData } from './services/exportService';
import AIChatWidget from './components/AIChatWidget';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const currentView = useStore((s) => s.currentView);
  const isMobileMenuOpen = useStore((s) => s.isMobileMenuOpen);
  const setCurrentView = useStore((s) => s.setCurrentView);
  const toggleMobileMenu = useStore((s) => s.toggleMobileMenu);
  const closeMobileMenu = useStore((s) => s.closeMobileMenu);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const project = useStore((s) => s.project);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Initialize dark mode on mount
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleExport = () => {
    exportProjectData(useStore.getState());
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewType.OVERVIEW:
        return <DashboardOverview />;
      case ViewType.PROGRESS:
        return <ProgressDetail />;
      case ViewType.FINANCE:
        return <FinanceDetail />;
      case ViewType.CONTRACTORS:
        return <ContractorsPage />;
      case ViewType.DOCUMENTS:
        return <DocumentsPage />;
      case ViewType.ISSUES:
        return <IssuesPage />;
      case ViewType.SETTINGS:
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen antialiased flex flex-col lg:flex-row transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#f6f6f8] text-[#0e121b]'}`}>
        {/* Toast Notifications */}
        <ToastContainer />

        {/* AI Chat Widget */}
        <AIChatWidget />

        {/* Update Modal */}
        <UpdateProjectModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        />

        {/* Sidebar */}
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
            onClick={closeMobileMenu}
          />
        )}

        <main className="flex-1 w-full lg:ml-64 flex flex-col min-w-0">
          {/* Top Header Navigation */}
          <header className={`h-16 border-b flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 backdrop-blur-md transition-colors ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-white/80'}`}>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="text-slate-400 text-xs sm:text-sm font-medium truncate max-w-[150px] sm:max-w-none">
                Dự án / {project.name} / <span className="text-primary font-bold uppercase tracking-tight">{currentView}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'text-amber-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}
                title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
              >
                <span className="material-symbols-outlined text-xl">{darkMode ? 'light_mode' : 'dark_mode'}</span>
              </button>
              <button className={`p-2 rounded-full transition-colors relative ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}>
                <span className="material-symbols-outlined text-xl sm:text-2xl">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold leading-none">{project.owner}</p>
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
                    currentView === ViewType.PROGRESS ? 'Theo dõi Tiến độ' :
                      currentView === ViewType.FINANCE ? 'Quản lý Ngân sách' :
                        currentView === ViewType.CONTRACTORS ? 'Nhà thầu' :
                          currentView === ViewType.DOCUMENTS ? 'Tài liệu' :
                            currentView === ViewType.ISSUES ? 'Checklist lỗi' :
                              currentView === ViewType.SETTINGS ? 'Cài đặt' : 'Giám sát Công trình'}
                </h2>
                <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {project.location}
                </p>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleExport}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-slate-200 rounded-lg font-bold text-xs sm:text-sm hover:bg-slate-50 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">file_download</span>
                  <span className="hidden xs:inline">Báo cáo</span>
                  <span className="xs:hidden">Xuất</span>
                </button>
                <button
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
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
    </ErrorBoundary>
  );
};

export default App;
