
import React from 'react';

// === SKELETON PRIMITIVES ===

const Pulse: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
);

// === SKELETON CARDS ===

export const DashboardSkeleton: React.FC = () => (
    <div className="space-y-6 max-w-6xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <Pulse className="h-3 w-20 mb-3" />
                    <Pulse className="h-7 w-28 mb-2" />
                    <Pulse className="h-2 w-full" />
                </div>
            ))}
        </div>
        {/* Main area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <Pulse className="h-5 w-40 mb-6" />
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Pulse className="h-10 w-10 rounded-full flex-shrink-0" />
                            <div className="flex-1">
                                <Pulse className="h-4 w-48 mb-2" />
                                <Pulse className="h-3 w-32" />
                            </div>
                            <Pulse className="h-6 w-16 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <Pulse className="h-5 w-32 mb-6" />
                <Pulse className="h-32 w-32 rounded-full mx-auto mb-4" />
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Pulse key={i} className="h-4 w-full" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export const TableSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between">
            <Pulse className="h-5 w-32" />
            <Pulse className="h-8 w-48" />
        </div>
        <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Pulse className="h-4 w-20" />
                    <div className="flex-1">
                        <Pulse className="h-4 w-40 mb-1" />
                        <Pulse className="h-3 w-24" />
                    </div>
                    <Pulse className="h-4 w-24" />
                    <Pulse className="h-5 w-16 rounded-full" />
                </div>
            ))}
        </div>
    </div>
);

export const CardGridSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-3 mb-4">
                    <Pulse className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                        <Pulse className="h-4 w-32 mb-1" />
                        <Pulse className="h-3 w-20" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Pulse className="h-3 w-full" />
                    <Pulse className="h-3 w-3/4" />
                </div>
            </div>
        ))}
    </div>
);
