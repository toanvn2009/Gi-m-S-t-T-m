
import { TimelineStep, DailyPhoto, FinanceItem, AILog } from './types';

export const TIMELINE_STEPS: TimelineStep[] = [
  { id: '1', label: 'Động thổ', date: '12/03/2024', status: 'completed' },
  { id: '2', label: 'Ép cọc & Móng', date: '25/03/2024', status: 'completed' },
  { id: '3', label: 'Xây tường T1', date: 'Hiện tại', status: 'current', progress: 75, contractor: 'Nhà thầu B' },
  { id: '4', label: 'Đổ sàn T1', date: 'Dự kiến: 15/05', status: 'pending', contractor: 'Nhà thầu B', estimate: '05/11' },
  { id: '5', label: 'Hoàn thiện', date: 'Dự kiến: T8/2024', status: 'pending' },
];

export const DAILY_PHOTOS: DailyPhoto[] = [
  {
    id: '1',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGFLMlDZ9Of4Ob8GVyFSvoeA64mPPjmXLH037QAdbdOmZ1o0RiBzuxqprBaU4T3eqjnS44wlV7lXW8BUmSbMtKlFV8iWzTxmlt-HqxIYMQhxnOqE0GzIlLDSDHZYqbeL_FrIM_AnTyb7GPWuxUOyOt4KRJdWAj_houlkeObWPHGhpuW-YtsD3VzG0usScdRR6sq5kKGKxysD3W_pnhDYFpoApA4ygG-LXoE4awRc6rLyDtpELt5t7oXzI7xJjtDQNVAxhRE7yjLEI',
    timestamp: '14/05/2024 - Sáng',
    aiTag: 'AI: Hoàn thiện 75% tường bao',
    aiColor: 'bg-green-400',
    phase: 'Xây tường T1'
  },
  {
    id: '2',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb-u9cefuK4RmgwZmQNqlIJfaKLiKQj9I7FjzovSTrZbXfiD_Clzl-9iRTJ3rrnhPeInlgEXoC1fd5B1duUd2cS6QwFF565aBp0nYVZt5XD0M7Y2cZnbboPcP4Rv82fv-AmPq7ZL5oOGMsLvgVXuf8h140xoeyXSL6jdrWPf9Jt2RSE7SwmHJnvchYrsnya-PD4JZSbg5rSQ7LBX85CClHF1NBoLIhz9tW9lDlgts4yCQovNKmdlkiC9BdR3niOR_vRRMskUt4qtw',
    timestamp: '13/05/2024 - Chiều',
    aiTag: 'AI: Đã nhập thêm 5000 gạch',
    aiColor: 'bg-blue-400',
    phase: 'Xây tường T1'
  },
  {
    id: '3',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbSXKodhdJh2xmk7Elk0pegmIoQoE0Z9w94iZfmTbru1ODniv4cCePFqg3qqJHgH1_VqkVgSh5sI6RAjStPlSXLCWqie7edABOrWIcKFhfrAQQwKUAfr0Q_EpVGJ3MwlWDzAXl9xqR-L7jfmpP2hNBjGnzanwLXBEkiNRMexNnZ-BujYJ3RUfmyrz9JUIpH92eLitkrnS6ycO3MQM25QtzDIcOB9zxoDLnkBoRa8XLGepKAJ2sTo4fPmhkCnvtJhSV_EiEf40DrWY',
    timestamp: '12/05/2024 - Sáng',
    aiTag: 'AI: Đang lắp đặt cốt thép sàn',
    aiColor: 'bg-orange-400',
    phase: 'Ép cọc & Móng'
  }
];

export const AI_LOGS: AILog[] = [
  {
    id: '1',
    type: 'PHÂN TÍCH HÌNH ẢNH',
    time: 'Hôm qua',
    content: 'Phát hiện tường xây chưa đều tại góc phía Đông. Cần kiểm tra lại độ phẳng bề mặt.'
  },
  {
    id: '2',
    type: 'CẢNH BÁO VẬT TƯ',
    time: '20/10/2023',
    content: 'Lượng gạch ống tồn kho sắp hết, dự kiến cần nhập thêm trong 48 giờ tới.'
  }
];

export const FINANCE_DATA: FinanceItem[] = [
  { id: '1', date: '12/10/2023', name: 'Gạch Tuynel 2 Lỗ', vendor: 'Cửa hàng VLXD Hùng', quantity: '10,000 viên', unitPrice: 1200, total: 12000000, status: 'paid' },
  { id: '2', date: '10/10/2023', name: 'Xi măng Hà Tiên', vendor: 'Đại lý cấp 1 Toàn Thắng', quantity: '50 bao', unitPrice: 85000, total: 4250000, status: 'paid' },
  { id: '3', date: '08/10/2023', name: 'Thép Phi 10 Hòa Phát', vendor: 'Thép Hòa Phát', quantity: '1.5 tấn', unitPrice: 18500000, total: 27750000, status: 'pending' },
  { id: '4', date: '05/10/2023', name: 'Cát Vàng Sàng', vendor: 'Bãi VLXD Quận 9', quantity: '12 m3', unitPrice: 450000, total: 5400000, status: 'paid' },
  { id: '5', date: '02/10/2023', name: 'Đá 1x2', vendor: 'Bãi VLXD Quận 9', quantity: '8 m3', unitPrice: 320000, total: 2560000, status: 'paid' },
];
