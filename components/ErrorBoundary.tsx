// @ts-nocheck
import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

// Using React.Component with explicit type annotation workaround
const ErrorBoundary = class extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[ErrorBoundary]', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-red-500">error</span>
                    </div>
                    <h2 className="text-lg font-bold mb-2">Có lỗi xảy ra</h2>
                    <p className="text-sm text-slate-500 mb-1 max-w-md">
                        Ứng dụng gặp sự cố. Vui lòng thử lại hoặc tải lại trang.
                    </p>
                    <p className="text-xs text-red-400 font-mono mb-4 max-w-md truncate">
                        {this.state.error?.message}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-base">refresh</span>
                            Thử lại
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                        >
                            Tải lại trang
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
};

export default ErrorBoundary;
