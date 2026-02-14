import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimelineStep, DailyPhoto, FinanceItem, AILog, ViewType, Contractor, ProjectDocument, Issue } from '../types';
import { TIMELINE_STEPS, DAILY_PHOTOS, AI_LOGS, FINANCE_DATA } from '../constants';

// === STATE TYPES ===

export interface ProjectInfo {
    name: string;
    location: string;
    owner: string;
    budget: number;
    startDate: string;
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    timestamp: number;
}

export interface AppState {
    // Project
    project: ProjectInfo;

    // Data
    timelineSteps: TimelineStep[];
    dailyPhotos: DailyPhoto[];
    financeItems: FinanceItem[];
    aiLogs: AILog[];

    // UI
    currentView: ViewType;
    isMobileMenuOpen: boolean;

    // Notifications
    notifications: Notification[];

    // Contractors
    contractors: Contractor[];

    // Documents
    documents: ProjectDocument[];

    // Issues
    issues: Issue[];

    // Theme
    darkMode: boolean;
}

interface AppActions {
    // Project
    updateProject: (data: Partial<ProjectInfo>) => void;

    // Timeline
    addTimelineStep: (step: TimelineStep) => void;
    updateTimelineStep: (id: string, data: Partial<TimelineStep>) => void;
    deleteTimelineStep: (id: string) => void;

    // Photos
    addPhoto: (photo: DailyPhoto) => void;
    updatePhoto: (id: string, data: Partial<DailyPhoto>) => void;
    deletePhoto: (id: string) => void;

    // Finance
    addFinanceItem: (item: FinanceItem) => void;
    updateFinanceItem: (id: string, data: Partial<FinanceItem>) => void;
    deleteFinanceItem: (id: string) => void;

    // AI Logs
    addAILog: (log: AILog) => void;
    clearAILogs: () => void;

    // Import/Export
    importData: (data: Partial<AppState>) => void;

    // UI
    setCurrentView: (view: ViewType) => void;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;

    // Notifications
    addNotification: (n: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;

    // Contractors
    addContractor: (c: Contractor) => void;
    updateContractor: (id: string, data: Partial<Contractor>) => void;
    deleteContractor: (id: string) => void;

    // Documents
    addDocument: (doc: ProjectDocument) => void;
    deleteDocument: (id: string) => void;

    // Issues
    addIssue: (issue: Issue) => void;
    updateIssue: (id: string, data: Partial<Issue>) => void;
    deleteIssue: (id: string) => void;

    // Theme
    toggleDarkMode: () => void;
}

export type AppStore = AppState & AppActions;

// === DEFAULT DATA ===

const defaultProject: ProjectInfo = {
    name: 'NHÀ QUÊ',
    location: 'ĐỒI ẢNH - ĐÔNG SƠN - YÊN THẾ - BẮC GIANG',
    owner: 'ĐỖ VĂN TOÀN',
    budget: 1400000000,
    startDate: '12/03/2025',
};

// === STORE ===

export const useStore = create<AppStore>()(
    persist(
        (set) => ({
            // Initial state
            project: defaultProject,
            timelineSteps: TIMELINE_STEPS,
            dailyPhotos: DAILY_PHOTOS,
            financeItems: FINANCE_DATA,
            aiLogs: AI_LOGS,
            currentView: ViewType.OVERVIEW,
            isMobileMenuOpen: false,
            notifications: [],
            contractors: [],
            documents: [],
            issues: [],
            darkMode: false,

            // Project actions
            updateProject: (data) =>
                set((s) => ({ project: { ...s.project, ...data } })),

            // Timeline actions
            addTimelineStep: (step) =>
                set((s) => ({ timelineSteps: [...s.timelineSteps, step] })),
            updateTimelineStep: (id, data) =>
                set((s) => ({
                    timelineSteps: s.timelineSteps.map((t) =>
                        t.id === id ? { ...t, ...data } : t
                    ),
                })),
            deleteTimelineStep: (id) =>
                set((s) => ({
                    timelineSteps: s.timelineSteps.filter((t) => t.id !== id),
                })),

            // Photo actions
            addPhoto: (photo) =>
                set((s) => ({ dailyPhotos: [photo, ...s.dailyPhotos] })),
            updatePhoto: (id, data) =>
                set((s) => ({
                    dailyPhotos: s.dailyPhotos.map((p) =>
                        p.id === id ? { ...p, ...data } : p
                    ),
                })),
            deletePhoto: (id) =>
                set((s) => ({
                    dailyPhotos: s.dailyPhotos.filter((p) => p.id !== id),
                })),

            // Finance actions
            addFinanceItem: (item) =>
                set((s) => ({ financeItems: [item, ...s.financeItems] })),
            updateFinanceItem: (id, data) =>
                set((s) => ({
                    financeItems: s.financeItems.map((f) =>
                        f.id === id ? { ...f, ...data } : f
                    ),
                })),
            deleteFinanceItem: (id) =>
                set((s) => ({
                    financeItems: s.financeItems.filter((f) => f.id !== id),
                })),

            // AI Log actions
            addAILog: (log) =>
                set((s) => ({ aiLogs: [log, ...s.aiLogs] })),
            clearAILogs: () => set({ aiLogs: [] }),

            // Import/Export actions
            importData: (data) => {
                set((state) => ({
                    ...state,
                    project: data.project || state.project,
                    timelineSteps: data.timelineSteps || state.timelineSteps,
                    dailyPhotos: data.dailyPhotos || state.dailyPhotos,
                    financeItems: data.financeItems || state.financeItems,
                    aiLogs: data.aiLogs || state.aiLogs,
                    contractors: data.contractors || state.contractors,
                    documents: data.documents || state.documents,
                    issues: data.issues || state.issues,
                }));
            },

            // UI actions
            setCurrentView: (view) =>
                set({ currentView: view, isMobileMenuOpen: false }),
            toggleMobileMenu: () =>
                set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
            closeMobileMenu: () => set({ isMobileMenuOpen: false }),

            // Notification actions
            addNotification: (n) =>
                set((s) => ({
                    notifications: [
                        ...s.notifications,
                        { ...n, id: Date.now().toString(), timestamp: Date.now() },
                    ],
                })),
            removeNotification: (id) =>
                set((s) => ({
                    notifications: s.notifications.filter((n) => n.id !== id),
                })),
            clearNotifications: () => set({ notifications: [] }),

            // Contractor actions
            addContractor: (c) =>
                set((s) => ({ contractors: [...s.contractors, c] })),
            updateContractor: (id, data) =>
                set((s) => ({
                    contractors: s.contractors.map((c) =>
                        c.id === id ? { ...c, ...data } : c
                    ),
                })),
            deleteContractor: (id) =>
                set((s) => ({
                    contractors: s.contractors.filter((c) => c.id !== id),
                })),

            // Document actions
            addDocument: (doc) =>
                set((s) => ({ documents: [doc, ...s.documents] })),
            deleteDocument: (id) =>
                set((s) => ({
                    documents: s.documents.filter((d) => d.id !== id),
                })),

            // Issue actions
            addIssue: (issue) =>
                set((s) => ({ issues: [issue, ...s.issues] })),
            updateIssue: (id, data) =>
                set((s) => ({
                    issues: s.issues.map((i) =>
                        i.id === id ? { ...i, ...data } : i
                    ),
                })),
            deleteIssue: (id) =>
                set((s) => ({
                    issues: s.issues.filter((i) => i.id !== id),
                })),

            // Theme actions
            toggleDarkMode: () =>
                set((s) => {
                    const newMode = !s.darkMode;
                    if (newMode) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                    return { darkMode: newMode };
                }),
        }),
        {
            name: 'construction-project-storage',
            // Don't persist UI state or notifications
            partialize: (state) => ({
                project: state.project,
                timelineSteps: state.timelineSteps,
                dailyPhotos: state.dailyPhotos,
                financeItems: state.financeItems,
                aiLogs: state.aiLogs,
                contractors: state.contractors,
                documents: state.documents,
                issues: state.issues,
                darkMode: state.darkMode,
            }),
        }
    )
);
