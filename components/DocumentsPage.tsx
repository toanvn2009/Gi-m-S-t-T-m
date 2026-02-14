import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { ProjectDocument } from '../types';
import FileUpload from './FileUpload';

const categoryLabels: Record<string, string> = {
    contract: 'Hợp đồng', permit: 'Giấy phép', blueprint: 'Bản vẽ',
    invoice: 'Hóa đơn', photo: 'Ảnh', other: 'Khác',
};
const categoryIcons: Record<string, string> = {
    contract: 'description', permit: 'verified', blueprint: 'architecture',
    invoice: 'receipt', photo: 'photo_library', other: 'folder',
};
const categoryColors: Record<string, string> = {
    contract: 'bg-blue-100 text-blue-600', permit: 'bg-green-100 text-green-600', blueprint: 'bg-purple-100 text-purple-600',
    invoice: 'bg-amber-100 text-amber-600', photo: 'bg-pink-100 text-pink-600', other: 'bg-slate-100 text-slate-600',
};

const DocumentsPage: React.FC = () => {
    const { documents, addDocument, deleteDocument, addNotification } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('all');
    const [form, setForm] = useState({ name: '', category: 'other' as ProjectDocument['category'], notes: '' });
    const [uploadFile, setUploadFile] = useState<{ base64: string, name: string, size: number } | null>(null);

    const filtered = useMemo(() => {
        let items = [...documents];
        if (search.trim()) {
            const q = search.toLowerCase();
            items = items.filter(d => d.name.toLowerCase().includes(q) || (d.notes || '').toLowerCase().includes(q));
        }
        if (catFilter !== 'all') items = items.filter(d => d.category === catFilter);
        return items;
    }, [documents, search, catFilter]);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        documents.forEach(d => { counts[d.category] = (counts[d.category] || 0) + 1; });
        return counts;
    }, [documents]);

    const handleAdd = () => {
        if (!form.name.trim()) { addNotification({ type: 'warning', title: 'Vui lòng nhập tên tài liệu' }); return; }

        addDocument({
            id: `doc-${Date.now()}`,
            name: form.name,
            category: form.category,
            uploadDate: new Date().toLocaleDateString('vi-VN'),
            notes: form.notes || undefined,
            url: uploadFile?.base64,
            fileSize: uploadFile ? (uploadFile.size / 1024 / 1024).toFixed(2) + ' MB' : undefined,
        });

        addNotification({ type: 'success', title: `Đã thêm: ${form.name}` });
        setShowModal(false);
        setForm({ name: '', category: 'other', notes: '' });
        setUploadFile(null);
    };

    const handleDelete = (doc: ProjectDocument) => {
        if (confirm(`Xóa "${doc.name}"?`)) {
            deleteDocument(doc.id);
            addNotification({ type: 'info', title: `Đã xóa: ${doc.name}` });
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Category Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(categoryLabels).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setCatFilter(catFilter === key ? 'all' : key)}
                        className={`p-3 rounded-xl border text-left transition-all ${catFilter === key ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 bg-white hover:border-primary/30'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${categoryColors[key]}`}>
                            <span className="material-symbols-outlined text-base">{categoryIcons[key]}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900">{label}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{categoryCounts[key] || 0} tài liệu</p>
                    </button>
                ))}
            </div>

            {/* Search + Add */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none" placeholder="Tìm tài liệu..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                {catFilter !== 'all' && (
                    <button onClick={() => setCatFilter('all')} className="px-3 py-2 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition">
                        Xóa lọc
                    </button>
                )}
                <button onClick={() => setShowModal(true)} className="flex items-center gap-1 px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition">
                    <span className="material-symbols-outlined text-sm">upload_file</span>Thêm
                </button>
            </div>

            {/* Document List */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">
                    <span className="material-symbols-outlined text-5xl mb-3">folder_open</span>
                    <p className="text-sm font-medium">{search ? 'Không tìm thấy.' : 'Chưa có tài liệu. Nhấn "Thêm" để upload.'}</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
                    {filtered.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition group">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[doc.category]}`}>
                                <span className="material-symbols-outlined text-lg">{categoryIcons[doc.category]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                                <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                                    <span>{categoryLabels[doc.category]}</span>
                                    <span>•</span>
                                    <span>{doc.uploadDate}</span>
                                    {doc.fileSize && <><span>•</span><span>{doc.fileSize}</span></>}
                                </div>
                                {doc.notes && <p className="text-[10px] text-slate-400 italic mt-1 truncate">{doc.notes}</p>}
                            </div>
                            <div className="flex items-center gap-1">
                                {doc.url && (
                                    <a
                                        href={doc.url}
                                        download={doc.name}
                                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-blue-50 rounded text-slate-400 hover:text-blue-600 transition"
                                        title="Tải xuống"
                                    >
                                        <span className="material-symbols-outlined text-lg">download</span>
                                    </a>
                                )}
                                <button onClick={() => handleDelete(doc)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition" title="Xóa">
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <h3 className="text-lg font-bold">Thêm tài liệu</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-full"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="p-5 space-y-4 overflow-y-auto">
                            {/* File Upload Section */}
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-2 block">Tải file lên</label>
                                {!uploadFile ? (
                                    <FileUpload
                                        onFileSelect={(base64, file) => {
                                            setUploadFile({ base64, name: file.name, size: file.size });
                                            if (!form.name) setForm(prev => ({ ...prev, name: file.name }));
                                        }}
                                        maxSizeMB={10}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                                        <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                            <span className="material-symbols-outlined">description</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-green-900 truncate">{uploadFile.name}</p>
                                            <p className="text-[10px] text-green-600">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button onClick={() => setUploadFile(null)} className="p-1 hover:bg-green-200 rounded text-green-600 transition">
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1 block">Tên tài liệu *</label>
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Hợp đồng nhà thầu ABC" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1 block">Danh mục</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProjectDocument['category'] })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white">
                                    {Object.entries(categoryLabels).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1 block">Ghi chú</label>
                                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Mô tả thêm..." rows={2} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none resize-none" />
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-100 flex gap-3 justify-end shrink-0">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition">Hủy bỏ</button>
                            <button onClick={handleAdd} className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base">upload_file</span>Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentsPage;
