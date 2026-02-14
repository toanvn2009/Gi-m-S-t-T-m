
import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { analyzeConstructionImage } from '../services/geminiService';
import { importProjectData } from '../services/exportService';
import { ViewType, DailyPhoto } from '../types';
import RiskAlerts from './RiskAlerts';

const DashboardOverview: React.FC = () => {
  // Use Zustand store instead of constants
  const timelineSteps = useStore(s => s.timelineSteps);
  const dailyPhotos = useStore(s => s.dailyPhotos);
  const financeItems = useStore(s => s.financeItems);
  const project = useStore(s => s.project);
  const updatePhoto = useStore(s => s.updatePhoto);
  const importData = useStore(s => s.importData); // Import action

  const addNotification = useStore(s => s.addNotification);
  const addAILog = useStore(s => s.addAILog);

  // Local state for AI analysis
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // Photo modal states
  const [viewingPhoto, setViewingPhoto] = useState<DailyPhoto | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<DailyPhoto | null>(null);
  const [editForm, setEditForm] = useState<{ phase: string; tag: string }>({ phase: '', tag: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed data
  const currentStep = timelineSteps.find(s => s.status === 'current');
  const spentBudget = financeItems.reduce((sum, item) => sum + item.total, 0);
  const totalBudget = project.budget;
  const spentPercentage = Math.round((spentBudget / totalBudget) * 100);

  const materialCost = financeItems
    .filter(i => i.name.toLowerCase().includes('gạch') || i.name.toLowerCase().includes('ngói') || i.name.toLowerCase().includes('xi măng'))
    .reduce((sum, i) => sum + i.total, 0);

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(0)}M`;
    return `${(val / 1000).toFixed(0)}k`;
  };

  const handleAnalyzePhoto = async (photoId: string, url: string) => {
    setAnalyzingId(photoId);
    try {
      // Check if base64 (uploaded) or URL (demo)
      let imageData = url;
      if (url.startsWith('https://')) {
        // For demo URLs, we can't analyze directly due to CORS/Proxy usually
        // But in this specific setup we might be able to fetch if allowed
        // For now, let's mock it for demo URLs to avoid breaking
        addNotification({ type: 'warning', title: 'Demo', message: 'Chỉ hỗ trợ phân tích ảnh tải lên (Base64)' });
        setAnalyzingId(null);
        return;
      }

      // Base64 handling
      // Clean prefix data:image/jpeg;base64,
      const base64Clean = imageData.split(',')[1];

      const analysis = await analyzeConstructionImage(base64Clean);

      addAILog({
        id: Date.now().toString(),
        type: 'analysis',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        content: analysis
      });

      addNotification({ type: 'success', title: 'Phân tích hoàn tất', message: 'Đã cập nhật nhật ký AI' });
    } catch (error) {
      console.error(error);
      addNotification({ type: 'error', title: 'Lỗi phân tích', message: 'Không thể phân tích ảnh này' });
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleEditPhoto = (photo: DailyPhoto) => {
    setEditingPhoto(photo);
    setEditForm({
      phase: photo.phase || currentStep?.label || '',
      tag: photo.aiTag
    });
  };

  const handleSavePhotoEdit = () => {
    if (editingPhoto) {
      updatePhoto(editingPhoto.id, {
        phase: editForm.phase,
        aiTag: editForm.tag
      });
      addNotification({ type: 'success', title: 'Đã cập nhật', message: 'Thông tin ảnh đã được lưu.' });
      setEditingPhoto(null);
    }
  };

  const handleImportClick = () => {
    if (confirm('CẢNH BÁO: Nhập dữ liệu mới sẽ thay thế toàn bộ dữ liệu hiện tại. Bạn có chắc chắn muốn tiếp tục?')) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importProjectData(file);
      importData(data);
      addNotification({ type: 'success', title: 'Nhập dữ liệu thành công', message: 'Dữ liệu dự án đã được khôi phục.' });
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      addNotification({ type: 'error', title: 'Lỗi nhập dữ liệu', message: (error as Error).message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

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
                {currentStep?.label || 'Chưa bắt đầu'}
              </span>
            </div>

            <div className="relative">
              {/* Step counter */}
              <div className="flex items-center gap-2 mb-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="text-green-500">{timelineSteps.filter(s => s.status === 'completed').length} xong</span>
                <span>•</span>
                <span className="text-primary">{timelineSteps.filter(s => s.status === 'current').length} đang làm</span>
                <span>•</span>
                <span>{timelineSteps.filter(s => s.status === 'pending').length} chờ</span>
                <span className="ml-auto text-slate-300">Tổng: {timelineSteps.length} bước</span>
              </div>

              {/* Timeline grid - wraps neatly */}
              <div className={`grid gap-2 ${timelineSteps.length <= 5 ? 'grid-cols-5' :
                timelineSteps.length <= 8 ? 'grid-cols-4 sm:grid-cols-8' :
                  'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8'
                }`}>
                {timelineSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`relative flex flex-col items-center p-2 rounded-xl transition-all cursor-default group ${step.status === 'completed' ? 'bg-green-50 border border-green-200' :
                      step.status === 'current' ? 'bg-primary/5 border-2 border-primary shadow-sm' :
                        'bg-slate-50 border border-slate-100'
                      }`}
                    title={`${step.label}\n${step.date}${step.contractor ? `\nNhà thầu: ${step.contractor}` : ''}`}
                  >
                    {/* Step number + icon */}
                    <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${step.status === 'completed' ? 'bg-green-500 text-white' :
                      step.status === 'current' ? 'bg-primary text-white ring-2 ring-primary/20' :
                        'bg-slate-200 text-slate-400'
                      }`}>
                      {step.status === 'completed' ? (
                        <span className="material-symbols-outlined text-sm">check</span>
                      ) : step.status === 'current' ? (
                        <span className="material-symbols-outlined text-sm">construction</span>
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    {/* Label */}
                    <p className={`text-[10px] font-bold text-center leading-tight line-clamp-2 ${step.status === 'current' ? 'text-primary' : step.status === 'completed' ? 'text-green-700' : 'text-slate-500'
                      }`}>
                      {step.label}
                    </p>

                    {/* Date */}
                    <p className={`text-[8px] mt-0.5 text-center ${step.status === 'current' ? 'text-primary/70 font-medium' : 'text-slate-400'
                      }`}>
                      {step.date === 'Hiện tại' ? `${step.progress || 0}%` : step.date}
                    </p>

                    {/* Progress bar for current step */}
                    {step.status === 'current' && step.progress != null && (
                      <div className="w-full bg-primary/10 rounded-full h-1 mt-1.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${step.progress}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Daily Photos - Grouped by Phase */}
          <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">photo_library</span>
                Ảnh công trường
              </h3>
              <span className="text-xs font-bold text-slate-400">Tổng: {dailyPhotos.length} ảnh</span>
            </div>

            {dailyPhotos.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-lg">
                Chưa có ảnh nào. <br /> Nhấn "Cập nhật" để tải ảnh lên.
              </div>
            ) : (
              <div className="space-y-5">
                {/* Group photos by phase */}
                {(() => {
                  const grouped: Record<string, typeof dailyPhotos> = {};
                  dailyPhotos.forEach(p => {
                    const key = p.phase || 'Chưa phân loại';
                    if (!grouped[key]) grouped[key] = [];
                    grouped[key].push(p);
                  });

                  return Object.entries(grouped).map(([phase, photos]) => (
                    <div key={phase}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-sm text-primary">folder</span>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{phase}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">({photos.length} ảnh)</span>
                      </div>
                      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
                        {photos.map((photo) => (
                          <div key={photo.id} className="group relative rounded-lg overflow-hidden border border-slate-100 aspect-square">
                            <img
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              src={photo.url}
                              alt={photo.aiTag}
                              loading="lazy"
                            />
                            {/* Click to view - Low z-index */}
                            <button
                              className="absolute inset-0 w-full h-full cursor-zoom-in z-10"
                              onClick={() => setViewingPhoto(photo)}
                            ></button>

                            {/* Info Gradient - Medium z-index */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 z-20 pointer-events-none">
                              <p className="text-white text-[9px] font-bold">{photo.timestamp}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className={`size-1.5 rounded-full ${photo.aiColor}`}></span>
                                <p className="text-white text-[8px] line-clamp-1">{photo.aiTag}</p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-1.5 right-1.5 flex gap-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPhoto(photo);
                                }}
                                className="p-1.5 bg-white/90 text-slate-700 rounded-full shadow-sm hover:bg-white hover:text-primary transition-colors"
                                title="Sửa thông tin"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAnalyzePhoto(photo.id, photo.url);
                                }}
                                className="p-1.5 bg-white/90 text-slate-700 rounded-full shadow-sm hover:bg-white hover:text-primary transition-colors"
                                title="AI Phân tích lại"
                              >
                                <span className="material-symbols-outlined text-sm shrink-0">smart_toy</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
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
                  <span className="text-primary">{formatCurrency(spentBudget)}đ / {formatCurrency(totalBudget)}đ</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full ${spentPercentage > 100 ? 'bg-red-500' : 'bg-primary'}`}
                    style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Vật liệu</p>
                  <p className="text-xs sm:text-sm font-black text-slate-800">{formatCurrency(materialCost)}đ</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Còn lại</p>
                  <p className="text-xs sm:text-sm font-black text-green-600">{formatCurrency(totalBudget - spentBudget)}đ</p>
                </div>
              </div>
              <button
                className="w-full py-2 bg-primary/5 text-primary text-xs font-bold rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => useStore.getState().setCurrentView(ViewType.FINANCE)}
              >
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
                  <div className="flex gap-2">
                    <button
                      onClick={handleImportClick}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition shadow-sm"
                      title="Nhập dữ liệu từ file JSON"
                    >
                      <span className="material-symbols-outlined text-sm">upload</span>
                      Nhập
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition shadow-sm">
                      <span className="material-symbols-outlined text-sm">download</span>
                      Xuất
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition shadow-sm shadow-primary/30">
                      <span className="material-symbols-outlined text-base">chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Risk Alerts Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <RiskAlerts />
      </div>

      {/* === PHOTO VIEWER MODAL === */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setViewingPhoto(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2" onClick={() => setViewingPhoto(null)}>
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img src={viewingPhoto.url} alt="Full view" className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
            <div className="mt-4 text-center text-white">
              <p className="text-lg font-bold">{viewingPhoto.phase || 'Chưa phân loại'}</p>
              <p className="text-sm opacity-80">{viewingPhoto.timestamp} • {viewingPhoto.aiTag}</p>
            </div>
          </div>
        </div>
      )}

      {/* === EDIT PHOTO MODAL === */}
      {editingPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingPhoto(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Sửa thông tin ảnh</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Giai đoạn</label>
                <select
                  value={editForm.phase}
                  onChange={(e) => setEditForm({ ...editForm, phase: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">-- Chọn giai đoạn --</option>
                  {timelineSteps.map(step => (
                    <option key={step.id} value={step.label}>{step.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Mô tả / Tag</label>
                <input
                  type="text"
                  value={editForm.tag}
                  onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingPhoto(null)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleSavePhotoEdit}
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
