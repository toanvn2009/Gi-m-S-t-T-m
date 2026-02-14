
import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { TimelineStep } from '../types';
import { chatWithAI } from '../services/geminiService';
import { formatToISODate, formatToDisplayDate } from '../utils/dateHelpers';

// === TYPES ===

interface StepFormData {
  label: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
  progress?: number;
  contractor?: string;
  estimate?: string;
}

const emptyForm: StepFormData = {
  label: '', date: '', status: 'pending', progress: 0, contractor: '', estimate: '',
};

// === MAIN COMPONENT ===

const ProgressDetail: React.FC = () => {
  const {
    timelineSteps, aiLogs, project,
    addTimelineStep, updateTimelineStep, deleteTimelineStep,
    addAILog, addNotification,
  } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StepFormData>(emptyForm);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // === DYNAMIC CALCULATIONS ===

  const stats = useMemo(() => {
    const total = timelineSteps.length;
    const completed = timelineSteps.filter(s => s.status === 'completed').length;
    const currentStep = timelineSteps.find(s => s.status === 'current');
    const currentProgress = currentStep?.progress || 0;

    // Overall: completed steps + fraction of current step
    const overallProgress = total > 0
      ? Math.round(((completed + currentProgress / 100) / total) * 100)
      : 0;

    // Estimate remaining days
    const pendingCount = timelineSteps.filter(s => s.status !== 'completed').length;
    const remainingDays = pendingCount * 14; // ~2 weeks per step estimate

    // Check on-track: if current step has progress > 50%, we're on track
    const isOnTrack = !currentStep || currentProgress >= 30;

    return { total, completed, overallProgress, remainingDays, currentProgress, isOnTrack };
  }, [timelineSteps]);

  // === HANDLERS ===

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (step: TimelineStep) => {
    setEditingId(step.id);
    setForm({
      label: step.label,
      date: step.date,
      status: step.status,
      progress: step.progress || 0,
      contractor: step.contractor || '',
      estimate: step.estimate || '',
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.label.trim()) {
      addNotification({ type: 'warning', title: 'Vui lòng nhập tên bước' });
      return;
    }

    if (editingId) {
      updateTimelineStep(editingId, {
        label: form.label,
        date: form.date,
        status: form.status,
        progress: form.status === 'current' ? (form.progress || 0) : undefined,
        contractor: form.contractor,
        estimate: form.estimate,
      });
      addNotification({ type: 'success', title: `Đã cập nhật: ${form.label}` });
    } else {
      addTimelineStep({
        id: `step-${Date.now()}`,
        label: form.label,
        date: form.date || 'Chưa xác định',
        status: form.status,
        progress: form.status === 'current' ? (form.progress || 0) : undefined,
        contractor: form.contractor,
        estimate: form.estimate,
      });
      addNotification({ type: 'success', title: `Đã thêm: ${form.label}` });
    }
    setShowModal(false);
  };

  const handleDelete = (step: TimelineStep) => {
    if (confirm(`Xóa bước "${step.label}"?`)) {
      deleteTimelineStep(step.id);
      addNotification({ type: 'info', title: `Đã xóa: ${step.label}` });
    }
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Phân tích tiến độ dự án xây dựng "${project.name}":
- Tổng ${stats.total} bước, đã hoàn thành ${stats.completed}/${stats.total}
- Tiến độ tổng: ${stats.overallProgress}%
- Các bước: ${timelineSteps.map(s => `${s.label} (${s.status})`).join(', ')}
Hãy đưa ra nhận xét ngắn gọn về tiến độ, cảnh báo nếu có rủi ro chậm tiến độ, và gợi ý bước tiếp theo.`;

      const result = await chatWithAI(prompt);
      addAILog({
        id: `ai-${Date.now()}`,
        type: 'Phân tích tiến độ',
        time: new Date().toLocaleString('vi-VN'),
        content: result || 'Không nhận được phản hồi từ AI.',
      });
      addNotification({ type: 'success', title: 'AI đã phân tích tiến độ' });
    } catch {
      addNotification({ type: 'error', title: 'Lỗi kết nối AI. Kiểm tra API key.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // === PROGRESS CIRCLE SVG ===

  const progressCircle = (size: 'sm' | 'lg') => {
    const r = size === 'sm' ? 42 : 58;
    const cx = size === 'sm' ? 48 : 64;
    const sw = size === 'sm' ? 8 : 10;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (stats.overallProgress / 100) * circumference;
    return (
      <circle
        className={`text-primary rounded-full transition-all duration-1000 ${size === 'sm' ? 'sm:hidden' : 'hidden sm:block'}`}
        cx={cx} cy={cx} r={r}
        fill="transparent" stroke="currentColor" strokeWidth={sw}
        strokeDasharray={circumference.toFixed(2)}
        strokeDashoffset={offset.toFixed(2)}
        strokeLinecap="round"
      />
    );
  };

  // === RENDER ===

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Summary Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-6 gap-2">
            <h3 className="text-base sm:text-lg font-bold">Tổng quan dự án</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90">
                <circle className="text-slate-100 sm:hidden" cx="48" cy="48" r="42" fill="transparent" stroke="currentColor" strokeWidth="8" />
                <circle className="text-slate-100 hidden sm:block" cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="10" />
                {progressCircle('sm')}
                {progressCircle('lg')}
              </svg>
              <span className="absolute text-xl sm:text-2xl font-black">{stats.overallProgress}%</span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4 w-full">
              {[
                { label: 'HOÀN THÀNH', value: `${stats.completed}/${stats.total}` },
                { label: 'CÒN LẠI', value: `~${stats.remainingDays} Ngày` },
                { label: 'HẠNG MỤC', value: `${stats.total} Bước` },
                { label: 'TRẠNG THÁI', value: stats.isOnTrack ? 'Đúng hạn' : 'Chậm tiến độ', isStatus: true },
              ].map((stat) => (
                <div key={stat.label} className="p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-500 font-bold mb-0.5">{stat.label}</p>
                  {stat.isStatus ? (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${stats.isOnTrack ? 'bg-green-500' : 'bg-orange-500'}`} />
                      <span className={`text-xs sm:text-sm font-bold truncate ${stats.isOnTrack ? 'text-green-600' : 'text-orange-600'}`}>{stat.value}</span>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary fill text-lg sm:text-xl">auto_awesome</span>
              <h3 className="text-base sm:text-lg font-bold text-primary">Nhật ký AI</h3>
            </div>
            <button
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-[10px] sm:text-xs font-bold rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-sm ${isAnalyzing ? 'animate-spin' : ''}`}>
                {isAnalyzing ? 'progress_activity' : 'psychology'}
              </span>
              {isAnalyzing ? 'Đang phân tích...' : 'Phân tích AI'}
            </button>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
            {aiLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
                <span className="material-symbols-outlined text-3xl mb-2">smart_toy</span>
                <p className="text-xs text-center">Chưa có dữ liệu AI.<br />Nhấn "Phân tích AI" để bắt đầu.</p>
              </div>
            ) : (
              aiLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="bg-white/80 p-3 rounded-lg border border-primary/10 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-black text-primary/60 uppercase">{log.type}</span>
                    <span className="text-[9px] text-slate-400">{log.time}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic line-clamp-3">"{log.content}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Itemized Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold">Lộ trình chi tiết</h3>
          <button
            onClick={openAdd}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Thêm bước
          </button>
        </div>
        <div className="p-4 sm:p-6">
          {timelineSteps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">timeline</span>
              <p className="text-sm">Chưa có bước nào. Nhấn "Thêm bước" để tạo.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {timelineSteps.map((step, idx) => (
                <div key={step.id} className="relative pl-8 sm:pl-10 pb-6 sm:pb-8 group last:pb-0">
                  {idx !== timelineSteps.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-100 group-last:hidden" />
                  )}

                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-white ring-4 ring-white z-10 shadow-sm ${step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'current' ? 'bg-primary ring-primary/20 scale-110 shadow-lg' :
                      'bg-slate-200 text-slate-400'
                    }`}>
                    <span className="material-symbols-outlined text-[10px] sm:text-sm font-bold">
                      {step.status === 'completed' ? 'check' : step.status === 'current' ? 'sync' : 'hourglass_top'}
                    </span>
                  </div>

                  <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all p-3 sm:p-4 rounded-xl ${step.status === 'current' ? 'bg-primary/5 border border-primary/10 shadow-sm shadow-primary/5' : ''
                    }`}>
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-sm sm:text-base font-bold truncate ${step.status === 'current' ? 'text-primary' : step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>
                        {step.label}
                      </h4>
                      <p className={`text-[11px] sm:text-sm mt-1 truncate ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-500'}`}>
                        {step.contractor || 'Cần xác định'} • {step.date}
                      </p>
                      {step.status === 'current' && (
                        <div className="mt-3 max-w-[200px]">
                          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                            <span>Tiến độ</span>
                            <span className="font-bold text-primary">{step.progress || 0}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${step.progress || 0}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-1 text-[9px] sm:text-xs font-bold rounded-full w-max ${step.status === 'completed' ? 'bg-green-100 text-green-700' :
                        step.status === 'current' ? 'bg-primary text-white' :
                          'bg-slate-100 text-slate-400'
                        }`}>
                        {step.status === 'completed' ? 'HOÀN THÀNH' : step.status === 'current' ? 'ĐANG LÀM' : 'SẮP TỚI'}
                      </span>

                      {/* CRUD Buttons */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(step)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-primary transition"
                          title="Sửa"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(step)}
                          className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition"
                          title="Xóa"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* === ADD/EDIT MODAL === */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingId ? 'Sửa bước' : 'Thêm bước mới'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Label */}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Tên bước *</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="VD: Đổ sàn tầng 3"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                />
              </div>

              {/* Date + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Ngày</label>
                  <input
                    type="date"
                    value={formatToISODate(form.date)}
                    onChange={(e) => setForm({ ...form, date: formatToDisplayDate(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as StepFormData['status'] })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white"
                  >
                    <option value="pending">Sắp tới</option>
                    <option value="current">Đang làm</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </div>
              </div>

              {/* Progress (only for current) */}
              {form.status === 'current' && (
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Tiến độ: {form.progress || 0}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.progress || 0}
                    onChange={(e) => setForm({ ...form, progress: parseInt(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>
              )}

              {/* Contractor + Estimate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Nhà thầu</label>
                  <input
                    type="text"
                    value={form.contractor}
                    onChange={(e) => setForm({ ...form, contractor: e.target.value })}
                    placeholder="VD: Cty Xây dựng ABC"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Dự toán</label>
                  <input
                    type="text"
                    value={form.estimate}
                    onChange={(e) => setForm({ ...form, estimate: e.target.value })}
                    placeholder="VD: 120 triệu"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 border-t border-slate-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">{editingId ? 'save' : 'add'}</span>
                {editingId ? 'Lưu thay đổi' : 'Thêm bước'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressDetail;
