
import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';

interface RiskItem {
    id: string;
    type: 'warning' | 'danger' | 'info';
    title: string;
    description: string;
    icon: string;
}

const RiskAlerts: React.FC = () => {
    const { timelineSteps, financeItems, project } = useStore();

    const risks = useMemo(() => {
        const items: RiskItem[] = [];

        // Budget risk
        const totalSpent = financeItems.filter(f => f.status === 'paid').reduce((s, f) => s + f.total, 0);
        const budgetPercent = project.budget > 0 ? (totalSpent / project.budget) * 100 : 0;
        const completed = timelineSteps.filter(s => s.status === 'completed').length;
        const progressPercent = timelineSteps.length > 0 ? (completed / timelineSteps.length) * 100 : 0;

        if (budgetPercent > 80) {
            items.push({
                id: 'budget-high',
                type: 'danger',
                title: 'Ngân sách sắp hết',
                description: `Đã chi ${budgetPercent.toFixed(0)}% ngân sách nhưng mới hoàn thành ${progressPercent.toFixed(0)}% tiến độ.`,
                icon: 'account_balance_wallet',
            });
        } else if (budgetPercent > progressPercent + 20) {
            items.push({
                id: 'budget-ahead',
                type: 'warning',
                title: 'Chi phí vượt tiến độ',
                description: `Chi phí (${budgetPercent.toFixed(0)}%) đang nhanh hơn tiến độ (${progressPercent.toFixed(0)}%). Cần theo dõi.`,
                icon: 'trending_up',
            });
        }

        // Overdue invoices
        const overdueCount = financeItems.filter(f => f.status === 'overdue').length;
        if (overdueCount > 0) {
            items.push({
                id: 'overdue-invoices',
                type: 'danger',
                title: `${overdueCount} hóa đơn quá hạn`,
                description: 'Có hóa đơn cần thanh toán gấp để tránh phạt hoặc trì hoãn vật tư.',
                icon: 'receipt_long',
            });
        }

        // Pending invoices
        const pendingTotal = financeItems.filter(f => f.status === 'pending').reduce((s, f) => s + f.total, 0);
        if (pendingTotal > 0) {
            items.push({
                id: 'pending-payment',
                type: 'info',
                title: 'Thanh toán chờ xử lý',
                description: `${pendingTotal.toLocaleString()}đ đang chờ thanh toán.`,
                icon: 'schedule',
            });
        }

        // No current step
        const currentStep = timelineSteps.find(s => s.status === 'current');
        if (timelineSteps.length > 0 && !currentStep) {
            const allDone = timelineSteps.every(s => s.status === 'completed');
            if (!allDone) {
                items.push({
                    id: 'no-active-step',
                    type: 'warning',
                    title: 'Không có bước đang thi công',
                    description: 'Dự án không có bước nào đang hoạt động. Cần cập nhật tiến độ.',
                    icon: 'pause_circle',
                });
            }
        }

        // Slow current step
        if (currentStep && (currentStep.progress || 0) < 30) {
            items.push({
                id: 'slow-progress',
                type: 'info',
                title: `"${currentStep.label}" tiến độ chậm`,
                description: `Bước hiện tại mới đạt ${currentStep.progress || 0}%. Cần đẩy nhanh.`,
                icon: 'speed',
            });
        }

        // Good news!
        if (items.length === 0) {
            items.push({
                id: 'all-good',
                type: 'info',
                title: 'Dự án đúng hạn',
                description: 'Không phát hiện rủi ro nào. Tiếp tục phát huy!',
                icon: 'check_circle',
            });
        }

        return items;
    }, [timelineSteps, financeItems, project.budget]);

    const typeStyles: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
        danger: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', badge: 'bg-red-100 text-red-700' },
        warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', badge: 'bg-amber-100 text-amber-700' },
        info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500', badge: 'bg-blue-100 text-blue-700' },
    };
    const typeLabels: Record<string, string> = { danger: 'NGUY HIỂM', warning: 'CẢNH BÁO', info: 'THÔNG TIN' };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary fill text-lg">shield</span>
                <h3 className="text-sm font-bold text-slate-700">Cảnh báo rủi ro</h3>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{risks.length}</span>
            </div>
            {risks.map((risk) => {
                const style = typeStyles[risk.type];
                return (
                    <div key={risk.id} className={`${style.bg} border ${style.border} rounded-xl p-3.5 flex gap-3`}>
                        <span className={`material-symbols-outlined ${style.icon} text-xl flex-shrink-0 mt-0.5`}>{risk.icon}</span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${style.badge}`}>
                                    {typeLabels[risk.type]}
                                </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-800 mt-1">{risk.title}</h4>
                            <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{risk.description}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RiskAlerts;
