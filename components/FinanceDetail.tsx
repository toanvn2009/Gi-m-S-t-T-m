
import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { FinanceItem } from '../types';
import { formatToISODate, formatToDisplayDate } from '../utils/dateHelpers';

// === TYPES ===

interface InvoiceFormData {
  date: string;
  name: string;
  vendor: string;
  quantity: string;
  unitPrice: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
}

const emptyForm: InvoiceFormData = {
  date: '', name: '', vendor: '', quantity: '', unitPrice: 0, total: 0, status: 'pending',
};

// === HELPERS ===

const fmt = (n: number) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}tr`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toString();
};

// === MAIN COMPONENT ===

const FinanceDetail: React.FC = () => {
  const {
    financeItems, project,
    addFinanceItem, updateFinanceItem, deleteFinanceItem,
    addNotification,
  } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<InvoiceFormData>(emptyForm);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Split quantity state for calculation
  const [splitQty, setSplitQty] = useState<{ val: number; unit: string }>({ val: 0, unit: '' });

  // === COMPUTED ===

  const stats = useMemo(() => {
    const budget = project.budget;
    const totalSpent = financeItems.filter(f => f.status === 'paid').reduce((s, f) => s + f.total, 0);
    const totalPending = financeItems.filter(f => f.status !== 'paid').reduce((s, f) => s + f.total, 0);
    const remaining = budget - totalSpent;
    const spentPercent = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

    // Group by vendor for allocation chart
    const byVendor: Record<string, number> = {};
    financeItems.forEach(f => {
      byVendor[f.vendor] = (byVendor[f.vendor] || 0) + f.total;
    });
    const totalAll = financeItems.reduce((s, f) => s + f.total, 0);
    const allocation = Object.entries(byVendor)
      .map(([vendor, amount]) => ({
        vendor,
        amount,
        percent: totalAll > 0 ? Math.round((amount / totalAll) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5

    return { budget, totalSpent, totalPending, remaining, spentPercent, allocation, totalAll };
  }, [financeItems, project.budget]);

  const filteredItems = useMemo(() => {
    let items = [...financeItems];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.vendor.toLowerCase().includes(q) ||
        f.date.includes(q)
      );
    }
    if (statusFilter !== 'all') {
      items = items.filter(f => f.status === statusFilter);
    }
    return items;
  }, [financeItems, searchQuery, statusFilter]);

  // === HANDLERS ===

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
    // Reset split qty
    setSplitQty({ val: 0, unit: '' });
  };

  const openEdit = (item: FinanceItem) => {
    setEditingId(item.id);
    const qtyNum = parseFloat(item.quantity) || 0;
    const qtyUnit = item.quantity.replace(qtyNum.toString(), '').trim();

    setForm({
      date: item.date,
      name: item.name,
      vendor: item.vendor,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
      status: item.status,
    });
    setSplitQty({ val: qtyNum, unit: qtyUnit });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      addNotification({ type: 'warning', title: 'Vui lòng nhập tên vật tư' });
      return;
    }

    const data = {
      date: form.date || new Date().toLocaleDateString('vi-VN'),
      name: form.name,
      vendor: form.vendor,
      quantity: `${splitQty.val} ${splitQty.unit}`.trim(),
      unitPrice: form.unitPrice,
      total: form.total || form.unitPrice,
      status: form.status,
    };

    if (editingId) {
      updateFinanceItem(editingId, data);
      addNotification({ type: 'success', title: `Đã cập nhật: ${form.name}` });
    } else {
      addFinanceItem({ id: `fin-${Date.now()}`, ...data });
      addNotification({ type: 'success', title: `Đã thêm: ${form.name}` });
    }
    setShowModal(false);
  };

  const handleDelete = (item: FinanceItem) => {
    if (confirm(`Xóa "${item.name}"?`)) {
      deleteFinanceItem(item.id);
      addNotification({ type: 'info', title: `Đã xóa: ${item.name}` });
    }
  };

  // === DONUT CHART ===

  const colors = ['#144bb8', '#4e6797', '#8da2c9', '#b4c4e0', '#d1ddf0'];

  const donutSegments = useMemo(() => {
    const segments: { offset: number; dash: number; color: string; label: string; percent: number }[] = [];
    let cumOffset = 25; // Start from top (25% offset in SVG circle)
    stats.allocation.forEach((a, i) => {
      segments.push({
        offset: cumOffset,
        dash: a.percent,
        color: colors[i % colors.length],
        label: a.vendor,
        percent: a.percent,
      });
      cumOffset += a.percent;
    });
    return segments;
  }, [stats.allocation]);

  // === RENDER ===

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          { label: 'Ngân sách', value: `${stats.budget.toLocaleString('vi-VN')}đ`, icon: 'account_balance', color: 'text-primary', bgColor: 'bg-primary/10' },
          { label: `Đã chi (${stats.spentPercent}%)`, value: `${stats.totalSpent.toLocaleString('vi-VN')}đ`, icon: 'payments', color: 'text-red-500', bgColor: 'bg-red-50', progress: stats.spentPercent },
          { label: 'Còn lại', value: `${stats.remaining.toLocaleString('vi-VN')}đ`, icon: 'savings', color: 'text-green-500', bgColor: 'bg-green-50', isAccent: true },
        ].map((card, i) => (
          <div key={i} className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-transform hover:translate-y-[-2px] ${i === 2 && 'sm:col-span-2 lg:col-span-1'}`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">{card.label}</p>
              <span className={`material-symbols-outlined text-lg sm:text-xl ${card.color} ${card.bgColor} p-2 rounded-lg`}>{card.icon}</span>
            </div>
            <p className={`text-xl sm:text-2xl font-black ${card.isAccent ? 'text-primary' : 'text-slate-900'}`}>{card.value}</p>
            {card.progress !== undefined ? (
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${card.progress > 80 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(card.progress, 100)}%` }} />
              </div>
            ) : (
              <p className="text-[10px] font-bold mt-2 text-slate-400">
                {card.isAccent ? `Chờ thanh toán: ${stats.totalPending.toLocaleString('vi-VN')}đ` : ''}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Allocation Chart */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold mb-6">Phân bổ chi phí</h3>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
            <div className="relative size-36 sm:size-48 flex items-center justify-center flex-shrink-0">
              <svg className="size-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#e7ebf3" strokeWidth="4" />
                {donutSegments.map((seg, i) => (
                  <circle
                    key={i} cx="18" cy="18" fill="transparent" r="16"
                    stroke={seg.color} strokeWidth="4"
                    strokeDasharray={`${seg.dash} ${100 - seg.dash}`}
                    strokeDashoffset={`${seg.offset}`}
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base sm:text-xl font-black">{fmt(stats.totalAll)}</span>
                <span className="text-[8px] sm:text-[10px] text-slate-500 uppercase font-bold">Tổng chi</span>
              </div>
            </div>
            <div className="flex-1 space-y-3 sm:space-y-4 w-full">
              {stats.allocation.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Chưa có dữ liệu chi phí.</p>
              ) : (
                stats.allocation.map((item, i) => (
                  <div key={item.vendor} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }} />
                      <span className="text-xs sm:text-sm font-medium truncate max-w-[150px]">{item.vendor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{fmt(item.amount)}đ</span>
                      <span className="text-xs sm:text-sm font-bold">{item.percent}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-base sm:text-lg font-bold mb-4">Thống kê nhanh</h3>
          <div className="space-y-3 flex-1">
            {[
              { label: 'Tổng hóa đơn', value: financeItems.length.toString(), icon: 'receipt_long' },
              { label: 'Đã thanh toán', value: financeItems.filter(f => f.status === 'paid').length.toString(), icon: 'check_circle', color: 'text-green-500' },
              { label: 'Chờ thanh toán', value: financeItems.filter(f => f.status === 'pending').length.toString(), icon: 'schedule', color: 'text-amber-500' },
              { label: 'Quá hạn', value: financeItems.filter(f => f.status === 'overdue').length.toString(), icon: 'warning', color: 'text-red-500' },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-lg ${s.color || 'text-primary'}`}>{s.icon}</span>
                  <span className="text-xs sm:text-sm text-slate-600">{s.label}</span>
                </div>
                <span className="text-sm sm:text-base font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
          <h3 className="text-base sm:text-lg font-bold">Hóa đơn ({filteredItems.length})</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                placeholder="Tìm kiếm..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"
            >
              <option value="all">Tất cả</option>
              <option value="paid">Đã trả</option>
              <option value="pending">Chờ</option>
              <option value="overdue">Quá hạn</option>
            </select>
            <button
              onClick={openAdd}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Thêm
            </button>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">receipt_long</span>
              <p className="text-sm">{searchQuery ? 'Không tìm thấy kết quả.' : 'Chưa có hóa đơn. Nhấn "Thêm" để tạo.'}</p>
            </div>
          ) : (
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-4 sm:px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Vật tư</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Tổng cộng</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-4 sm:px-6 py-4 text-xs text-slate-500">{item.date}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 truncate max-w-[150px]">{item.name}</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">{item.vendor}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-right font-black text-slate-900">{item.total.toLocaleString()}đ</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-wider ${item.status === 'paid' ? 'bg-green-100 text-green-700' :
                        item.status === 'overdue' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                        {item.status === 'paid' ? 'ĐÃ TRẢ' : item.status === 'overdue' ? 'QUÁ HẠN' : 'CHỜ'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(item)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-primary" title="Sửa">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => handleDelete(item)} className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500" title="Xóa">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* === ADD/EDIT MODAL === */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingId ? 'Sửa hóa đơn' : 'Thêm hóa đơn'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Vật tư / Hạng mục *</label>
                <input
                  type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Xi măng Nghi Sơn"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                />
              </div>

              {/* Date + Vendor */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Ngày</label>
                  <input
                    type="date" value={formatToISODate(form.date)}
                    onChange={(e) => setForm({ ...form, date: formatToDisplayDate(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Nhà cung cấp</label>
                  <input
                    type="text" value={form.vendor}
                    onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                    placeholder="VD: VLXD Hùng"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  />
                </div>
              </div>

              {/* Qty + Unit + Unit Price + Total */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Số lượng</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={splitQty.val || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setSplitQty({ ...splitQty, val });
                        setForm({ ...form, total: val * form.unitPrice });
                      }}
                      placeholder="0"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Đơn vị</label>
                  <input
                    type="text"
                    value={splitQty.unit}
                    onChange={(e) => setSplitQty({ ...splitQty, unit: e.target.value })}
                    placeholder="bao/kg..."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Đơn giá</label>
                  <input
                    type="number" value={form.unitPrice || ''}
                    onChange={(e) => {
                      const up = parseFloat(e.target.value) || 0;
                      setForm({ ...form, unitPrice: up, total: up * splitQty.val });
                    }}
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Tổng tiền</label>
                  <input
                    type="number" value={form.total || ''}
                    onChange={(e) => setForm({ ...form, total: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as InvoiceFormData['status'] })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white"
                >
                  <option value="pending">Chờ thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="overdue">Quá hạn</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition">
                Hủy bỏ
              </button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">{editingId ? 'save' : 'add'}</span>
                {editingId ? 'Lưu' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceDetail;
