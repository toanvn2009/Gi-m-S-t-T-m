
import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Issue } from '../types';
import FileUpload from './FileUpload';
import { formatToDisplayDate } from '../utils/dateHelpers';

// === TYPES ===

interface IssueFormData {
    title: string;
    description: string;
    location: string;
    priority: 'high' | 'medium' | 'low';
    status: 'open' | 'in_progress' | 'resolved';
    assignee: string;
    photoUrl: string;
}

const emptyForm: IssueFormData = {
    title: '', description: '', location: '', priority: 'medium',
    status: 'open', assignee: '', photoUrl: '',
};

// === MAIN COMPONENT ===

const IssuesPage: React.FC = () => {
    const { issues, contractors, addIssue, updateIssue, deleteIssue, addNotification } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<IssueFormData>(emptyForm);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');

    // === COMPUTED ===

    const stats = useMemo(() => ({
        total: issues.length,
        open: issues.filter(i => i.status === 'open').length,
        inProgress: issues.filter(i => i.status === 'in_progress').length,
        resolved: issues.filter(i => i.status === 'resolved').length,
        highPriority: issues.filter(i => i.priority === 'high' && i.status !== 'resolved').length,
    }), [issues]);

    const filtered = useMemo(() => {
        let items = [...issues];
        if (filterStatus !== 'all') items = items.filter(i => i.status === filterStatus);
        if (filterPriority !== 'all') items = items.filter(i => i.priority === filterPriority);
        return items;
    }, [issues, filterStatus, filterPriority]);

    // === HANDLERS ===

    const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };

    const openEdit = (issue: Issue) => {
        setEditingId(issue.id);
        setForm({
            title: issue.title,
            description: issue.description || '',
            location: issue.location,
            priority: issue.priority,
            status: issue.status,
            assignee: issue.assignee || '',
            photoUrl: issue.photoUrl || '',
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!form.title.trim()) {
            addNotification({ type: 'warning', title: 'Vui lòng nhập mô tả lỗi' });
            return;
        }
        if (!form.location.trim()) {
            addNotification({ type: 'warning', title: 'Vui lòng nhập vị trí lỗi' });
            return;
        }

        const now = new Date();
        const dateStr = formatToDisplayDate(now.toISOString().split('T')[0]);

        if (editingId) {
            const updateData: Partial<Issue> = {
                title: form.title,
                description: form.description || undefined,
                location: form.location,
                priority: form.priority,
                status: form.status,
                assignee: form.assignee || undefined,
                photoUrl: form.photoUrl || undefined,
            };
            if (form.status === 'resolved') {
                updateData.resolvedDate = dateStr;
            }
            updateIssue(editingId, updateData);
            addNotification({ type: 'success', title: `Đã cập nhật: ${form.title}` });
        } else {
            addIssue({
                id: `issue-${Date.now()}`,
                title: form.title,
                description: form.description || undefined,
                location: form.location,
                priority: form.priority,
                status: form.status,
                assignee: form.assignee || undefined,
                photoUrl: form.photoUrl || undefined,
                createdDate: dateStr,
            });
            addNotification({ type: 'success', title: `Đã thêm lỗi: ${form.title}` });
        }
        setShowModal(false);
    };

    const handleDelete = (issue: Issue) => {
        if (confirm(`Xóa "${issue.title}"?`)) {
            deleteIssue(issue.id);
            addNotification({ type: 'info', title: `Đã xóa: ${issue.title}` });
        }
    };

    const handleToggleResolved = (issue: Issue) => {
        const now = new Date();
        const dateStr = formatToDisplayDate(now.toISOString().split('T')[0]);
        if (issue.status === 'resolved') {
            updateIssue(issue.id, { status: 'open', resolvedDate: undefined });
            addNotification({ type: 'info', title: `Mở lại: ${issue.title}` });
        } else {
            updateIssue(issue.id, { status: 'resolved', resolvedDate: dateStr });
            addNotification({ type: 'success', title: `Đã sửa xong: ${issue.title}` });
        }
    };

    // === STYLES ===

    const priorityConfig: Record<string, { label: string; color: string; icon: string }> = {
        high: { label: 'Nghiêm trọng', color: 'bg-red-100 text-red-700', icon: 'error' },
        medium: { label: 'Trung bình', color: 'bg-amber-100 text-amber-700', icon: 'warning' },
        low: { label: 'Nhẹ', color: 'bg-blue-100 text-blue-700', icon: 'info' },
    };

    const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
        open: { label: 'Chưa sửa', color: 'bg-red-50 text-red-600 border-red-200', icon: 'radio_button_unchecked' },
        in_progress: { label: 'Đang sửa', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: 'timelapse' },
        resolved: { label: 'Đã xong', color: 'bg-green-50 text-green-600 border-green-200', icon: 'check_circle' },
    };

    // === RENDER ===

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: 'Tổng lỗi', value: stats.total, icon: 'bug_report', color: 'text-slate-600', bg: 'bg-slate-50' },
                    { label: 'Chưa sửa', value: stats.open, icon: 'radio_button_unchecked', color: 'text-red-500', bg: 'bg-red-50' },
                    { label: 'Đang sửa', value: stats.inProgress, icon: 'timelapse', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Đã xong', value: stats.resolved, icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-50' },
                ].map((card) => (
                    <div key={card.label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className={`material-symbols-outlined text-lg ${card.color} ${card.bg} p-1.5 rounded-lg`}>{card.icon}</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">{card.value}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {stats.highPriority > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500 text-xl">priority_high</span>
                    <p className="text-sm text-red-700 font-medium">
                        Có <strong>{stats.highPriority}</strong> lỗi nghiêm trọng cần xử lý gấp!
                    </p>
                </div>
            )}

            {/* Issue List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
                    <h3 className="text-base sm:text-lg font-bold">Danh sách lỗi ({filtered.length})</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"
                        >
                            <option value="all">Tất cả</option>
                            <option value="open">Chưa sửa</option>
                            <option value="in_progress">Đang sửa</option>
                            <option value="resolved">Đã xong</option>
                        </select>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"
                        >
                            <option value="all">Mọi mức</option>
                            <option value="high">Nghiêm trọng</option>
                            <option value="medium">Trung bình</option>
                            <option value="low">Nhẹ</option>
                        </select>
                        <button
                            onClick={openAdd}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Thêm lỗi
                        </button>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                        <span className="material-symbols-outlined text-5xl mb-3">task_alt</span>
                        <p className="text-sm font-medium">
                            {issues.length === 0 ? 'Chưa có lỗi nào được ghi nhận. Nhấn "Thêm lỗi" để bắt đầu.' : 'Không có lỗi nào phù hợp bộ lọc.'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filtered.map((issue) => {
                            const prio = priorityConfig[issue.priority];
                            const stat = statusConfig[issue.status];
                            return (
                                <div key={issue.id} className={`p-4 sm:p-5 hover:bg-slate-50/50 transition-colors group ${issue.status === 'resolved' ? 'opacity-60' : ''}`}>
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        {/* Checkbox */}
                                        <button
                                            onClick={() => handleToggleResolved(issue)}
                                            className={`mt-0.5 flex-shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-all ${issue.status === 'resolved'
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-slate-300 hover:border-primary text-transparent hover:text-primary/30'
                                                }`}
                                            title={issue.status === 'resolved' ? 'Mở lại' : 'Đánh dấu đã sửa'}
                                        >
                                            <span className="material-symbols-outlined text-sm">check</span>
                                        </button>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <h4 className={`text-sm font-bold ${issue.status === 'resolved' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                                    {issue.title}
                                                </h4>
                                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${prio.color}`}>
                                                    {prio.label}
                                                </span>
                                                <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${stat.color}`}>
                                                    {stat.label}
                                                </span>
                                            </div>

                                            {issue.description && (
                                                <p className="text-xs text-slate-500 mb-1.5 line-clamp-2">{issue.description}</p>
                                            )}

                                            <div className="flex items-center gap-4 text-[10px] text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">location_on</span>
                                                    {issue.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                                                    {issue.createdDate}
                                                </span>
                                                {issue.assignee && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">person</span>
                                                        {issue.assignee}
                                                    </span>
                                                )}
                                                {issue.resolvedDate && (
                                                    <span className="flex items-center gap-1 text-green-500">
                                                        <span className="material-symbols-outlined text-xs">check</span>
                                                        Sửa: {issue.resolvedDate}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Photo thumbnail */}
                                        {issue.photoUrl && (
                                            <div className="hidden sm:block w-16 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                                                <img src={issue.photoUrl} alt="Ảnh lỗi" className="w-full h-full object-cover" />
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                            <button onClick={() => openEdit(issue)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary" title="Sửa">
                                                <span className="material-symbols-outlined text-base">edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(issue)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500" title="Xóa">
                                                <span className="material-symbols-outlined text-base">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* === ADD/EDIT MODAL === */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                            <h3 className="text-lg font-bold">{editingId ? 'Sửa lỗi' : 'Thêm lỗi mới'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-5 space-y-4 overflow-y-auto flex-1">
                            {/* Title */}
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1 block">Mô tả lỗi *</label>
                                <input
                                    type="text" value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="VD: Tường bị nứt chân chim"
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                                />
                            </div>

                            {/* Location + Priority */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">Vị trí *</label>
                                    <input
                                        type="text" value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        placeholder="VD: Tường phía Đông T1"
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">Mức độ</label>
                                    <select
                                        value={form.priority}
                                        onChange={(e) => setForm({ ...form, priority: e.target.value as IssueFormData['priority'] })}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white"
                                    >
                                        <option value="high">🔴 Nghiêm trọng</option>
                                        <option value="medium">🟡 Trung bình</option>
                                        <option value="low">🔵 Nhẹ</option>
                                    </select>
                                </div>
                            </div>

                            {/* Status + Assignee */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">Trạng thái</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value as IssueFormData['status'] })}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white"
                                    >
                                        <option value="open">Chưa sửa</option>
                                        <option value="in_progress">Đang sửa</option>
                                        <option value="resolved">Đã xong</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">Người chịu trách nhiệm</label>
                                    <select
                                        value={form.assignee}
                                        onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white"
                                    >
                                        <option value="">-- Chọn --</option>
                                        {contractors.map(c => (
                                            <option key={c.id} value={c.name}>{c.name} ({c.specialty})</option>
                                        ))}
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1 block">Chi tiết (tùy chọn)</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Mô tả thêm chi tiết về lỗi..."
                                    rows={2}
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none resize-none"
                                />
                            </div>

                            {/* Photo */}
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1 block">Ảnh chụp lỗi (tùy chọn)</label>
                                {form.photoUrl ? (
                                    <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 h-32 flex items-center justify-center">
                                        <img src={form.photoUrl} alt="Preview" className="h-full object-contain" />
                                        <button
                                            onClick={() => setForm({ ...form, photoUrl: '' })}
                                            className="absolute top-2 right-2 size-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <FileUpload
                                        onFileSelect={(base64) => setForm({ ...form, photoUrl: base64 })}
                                        maxSizeMB={3}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-5 border-t border-slate-100 flex gap-3 justify-end flex-shrink-0">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition">
                                Hủy bỏ
                            </button>
                            <button onClick={handleSave} className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base">{editingId ? 'save' : 'add'}</span>
                                {editingId ? 'Lưu' : '+ Thêm lỗi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IssuesPage;
