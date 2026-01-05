import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ConfirmModal from '../components/ConfirmModal';
import api from '../services/api';
import {
    MessageSquare,
    Trash2,
    Send,
    Clock,
    Mail,
    Reply,
    User as UserIcon
} from 'lucide-react';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState({});
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin_actions.php?action=messages');
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.post('/admin_actions.php', { action: 'delete_message', message_id: id });
            fetchData();
        } catch (error) {
            alert('خطأ في الحذف');
        }
    };

    const handleReply = async (id) => {
        const text = replyText[id];
        if (!text) return;
        try {
            await api.post('/admin_actions.php', {
                action: 'reply_message',
                message_id: id,
                reply_text: text
            });
            setReplyText({ ...replyText, [id]: '' });
            fetchData();
        } catch (error) {
            alert('خطأ في إرسال الرد');
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-secondary font-fredoka flex items-center gap-2 mb-8">
                <MessageSquare className="text-primary" /> رسائل الزوار والتواصل
            </h1>

            {loading ? <div className="text-center p-12 text-gray-400 font-bold">جاري تحميل البيانات...</div> :
                messages.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8">
                        {messages.map(msg => (
                            <div key={msg.id} className="glass-panel p-8 relative group overflow-hidden">
                                <button
                                    onClick={() => setConfirmDelete({ open: true, id: msg.id })}
                                    className="absolute top-6 left-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={20} />
                                </button>

                                <div className="flex gap-6 items-start mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-400 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
                                        {(msg.name || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-dark">{msg.name}</h3>
                                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-400">
                                            <span className="flex items-center gap-1 font-mono"><Mail size={14} /> {msg.email}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {msg.created_at}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed mb-6 font-medium">
                                    {msg.message}
                                </div>

                                {msg.reply ? (
                                    <div className="bg-green-50/50 border-r-4 border-green-400 p-6 rounded-2xl">
                                        <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                                            <Reply size={18} /> رد الإدارة السابق:
                                        </div>
                                        <p className="text-green-800">{msg.reply}</p>
                                        <div className="text-[10px] text-green-600/50 mt-2">تاريخ الرد: {msg.replied_at}</div>
                                    </div>
                                ) : (
                                    <div className="flex gap-4 items-end animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="flex-grow">
                                            <label className="block text-xs font-bold text-gray-400 mb-2 px-1">كتابة رد لإرساله بالبريد الإلكتروني</label>
                                            <textarea
                                                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-secondary outline-none transition-all resize-none h-24"
                                                placeholder="أكتب ردك هنا بحرفية..."
                                                value={replyText[msg.id] || ''}
                                                onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <button
                                            onClick={() => handleReply(msg.id)}
                                            disabled={!replyText[msg.id]}
                                            className="bg-secondary text-white p-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 h-[88px] w-[88px] flex items-center justify-center mb-1"
                                        >
                                            <Send size={32} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-panel p-20 text-center text-gray-400">
                        لا يوجد رسائل تواصل حالياً.
                    </div>
                )}

            <ConfirmModal
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={() => handleDelete(confirmDelete.id)}
                title="حذف الرسالة"
                message="هل أنت متأكد من حذف هذه الرسالة نهائياً؟"
                confirmText="نعم، احذف"
                cancelText="تراجع"
            />
        </Layout>
    );
};

export default AdminMessages;
