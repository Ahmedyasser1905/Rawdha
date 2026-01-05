import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import {
    FileText,
    CreditCard,
    Banknote,
    CheckCircle,
    Clock,
    ShieldCheck,
    X,
    Lock
} from 'lucide-react';

const ParentInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/parent_portal.php?action=invoices');
            setInvoices(response.data.invoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePay = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await api.post('/parent_portal.php', {
                action: 'pay',
                invoice_id: selectedInvoice.id,
                payment_method: paymentMethod
            });
            setResult(response.data);
            fetchData();
        } catch (error) {
            alert('خطأ في معالجة الدفع');
        } finally {
            setSubmitting(false);
        }
    };

    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'paid': return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">مدفوعة</span>;
            case 'unpaid': return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">غير مدفوعة</span>;
            case 'pending': return <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold">قيد الانتظار</span>;
            default: return null;
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-secondary font-fredoka mb-8 flex items-center gap-2">
                <FileText className="text-primary" /> سجل الفواتير والمستحقات
            </h1>

            <div className="glass-panel overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b-2 border-gray-200">
                            <th className="p-4">رقم الفاتورة</th>
                            <th className="p-4">العنوان / الطفل</th>
                            <th className="p-4">التاريخ</th>
                            <th className="p-4">المبلغ</th>
                            <th className="p-4 text-center">الحالة</th>
                            <th className="p-4 text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="6" className="p-12 text-center text-gray-400">جاري التحميل...</td></tr> :
                            invoices.length > 0 ? invoices.map(inv => (
                                <tr key={inv.id} className="border-b border-gray-100 hover:bg-white/50 transition-colors">
                                    <td className="p-4 font-mono text-gray-400">#{inv.id}</td>
                                    <td className="p-4">
                                        <div className="font-bold">{inv.title}</div>
                                        <div className="text-xs text-secondary italic">{inv.student_name}</div>
                                    </td>
                                    <td className="p-4 text-gray-500">{inv.created_at.split(' ')[0]}</td>
                                    <td className="p-4 font-bold text-primary">{inv.amount} د.ج</td>
                                    <td className="p-4 text-center">
                                        <StatusBadge status={inv.status} />
                                    </td>
                                    <td className="p-4 text-center">
                                        {inv.status === 'unpaid' && (
                                            <button
                                                onClick={() => setSelectedInvoice(inv)}
                                                className="bg-accent text-dark px-4 py-1.5 rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-transform"
                                            >
                                                دفع الآن
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="6" className="p-12 text-center text-gray-400">لا يوجد فواتير مسجلة.</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Payment Modal */}
            {selectedInvoice && !result && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden relative animate-in fade-in zoom-in duration-300">
                        <button onClick={() => setSelectedInvoice(null)} className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full text-gray-400">
                            <X size={20} />
                        </button>
                        <div className="p-8 text-center border-b">
                            <h3 className="text-2xl font-bold mb-2">بوابة الدفع الإلكتروني</h3>
                            <p className="text-gray-500 italic">الفاتورة: {selectedInvoice.title}</p>
                            <div className="text-3xl font-bold text-primary mt-4">{selectedInvoice.amount} د.ج</div>
                        </div>
                        <div className="p-8">
                            <div className="flex gap-4 mb-8">
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400'}`}
                                >
                                    <CreditCard size={32} />
                                    <span className="font-bold">البطاقة الذهبية</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'cash' ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-100 text-gray-400'}`}
                                >
                                    <Banknote size={32} />
                                    <span className="font-bold">دفع نقدي</span>
                                </button>
                            </div>

                            <form onSubmit={handlePay}>
                                {paymentMethod === 'card' ? (
                                    <div className="space-y-4 mb-8">
                                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden mb-8">
                                            <div className="absolute top-0 right-0 p-4 opacity-20"><CreditCard size={100} /></div>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-8 bg-gray-200/50 rounded-md"></div>
                                                <div className="font-bold italic">EDAHEBIA</div>
                                            </div>
                                            <div className="text-xl font-mono tracking-[0.2em] mb-6">6280 00XX XXXX XXXX</div>
                                            <div className="flex justify-between text-xs opacity-80 uppercase">
                                                <div>حامل البطاقة</div>
                                                <div>صالح إلى</div>
                                            </div>
                                            <div className="flex justify-between font-bold">
                                                <div>PARENT NAME</div>
                                                <div>12/28</div>
                                            </div>
                                        </div>
                                        <input type="text" placeholder="رقم البطاقة (16 رقم)" className="w-full p-3 border rounded-xl font-mono text-center tracking-widest" maxLength="19" required />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="MM/YY" className="p-3 border rounded-xl text-center" required />
                                            <input type="password" placeholder="CVV" className="p-3 border rounded-xl text-center" required />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 border-2 border-dashed border-green-200 p-6 rounded-2xl text-center mb-8">
                                        <h4 className="text-green-700 font-bold mb-2">الدفع في مقر الحضانة</h4>
                                        <p className="text-sm text-green-600">سيتم تسجيل طلبك كـ "دفع معلق". يرجى التقدم لمقر الحضانة مع المبلغ لإكمال العملية.</p>
                                    </div>
                                )}
                                <button
                                    disabled={submitting}
                                    className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-white transition-all ${paymentMethod === 'card' ? 'bg-primary hover:bg-primary/90' : 'bg-green-500 hover:bg-green-600'}`}
                                >
                                    <Lock size={18} /> {submitting ? 'جاري المعالجة...' : paymentMethod === 'card' ? 'دفع آمن للآن' : 'تأكيد طلب الدفع النقدي'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {result && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center animate-in zoom-in duration-300">
                        {result.payment_method === 'card' ? (
                            <>
                                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <CheckCircle size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-dark mb-2">تم الدفع بنجاح!</h3>
                                <p className="text-gray-500 mb-6">شكراً لك. تم تأكيد عملية الدفع عبر البطاقة الذهبية.</p>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <Clock size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-dark mb-2">طلب دفع معلق</h3>
                                <p className="text-gray-500 mb-6">تم تسجيل طلب الدفع بنجاح. يرجى التوجه للمقر لإتمام العملية.</p>
                            </>
                        )}
                        <div className="bg-gray-100 p-3 rounded-xl font-mono text-sm text-gray-500 mb-8 select-all">
                            ID: {result.transaction_id}
                        </div>
                        <button
                            onClick={() => { setResult(null); setSelectedInvoice(null); }}
                            className="bg-primary text-white w-full py-3 rounded-xl font-bold"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ParentInvoices;
