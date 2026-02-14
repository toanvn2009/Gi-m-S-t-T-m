
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { chatWithAI, predictProgress, isAPIKeyConfigured } from '../services/geminiService';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

const AIChatWidget: React.FC = () => {
    const { project, timelineSteps, financeItems } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    const getProjectContext = () => {
        const completed = timelineSteps.filter(s => s.status === 'completed').length;
        const totalSpent = financeItems.filter(f => f.status === 'paid').reduce((s, f) => s + f.total, 0);
        return `Dự án: ${project.name} - ${project.location}
Chủ đầu tư: ${project.owner}
Tiến độ: ${completed}/${timelineSteps.length} bước hoàn thành
Ngân sách: ${project.budget.toLocaleString()}đ, đã chi: ${totalSpent.toLocaleString()}đ
Các bước: ${timelineSteps.map(s => `${s.label}(${s.status})`).join(', ')}`;
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            if (!isAPIKeyConfigured()) {
                throw new Error('API key chưa cấu hình');
            }

            const response = await chatWithAI(userMsg.content, getProjectContext());
            const assistantMsg: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                role: 'assistant',
                content: response,
                timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, assistantMsg]);
        } catch {
            setMessages(prev => [...prev, {
                id: `msg-${Date.now() + 1}`,
                role: 'system',
                content: 'Lỗi kết nối AI. Kiểm tra API key trong .env.local',
                timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = async (action: string) => {
        if (isLoading) return;

        const quickMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: action,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, quickMsg]);
        setIsLoading(true);

        try {
            let response: string;
            if (action.includes('tiến độ')) {
                const totalSpent = financeItems.filter(f => f.status === 'paid').reduce((s, f) => s + f.total, 0);
                response = await predictProgress(timelineSteps, project.budget, totalSpent);
            } else {
                response = await chatWithAI(action, getProjectContext());
            }

            setMessages(prev => [...prev, {
                id: `msg-${Date.now() + 1}`,
                role: 'assistant',
                content: response,
                timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            }]);
        } catch {
            setMessages(prev => [...prev, {
                id: `msg-${Date.now() + 1}`,
                role: 'system',
                content: 'Lỗi kết nối AI.',
                timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        { label: 'Đánh giá tiến độ', icon: 'trending_up' },
        { label: 'Gợi ý bước tiếp theo', icon: 'playlist_add' },
        { label: 'Kiểm tra ngân sách', icon: 'account_balance' },
    ];

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-slate-700 rotate-0' : 'bg-primary hover:scale-110 shadow-primary/30'
                    }`}
            >
                <span className="material-symbols-outlined text-white text-2xl">
                    {isOpen ? 'close' : 'smart_toy'}
                </span>
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="p-4 bg-primary text-white flex items-center gap-3 flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">auto_awesome</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold">Trợ lý AI Xây dựng</h4>
                            <p className="text-[10px] text-white/70">Gemini • {project.name}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <span className="material-symbols-outlined text-4xl text-primary/30 mb-3">forum</span>
                                <p className="text-sm font-bold text-slate-600 mb-1">Xin chào! 👋</p>
                                <p className="text-xs text-slate-400 mb-4 max-w-[250px]">
                                    Tôi là trợ lý AI chuyên về xây dựng. Hỏi tôi bất cứ điều gì!
                                </p>
                                <div className="space-y-2 w-full">
                                    {quickActions.map((a) => (
                                        <button
                                            key={a.label}
                                            onClick={() => handleQuickAction(a.label)}
                                            className="w-full flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-lg text-xs text-primary font-medium hover:bg-primary/10 transition text-left"
                                        >
                                            <span className="material-symbols-outlined text-sm">{a.icon}</span>
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${msg.role === 'user'
                                            ? 'bg-primary text-white rounded-br-md'
                                            : msg.role === 'system'
                                                ? 'bg-red-50 text-red-600 border border-red-100 rounded-bl-md'
                                                : 'bg-slate-100 text-slate-800 rounded-bl-md'
                                        }`}>
                                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        <p className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-slate-400'}`}>{msg.timestamp}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-slate-100 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                placeholder="Hỏi về dự án..."
                                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-lg">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatWidget;
