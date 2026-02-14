import { AppState } from '../store/useStore';

export const exportProjectData = (state: AppState) => {
    const data = {
        project: state.project,
        timelineSteps: state.timelineSteps,
        dailyPhotos: state.dailyPhotos,
        financeItems: state.financeItems,
        aiLogs: state.aiLogs,
        // Added missing fields
        contractors: state.contractors,
        documents: state.documents,
        issues: state.issues,

        exportedAt: new Date().toISOString(),
        version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `giam-sat-to-am-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const importProjectData = (file: File): Promise<Partial<AppState>> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = e.target?.result as string;
                const data = JSON.parse(json);

                // Basic validation
                if (!data.project || !Array.isArray(data.timelineSteps)) {
                    reject(new Error('File không hợp lệ hoặc thiếu dữ liệu quan trọng'));
                    return;
                }

                resolve(data);
            } catch (error) {
                reject(new Error('Lỗi đọc file JSON'));
            }
        };
        reader.onerror = () => reject(new Error('Lỗi đọc file'));
        reader.readAsText(file);
    });
};
