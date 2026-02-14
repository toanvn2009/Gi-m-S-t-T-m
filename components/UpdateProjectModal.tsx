import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import FileUpload from './FileUpload';
import { ViewType } from '../types';
import { formatToISODate, formatToDisplayDate } from '../utils/dateHelpers';

interface UpdateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'timeline' | 'photo' | 'finance';

const UpdateProjectModal: React.FC<UpdateProjectModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<Tab>('timeline');
    const [loading, setLoading] = useState(false);

    // Store actions
    const addTimelineStep = useStore(s => s.addTimelineStep);
    const updateTimelineStep = useStore(s => s.updateTimelineStep);
    const timelineSteps = useStore(s => s.timelineSteps);
    const addPhoto = useStore(s => s.addPhoto);
    const addFinanceItem = useStore(s => s.addFinanceItem);
    const addNotification = useStore(s => s.addNotification);

    // Form states
    const [timelineData, setTimelineData] = useState({ stepId: '', date: '', status: 'pending' });
    const [photoData, setPhotoData] = useState({ base64: '', tag: '', phase: '' });
    const [financeData, setFinanceData] = useState({ name: '', amount: '', vendor: '' });

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (activeTab === 'timeline') {
                if (!timelineData.stepId || !timelineData.date) throw new Error('Vui lòng chọn giai đoạn và ngày');

                updateTimelineStep(timelineData.stepId, {
                    date: timelineData.date,
                    status: timelineData.status as any
                });

                const stepName = timelineSteps.find(s => s.id === timelineData.stepId)?.label || '';
                addNotification({ type: 'success', title: `Đã cập nhật: ${stepName}` });
            }
            else if (activeTab === 'photo') {
                if (!photoData.base64) throw new Error('Vui lòng chọn ảnh');

                addPhoto({
                    id: Date.now().toString(),
                    url: photoData.base64,
                    timestamp: new Date().toLocaleString('vi-VN'),
                    aiTag: photoData.tag || 'Chưa phân tích',
                    aiColor: 'bg-slate-400',
                    phase: photoData.phase || undefined
                });

                const phaseLabel = photoData.phase ? ` (${photoData.phase})` : '';
                addNotification({ type: 'success', title: `Đã tải ảnh lên${phaseLabel}` });
            }
            else if (activeTab === 'finance') {
                if (!financeData.name || !financeData.amount) throw new Error('Vui lòng nhập tên và số tiền');

                addFinanceItem({
                    id: Date.now().toString(),
                    date: new Date().toLocaleDateString('vi-VN'),
                    name: financeData.name,
                    vendor: financeData.vendor || 'Khác',
                    quantity: '1',
                    unitPrice: Number(financeData.amount),
                    total: Number(financeData.amount),
                    status: 'pending'
                });

                addNotification({ type: 'success', title: 'Đã thêm khoản chi phí mới' });
            }

            onClose();
        } catch (err: any) {
            addNotification({ type: 'error', title: 'Lỗi', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900">Cập nhật dự án</h3>
                    <button onClick={onClose} className="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-slate-500">close</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    {[
                        { id: 'timeline', label: 'Tiến độ', icon: 'route' },
                        { id: 'photo', label: 'Hình ảnh', icon: 'photo_camera' },
                        { id: 'finance', label: 'Chi phí', icon: 'attach_money' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === tab.id ? 'text-primary bg-primary/5' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'timeline' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Chọn giai đoạn</label>
                                <select
                                    value={timelineData.stepId}
                                    onChange={e => {
                                        const step = timelineSteps.find(s => s.id === e.target.value);
                                        setTimelineData({
                                            stepId: e.target.value,
                                            date: step?.date || '',
                                            status: step?.status || 'pending'
                                        });
                                    }}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                >
                                    <option value="">-- Chọn từ Lộ trình thi công --</option>
                                    {timelineSteps.map(step => (
                                        <option key={step.id} value={step.id}>
                                            {step.label} ({step.status === 'completed' ? '✅ Xong' : step.status === 'current' ? '🛠️ Đang làm' : '⏳ Chờ'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Thời gian</label>
                                    <input
                                        type="date"
                                        value={formatToISODate(timelineData.date)}
                                        onChange={e => setTimelineData({ ...timelineData, date: formatToDisplayDate(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Trạng thái</label>
                                    <select
                                        value={timelineData.status}
                                        onChange={e => setTimelineData({ ...timelineData, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    >
                                        <option value="pending">Sắp tới</option>
                                        <option value="current">Đang làm</option>
                                        <option value="completed">Đã xong</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'photo' && (
                        <div className="space-y-4">
                            {/* Phase selection */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Giai đoạn thi công *</label>
                                <select
                                    value={photoData.phase}
                                    onChange={e => setPhotoData({ ...photoData, phase: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                >
                                    <option value="">-- Chọn giai đoạn --</option>
                                    {timelineSteps.map(step => (
                                        <option key={step.id} value={step.label}>{step.label}</option>
                                    ))}
                                </select>
                            </div>
                            <FileUpload
                                onFileSelect={(base64, file) => setPhotoData({ ...photoData, base64 })}
                                maxSizeMB={5}
                            />
                            {photoData.base64 && (
                                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 h-32 flex items-center justify-center">
                                    <img src={photoData.base64} alt="Preview" className="h-full object-contain" />
                                    <button
                                        onClick={() => setPhotoData({ ...photoData, base64: '' })}
                                        className="absolute top-2 right-2 size-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Ghi chú (tùy chọn)</label>
                                <input
                                    type="text"
                                    value={photoData.tag}
                                    onChange={e => setPhotoData({ ...photoData, tag: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="VD: Chụp tại công trường buổi sáng"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'finance' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Tên khoản chi</label>
                                <input
                                    type="text"
                                    value={financeData.name}
                                    onChange={e => setFinanceData({ ...financeData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="VD: Mua xi măng"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Số tiền (VNĐ)</label>
                                    <input
                                        type="number"
                                        value={financeData.amount}
                                        onChange={e => setFinanceData({ ...financeData, amount: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="VD: 5000000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Nhà cung cấp</label>
                                    <input
                                        type="text"
                                        value={financeData.vendor}
                                        onChange={e => setFinanceData({ ...financeData, vendor: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="VD: Đại lý Hùng"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProjectModal;
