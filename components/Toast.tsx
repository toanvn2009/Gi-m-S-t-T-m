import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { Notification } from '../store/useStore';

const ICONS: Record<Notification['type'], string> = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
};

const COLORS: Record<Notification['type'], string> = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
};

const ToastItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const removeNotification = useStore((s) => s.removeNotification);

    useEffect(() => {
        const timer = setTimeout(() => {
            removeNotification(notification.id);
        }, 4000);
        return () => clearTimeout(timer);
    }, [notification.id, removeNotification]);

    return (
        <div className="flex items-start gap-3 bg-white rounded-xl shadow-xl border border-slate-100 p-4 min-w-[280px] max-w-[380px] animate-slide-in">
            <span
                className={`material-symbols-outlined text-white ${COLORS[notification.type]} rounded-full p-1 text-sm flex-shrink-0`}
            >
                {ICONS[notification.type]}
            </span>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{notification.title}</p>
                {notification.message && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notification.message}</p>
                )}
            </div>
            <button
                onClick={() => removeNotification(notification.id)}
                className="text-slate-400 hover:text-slate-600 flex-shrink-0"
            >
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </div>
    );
};

const ToastContainer: React.FC = () => {
    const notifications = useStore((s) => s.notifications);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {notifications.map((n) => (
                <ToastItem key={n.id} notification={n} />
            ))}
        </div>
    );
};

export default ToastContainer;
