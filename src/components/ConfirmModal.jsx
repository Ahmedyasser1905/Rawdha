import React from 'react';
import { AlertCircle, X, Check, Trash2 } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'تأكيد الإجراء',
    message = 'هل أنت متأكد من القيام بهذا الإجراء؟',
    confirmText = 'تأكيد',
    cancelText = 'إلغاء',
    type = 'danger' // 'danger', 'info', 'warning'
}) => {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-red-200',
            btn: 'bg-red-500 hover:bg-red-600',
            icon: <Trash2 className="text-red-500" size={32} />
        },
        warning: {
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            border: 'border-amber-200',
            btn: 'bg-amber-500 hover:bg-amber-600',
            icon: <AlertCircle className="text-amber-500" size={32} />
        },
        info: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-200',
            btn: 'bg-blue-500 hover:bg-blue-600',
            icon: <Check className="text-blue-500" size={32} />
        }
    };

    const style = colors[type] || colors.danger;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-dark/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300 border-b-8 border-gray-100">
                <div className="p-8 text-center">
                    <div className={`w-20 h-20 ${style.bg} rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner`}>
                        {style.icon}
                    </div>

                    <h3 className="text-2xl font-black text-dark mb-4 font-fredoka">
                        {title}
                    </h3>

                    <p className="text-gray-500 font-bold leading-relaxed mb-8">
                        {message}
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 px-6 rounded-2xl bg-gray-100 text-gray-400 font-black hover:bg-gray-200 transition-all active:scale-95"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-4 px-6 rounded-2xl text-white font-black shadow-lg ${style.btn} transition-all active:scale-95 hover:shadow-xl`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>

                {/* Decoration */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default ConfirmModal;
