import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import {
    DollarSign,
    TrendingUp,
    AlertCircle,
    History,
    Plus,
    Search,
    ArrowRight,
    Filter,
    CreditCard,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminFinance = () => {
    const [stats, setStats] = useState({ total_earnings: 0, todays_income: 0, unpaid_count: 0, pending_count: 0 });
    const [unpaidInvoices, setUnpaidInvoices] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectionData, setSelectionData] = useState({ students: [], parents: [] });
    const [formData, setFormData] = useState({ title: '', amount: '', parent_id: '', student_id: '' });

    const getAutoTitle = () => {
        const date = new Date();
        const months = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        return `رسوم شهر ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, invoicesRes, transRes, selectionRes] = await Promise.all([
                api.get('/finance.php?action=stats'),
                api.get('/finance.php?action=invoices&status=unpaid'),
                api.get('/finance.php?action=transactions'),
                api.get('/finance.php?action=selection_data')
            ]);
            setStats(statsRes.data);
            setUnpaidInvoices(invoicesRes.data.invoices);
            setTransactions(transRes.data.transactions);
            setSelectionData(selectionRes.data);
        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/finance.php', formData);
            setShowModal(false);
            setFormData({ title: '', amount: '', parent_id: '', student_id: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'خطأ في إنشاء الفاتورة');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (showModal && !formData.title) {
            setFormData(prev => ({ ...prev, title: getAutoTitle() }));
        }
    }, [showModal]);

    const formatCurrency = (val) => new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD' }).format(val);

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-secondary font-fredoka">المالية والمحاسبة</h1>
                <div className="flex gap-4">
                    {stats.pending_count > 0 && (
                        <Link to="/admin/approve-payments" className="bg-yellow-400 text-dark px-4 py-2 rounded-xl flex items-center gap-2 font-bold relative shadow-lg">
                            <AlertCircle size={20} />
                            طلبات معلقة
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 border-white">
                                {stats.pending_count}
                            </span>
                        </Link>
                    )}
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg"
                    >
                        <Plus size={20} />
                        إنشاء فاتورة جديدة
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 text-center">
                    <div className="flex justify-center mb-4"><div className="p-3 bg-green-100 text-green-500 rounded-full"><DollarSign size={24} /></div></div>
                    <div className="text-gray-500 text-sm mb-1">إجمالي المداخيل</div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.total_earnings)}</div>
                </div>
                <div className="glass-panel p-6 text-center">
                    <div className="flex justify-center mb-4"><div className="p-3 bg-yellow-100 text-yellow-500 rounded-full"><TrendingUp size={24} /></div></div>
                    <div className="text-gray-500 text-sm mb-1">مداخيل اليوم</div>
                    <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.todays_income)}</div>
                </div>
                <div className="glass-panel p-6 text-center">
                    <div className="flex justify-center mb-4"><div className="p-3 bg-red-100 text-red-500 rounded-full"><AlertCircle size={24} /></div></div>
                    <div className="text-gray-500 text-sm mb-1">فواتير غير مدفوعة</div>
                    <div className="text-2xl font-bold text-red-600">{stats.unpaid_count}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Unpaid Invoices */}
                <div className="glass-panel p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2"><AlertCircle className="text-red-500" /> فواتير غير مدفوعة</h3>
                        <Link to="/admin/invoices" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                            رؤية الكل <ArrowRight size={14} className="rotate-180" />
                        </Link>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {loading ? <p className="text-center text-gray-400 p-8">جاري التحميل...</p> :
                            unpaidInvoices.length > 0 ? unpaidInvoices.map(inv => (
                                <div key={inv.id} className="flex justify-between items-center p-4 bg-white/50 rounded-xl border border-white/50 hover:bg-white transition-colors">
                                    <div>
                                        <div className="font-bold">{inv.title}</div>
                                        <div className="text-xs text-gray-400">#{inv.id} | {inv.student_name} | {inv.created_at.split(' ')[0]}</div>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-primary">{formatCurrency(inv.amount)}</div>
                                        <span className="text-[10px] bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-bold">غير مدفوعة</span>
                                    </div>
                                </div>
                            )) : <p className="text-center text-gray-400 p-8">لا توجد فواتير معلقة!</p>}
                    </div>
                </div>

                {/* Transactions */}
                <div className="glass-panel p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2"><History className="text-secondary" /> أحدث العمليات</h3>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {loading ? <p className="text-center text-gray-400 p-8">جاري التحميل...</p> :
                            transactions.length > 0 ? transactions.map(t => (
                                <div key={t.id} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0">
                                    <div className="flex gap-3 items-center">
                                        <div className={`p-2 rounded-lg ${t.status === 'completed' ? 'bg-green-100 text-green-500' : 'bg-yellow-100 text-yellow-600'}`}>
                                            <CreditCard size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">{t.parent_name}</div>
                                            <div className="text-[10px] text-gray-400 font-mono uppercase">{t.transaction_id}</div>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold">{formatCurrency(t.amount)}</div>
                                        <div className="text-[10px] text-gray-400">{t.payment_date.split(' ')[0]}</div>
                                    </div>
                                </div>
                            )) : <p className="text-center text-gray-400 p-8">لا توجد عمليات مؤخراً.</p>}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden animate-in zoom-in duration-300 shadow-2xl">
                        <div className="p-6 bg-secondary text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2"><Plus /> إنشاء فاتورة جديدة</h3>
                            <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-1 rounded-full"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">عنوان الفاتورة</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border rounded-xl"
                                    placeholder="مثال: رسوم شهر جانفي 2024"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">المبلغ (DZD)</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 border rounded-xl"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">ولي الأمر</label>
                                    <select
                                        className="w-full p-3 border rounded-xl font-bold bg-white"
                                        value={formData.parent_id}
                                        onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                        required
                                    >
                                        <option value="">-- اختار الولي --</option>
                                        {selectionData.parents.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">الطفل المعني (اختياري)</label>
                                <select
                                    className="w-full p-3 border rounded-xl bg-white"
                                    value={formData.student_id}
                                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                                >
                                    <option value="">-- كل الأطفال (أو حدد طفل) --</option>
                                    {selectionData.students.filter(s => !formData.parent_id || s.parent_id == formData.parent_id).map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="w-full bg-secondary text-white py-4 rounded-xl font-extrabold shadow-lg hover:opacity-90 transition-opacity">
                                تأكيد وإنشاء الفاتورة
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdminFinance;
