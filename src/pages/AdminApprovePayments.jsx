import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ConfirmModal from '../components/ConfirmModal';
import api from '../services/api';
import {
    Receipt,
    CheckCircle,
    XCircle,
    ArrowRight,
    User,
    Hash,
    AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminApprovePayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmAction, setConfirmAction] = useState({ open: false, id: null, type: 'approve' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin_actions.php?action=pending_payments');
            setPayments(response.data.payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (id, actionType) => {
        try {
            await api.post('/admin_actions.php', {
                action: actionType === 'approve' ? 'approve_payment' : 'reject_payment',
                payment_id: id
            });
            fetchData();
        } catch (error) {
            alert('خطأ في معالجة الطلب');
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-secondary font-fredoka flex items-center gap-2">
                    <Receipt className="text-primary" /> طلبات الدفع النقدي
                </h1>
                <Link to="/admin/finance" className="text-gray-400 hover:text-primary flex items-center gap-1 font-bold">
                    العودة للمالية <ArrowRight size={18} className="rotate-180" />
                </Link>
            </div>

            {loading ? <div className="text-center p-12 text-gray-400 font-bold">جاري تحميل البيانات...</div> :
                payments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {payments.map(p => (
                            <div key={p.id} className="glass-panel p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl text-dark flex items-center gap-2">
                                            <User size={16} className="text-gray-400" /> {p.parent_name}
                                        </h4>
                                        <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                            <span className="flex items-center gap-1 font-bold">الفاتورة: {p.invoice_title}</span>
                                            <span className="flex items-center gap-1"><Hash size={14} /> Ref: {p.transaction_id}</span>
                                            <span className="flex items-center gap-1">🕒 {p.payment_date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-end gap-3 min-w-[200px]">
                                    <div className="text-2xl font-black text-primary">{Number(p.amount).toLocaleString()} د.ج</div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <button
                                            onClick={() => setConfirmAction({ open: true, id: p.id, type: 'approve' })}
                                            className="flex-1 md:flex-none px-6 py-2 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
                                        >
                                            <CheckCircle size={18} /> قبول
                                        </button>
                                        <button
                                            onClick={() => setConfirmAction({ open: true, id: p.id, type: 'reject' })}
                                            className="flex-1 md:flex-none px-6 py-2 bg-red-50 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                        >
                                            <XCircle size={18} /> رفض
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-panel p-20 text-center flex flex-col items-center gap-4 text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                            <Receipt size={40} className="opacity-20" />
                        </div>
                        <p className="text-xl font-bold">لا توجد طلبات معلقة حالياً.</p>
                        <p className="text-sm">سيتم عرض طلبات الدفع التي تتم نقداً من قبل الأولياء هنا للمصادقة عليها.</p>
                    </div>
                )}

            <ConfirmModal
                isOpen={confirmAction.open}
                onClose={() => setConfirmAction({ ...confirmAction, open: false })}
                onConfirm={() => handleAction(confirmAction.id, confirmAction.type)}
                type={confirmAction.type === 'approve' ? 'info' : 'danger'}
                title={confirmAction.type === 'approve' ? 'تأكيد القبول' : 'تأكيد الرفض'}
                message={confirmAction.type === 'approve' ? 'هل أنت متأكد من قبول هذا الدفع النقدي؟ سيتم تعليم الفاتورة كمدفوعة.' : 'هل أنت متأكد من رفض هذا الطلب؟'}
                confirmText={confirmAction.type === 'approve' ? 'نعم، قبول' : 'نعم، رفض'}
                cancelText="تراجع"
            />
        </Layout>
    );
};

export default AdminApprovePayments;
