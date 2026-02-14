
/**
 * Chuyển đổi định dạng ngày từ DD/MM/YYYY sang YYYY-MM-DD
 * Dùng để hiển thị trong input type="date"
 */
export const formatToISODate = (dateStr: string): string => {
    if (!dateStr || dateStr.includes('Hiện tại') || dateStr.includes('Dự kiến')) {
        // Nếu là text tự do, trả về ngày hôm nay để picker có giá trị khởi tạo
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return dateStr;
};

/**
 * Chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
 * Dùng để lưu vào store
 */
export const formatToDisplayDate = (isoDate: string): string => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
    }
    return isoDate;
};
