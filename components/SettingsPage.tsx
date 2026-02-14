
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatToISODate, formatToDisplayDate } from '../utils/dateHelpers';

const SettingsPage: React.FC = () => {
    const { project, updateProject, addNotification } = useStore();
    const [form, setForm] = useState({
        name: project.name,
        location: project.location,
        owner: project.owner,
        budget: project.budget,
        startDate: project.startDate,
    });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        updateProject({
            name: form.name,
            location: form.location,
            owner: form.owner,
            budget: form.budget,
            startDate: form.startDate,
        });
        addNotification({ type: 'success', title: 'Đã lưu cài đặt' });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleClearData = () => {
        if (confirm('Xóa TẤT CẢ dữ liệu đã lưu? Hành động không thể hoàn tác!')) {
            localStorage.removeItem('giam-sat-to-am-storage');
            addNotification({ type: 'warning', title: 'Đã xóa dữ liệu. Trang sẽ tải lại sau 1 giây.' });
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Project Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                    <h3 className="text-base font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">home_work</span>
                        Thông tin dự án
                    </h3>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Tên công trình</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Địa chỉ</label>
                        <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-600 mb-1 block">Chủ đầu tư</label>
                            <input type="text" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-600 mb-1 block">Ngày khởi công</label>
                            <input
                                type="date"
                                value={formatToISODate(form.startDate)}
                                onChange={(e) => setForm({ ...form, startDate: formatToDisplayDate(e.target.value) })}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Ngân sách (đ)</label>
                        <input
                            type="number" value={form.budget}
                            onChange={(e) => setForm({ ...form, budget: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">{form.budget.toLocaleString()}đ</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className={`w-full py-2.5 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${saved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">{saved ? 'check' : 'save'}</span>
                        {saved ? 'Đã lưu!' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>

            {/* App Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                    <h3 className="text-base font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">info</span>
                        Thông tin ứng dụng
                    </h3>
                </div>
                <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-slate-600">Phiên bản</span>
                        <span className="text-sm font-bold">1.0.0</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-slate-600">Dữ liệu lưu trữ</span>
                        <span className="text-sm font-bold">localStorage</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-slate-600">AI Provider</span>
                        <span className="text-sm font-bold">Google Gemini</span>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-red-100">
                    <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">warning</span>
                        Khu vực nguy hiểm
                    </h3>
                </div>
                <div className="p-5">
                    <p className="text-xs text-slate-500 mb-3">Xóa toàn bộ dữ liệu đã lưu trong localStorage. Hành động này không thể hoàn tác.</p>
                    <button
                        onClick={handleClearData}
                        className="px-4 py-2 text-sm font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-base">delete_forever</span>
                        Xóa toàn bộ dữ liệu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
