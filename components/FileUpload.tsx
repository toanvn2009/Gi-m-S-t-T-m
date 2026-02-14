import React, { useRef, useState } from 'react';

interface FileUploadProps {
    onFileSelect: (base64: string, file: File) => void;
    accept?: string;
    maxSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    accept = "image/*",
    maxSizeMB = 5
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File quá lớn. Vui lòng chọn file nhỏ hơn ${maxSizeMB}MB.`);
            return;
        }

        setError(null);

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            onFileSelect(base64String, file);
        };
        reader.onerror = () => {
            setError("Lỗi khi đọc file. Vui lòng thử lại.");
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        // Strict check for image if accept is image/*
        if (accept === 'image/*' && !file.type.startsWith('image/')) {
            setError('Vui lòng chỉ tải lên file ảnh.');
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File quá lớn. Vui lòng chọn file nhỏ hơn ${maxSizeMB}MB.`);
            return;
        }

        setError(null);

        const reader = new FileReader();
        reader.onloadend = () => {
            onFileSelect(reader.result as string, file);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="w-full">
            <div
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept={accept}
                    onChange={handleFileChange}
                />

                <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">cloud_upload</span>
                </div>

                <p className="text-sm font-bold text-slate-700">
                    Click để tải ảnh/tài liệu hoặc kéo thả vào đây
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    Hỗ trợ: {accept === 'image/*' ? 'PNG, JPG, WEBP' : 'Các định dạng file phổ biến'} (Max {maxSizeMB}MB)
                </p>
            </div>

            {error && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                </p>
            )}
        </div>
    );
};

export default FileUpload;
