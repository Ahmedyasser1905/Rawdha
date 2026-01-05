import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ConfirmModal from '../components/ConfirmModal';
import api from '../services/api';
import {
    ClipboardList,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Phone,
    Baby,
    Calendar,
    X,
    Shield
} from 'lucide-react';

const AdminRegistrationRequests = () => {
    const [requests, setRequests] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
    const [conversionData, setConversionData] = useState({ open: false, request: null });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin_actions.php?action=registration_requests');
            setRequests(response.data.requests || []);
            setGroups(response.data.groups || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.post('/admin_actions.php', { action: 'delete_registration_request', request_id: id });
            fetchData();
        } catch (error) {
            alert('خطأ في الحذف');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        if (status === 'approved') {
            const req = requests.find(r => r.id === id);
            setConversionData({
                open: true,
                request: req,
                formData: {
                    user: {
                        full_name: req.parent_name,
                        username: req.phone,
                        password: 'parent' + req.id
                    },
                    student: {
                        name: req.child_name,
                        dob: '',
                        gender: 'male',
                        group_name: ''
                    }
                }
            });
            return;
        }

        try {
            await api.post('/admin_actions.php', {
                action: 'update_registration_status',
                request_id: id,
                status: status
            });
            fetchData();
        } catch (error) {
            alert('خطأ في تحديث الحالة');
        }
    };

    const handleConvert = async (e) => {
        e.preventDefault();

        // Calculate age from DOB
        const birthDate = new Date(conversionData.formData.student.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age > 5) {
            alert('عذراً، لا يمكن تسجيل طفل يتجاوز عمره 5 سنوات.');
            return;
        }

        try {
            await api.post('/admin_actions.php', {
                action: 'convert_request',
                request_id: conversionData.request.id,
                user_data: conversionData.formData.user,
                student_data: conversionData.formData.student
            });
            setConversionData({ open: false, request: null });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'خطأ في التحويل');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'approved': return 'مقبول / تم التسجيل';
            case 'rejected': return 'مرفوض';
            default: return 'قيد الانتظار';
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-secondary font-fredoka flex items-center gap-2 mb-8">
                <ClipboardList className="text-primary" /> طلبات التسجيل الجديدة
            </h1>

            {loading ? (
                <div className="text-center p-12 text-gray-400 font-bold">جاري تحميل البيانات...</div>
            ) : requests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {requests.map(req => (
                        <div key={req.id} className="glass-panel p-6 relative group overflow-hidden border border-gray-100 hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`px-4 py-1 rounded-full text-xs font-black border ${getStatusStyle(req.status)}`}>
                                    {getStatusLabel(req.status)}
                                </div>
                                <div className="flex gap-2">
                                    {req.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(req.id, 'approved')}
                                                className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all"
                                                title="قبول وإنشاء حساب"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(req.id, 'rejected')}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="رفض"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setConfirmDelete({ open: true, id: req.id })}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">ولي الأمر</div>
                                        <div className="font-bold text-dark">{req.parent_name}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                        <Baby size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">الطفل</div>
                                        <div className="font-bold text-dark">{req.child_name} ({req.child_age})</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">رقم الهاتف</div>
                                        <div className="font-bold text-dark">{req.phone}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-gray-50 text-gray-400 text-xs text-left" dir="ltr">
                                    <Clock size={14} />
                                    <span>{new Date(req.created_at).toLocaleString('ar-DZ')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-20 glass-panel">
                    <ClipboardList size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold">لا يوجد طلبات تسجيل حالياً</p>
                </div>
            )}

            {/* Conversion Modal */}
            {conversionData.open && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" onClick={() => setConversionData({ open: false, request: null })}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
                        <div className="bg-primary p-8 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Shield size={24} />
                                <h3 className="text-2xl font-black font-fredoka">إتمام تسجيل الطفل وإنشاء الحساب</h3>
                            </div>
                            <button onClick={() => setConversionData({ open: false, request: null })} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleConvert} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase">اسم المستخدم (ولي الأمر)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:border-primary transition-all outline-none font-bold"
                                        value={conversionData.formData.user.username}
                                        onChange={(e) => setConversionData({
                                            ...conversionData,
                                            formData: {
                                                ...conversionData.formData,
                                                user: { ...conversionData.formData.user, username: e.target.value }
                                            }
                                        })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase">كلمة المرور</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:border-primary transition-all outline-none font-bold"
                                        value={conversionData.formData.user.password}
                                        onChange={(e) => setConversionData({
                                            ...conversionData,
                                            formData: {
                                                ...conversionData.formData,
                                                user: { ...conversionData.formData.user, password: e.target.value }
                                            }
                                        })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase">تاريخ ميلاد الطفل</label>
                                    <input
                                        type="date"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:border-primary transition-all outline-none font-bold"
                                        value={conversionData.formData.student.dob}
                                        onChange={(e) => setConversionData({
                                            ...conversionData,
                                            formData: {
                                                ...conversionData.formData,
                                                student: { ...conversionData.formData.student, dob: e.target.value }
                                            }
                                        })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase">الجنس</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:border-primary transition-all outline-none font-bold"
                                        value={conversionData.formData.student.gender}
                                        onChange={(e) => setConversionData({
                                            ...conversionData,
                                            formData: {
                                                ...conversionData.formData,
                                                student: { ...conversionData.formData.student, gender: e.target.value }
                                            }
                                        })}
                                        required
                                    >
                                        <option value="male">ذكر</option>
                                        <option value="female">أنثى</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase">تعيين للفوج</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:border-primary transition-all outline-none font-bold"
                                    value={conversionData.formData.student.group_name}
                                    onChange={(e) => setConversionData({
                                        ...conversionData,
                                        formData: {
                                            ...conversionData.formData,
                                            student: { ...conversionData.formData.student, group_name: e.target.value }
                                        }
                                    })}
                                    required
                                >
                                    <option value="">اختر الفوج</option>
                                    {groups.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                                {groups.length === 0 && (
                                    <p className="text-xs text-red-500 font-bold mt-1">
                                        لم يتم العثور على أفواج. يرجى إضافة مربيات وتعيين أفواج لهن في "إدارة المستخدمين" أولاً.
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                            >
                                تأكيد الإنشاء والقبول
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={() => handleDelete(confirmDelete.id)}
                title="حذف طلب التسجيل"
                message="هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟"
                confirmText="نعم، حذف"
                cancelText="تراجع"
            />
        </Layout>
    );
};

export default AdminRegistrationRequests;
