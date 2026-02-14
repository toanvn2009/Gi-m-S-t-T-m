
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Contractor } from '../types';

interface ContractorForm {
    name: string;
    specialty: string;
    phone: string;
    email: string;
    rating: number;
    status: 'active' | 'completed' | 'paused';
    notes: string;
}

const emptyForm: ContractorForm = {
    name: '', specialty: '', phone: '', email: '', rating: 5, status: 'active', notes: '',
};

const ContractorsPage: React.FC = () => {
    const { contractors, addContractor, updateContractor, deleteContractor, addNotification } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<ContractorForm>(emptyForm);
    const [search, setSearch] = useState('');

    const filtered = contractors.filter(c =>
        !search.trim() || c.name.toLowerCase().includes(search.toLowerCase()) || c.specialty.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };

    const openEdit = (c: Contractor) => {
        setEditingId(c.id);
        setForm({ name: c.name, specialty: c.specialty, phone: c.phone, email: c.email || '', rating: c.rating, status: c.status, notes: c.notes || '' });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!form.name.trim()) { addNotification({ type: 'warning', title: 'Vui lòng nhập tên nhà thầu' }); return; }
        const data = { name: form.name, specialty: form.specialty, phone: form.phone, email: form.email || undefined, rating: form.rating, status: form.status, notes: form.notes || undefined };
        if (editingId) {
            updateContractor(editingId, data);
            addNotification({ type: 'success', title: `Đã cập nhật: ${form.name}` });
        } else {
            addContractor({ id: `ctr-${Date.now()}`, ...data });
            addNotification({ type: 'success', title: `Đã thêm: ${form.name}` });
        }
        setShowModal(false);
    };

    const handleDelete = (c: Contractor) => {
        if (confirm(`Xóa nhà thầu "${c.name}"?`)) {
            deleteContractor(c.id);
            addNotification({ type: 'info', title: `Đã xóa: ${c.name}` });
        }
    };

    const statusColors: Record<string, string> = {
        active: 'bg-green-100 text-green-700',
        completed: 'bg-blue-100 text-blue-700',
        paused: 'bg-amber-100 text-amber-700',
    };
    const statusLabels: Record<string, string> = { active: 'Đang làm', completed: 'Đã xong', paused: 'Tạm dừng' };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-slate-500">{contractors.length} nhà thầu</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <button onClick={openAdd} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition">
                        <span className="material-symbols-outlined text-sm">person_add</span>Thêm
                    </button>
                </div>
            </div>

            {/* Contractor Cards */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">
                    <span className="material-symbols-outlined text-5xl mb-3">engineering</span>
                    <p className="text-sm font-medium">{search ? 'Không tìm thấy.' : 'Chưa có nhà thầu. Nhấn "Thêm" để bắt đầu.'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((c) => (
                        <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                        {c.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                                        <p className="text-[10px] text-slate-500">{c.specialty}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${statusColors[c.status]}`}>
                                    {statusLabels[c.status]}
                                </span>
                            </div>

                            {/* Contact */}
                            <div className="space-y-1.5 mb-3">
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <span className="material-symbols-outlined text-sm text-slate-400">call</span>
                                    {c.phone || '—'}
                                </div>
                                {c.email && (
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <span className="material-symbols-outlined text-sm text-slate-400">mail</span>
                                        <span className="truncate">{c.email}</span>
                                    </div>
                                )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-3">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span key={i} className={`material-symbols-outlined text-sm ${i < c.rating ? 'text-amber-400 fill' : 'text-slate-200'}`}>star</span>
                                ))}
                            </div>

                            {c.notes && <p className="text-[10px] text-slate-400 italic line-clamp-2 mb-3">{c.notes}</p>}

                            {/* Actions */}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-slate-100">
                                <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition">
                                    <span className="material-symbols-outlined text-sm">edit</span>Sửa
                                </button>
                                <button onClick={() => handleDelete(c)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                    <span className="material-symbols-outlined text-sm">delete</span>Xóa
                                </button>
                                {c.phone && (
                                    <a href={`tel:${c.phone}`} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition">
                                        <span className="material-symbols-outlined text-sm">call</span>Gọi
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold">{editingId ? 'Sửa nhà thầu' : 'Thêm nhà thầu'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-full"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1 block">Tên nhà thầu *</label>
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Cty Xây dựng ABC" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">Chuyên môn</label>
                                    <input type="text" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="VD: Thợ xây" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">Trạng thái</label>
                                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ContractorForm['status'] })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white">
                                        <option value="active">Đang làm</option>
                                        <option value="completed">Đã xong</option>
                                        <option value="paused">Tạm dừng</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">Điện thoại</label>
                                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0912 345 678" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">Email</label>
                                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="abc@email.com" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1 block">Đánh giá: {form.rating}/5</label>
                                <input type="range" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} className="w-full accent-amber-400" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1 block">Ghi chú</label>
                                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Ghi chú thêm..." rows={2} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none resize-none" />
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-100 flex gap-3 justify-end">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition">Hủy bỏ</button>
                            <button onClick={handleSave} className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base">{editingId ? 'save' : 'person_add'}</span>
                                {editingId ? 'Lưu' : 'Thêm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractorsPage;
