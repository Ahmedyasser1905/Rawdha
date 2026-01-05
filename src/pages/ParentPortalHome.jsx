import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import {
    Baby,
    Calendar,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    ArrowRight,
    AlertTriangle,
    Star,
    Utensils,
    Smile
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ParentPortalHome = () => {
    const [data, setData] = useState({ children: [], unpaid_count: 0 });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/parent_portal.php?action=dashboard');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching parent portal data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'present': return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> حاضر اليوم</span>;
            case 'absent': return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={14} /> غائب اليوم</span>;
            case 'late': return <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={14} /> متأخر اليوم</span>;
            default: return <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">لم يسجل بعد</span>;
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-primary font-fredoka mb-8 border-b-4 border-accent inline-block pb-2">متابعة أطفالي</h1>

            {data.unpaid_count > 0 && (
                <div className="bg-red-50 border border-red-200 p-6 rounded-2xl mb-8 flex justify-between items-center animate-pulse shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-400 text-white rounded-full flex items-center justify-center shadow-lg">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h4 className="text-red-700 font-bold text-lg">فواتير جديدة تحتاج للدفع</h4>
                            <p className="text-red-600/70 text-sm">يوجد لديك {data.unpaid_count} فاتورة مستحقة لم يتم دفعها بعد.</p>
                        </div>
                    </div>
                    <Link to="/parent/invoices" className="bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-red-600 transition-colors flex items-center gap-2">
                        عرض الفواتير <ArrowRight size={18} className="rotate-180" />
                    </Link>
                </div>
            )}

            {loading ? <div className="text-center p-12">جاري التحميل...</div> : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {data.children.length > 0 ? data.children.map(kid => (
                        <div key={kid.id} className="glass-panel p-8 relative overflow-hidden">
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent opacity-20 rounded-full"></div>

                            <div className="flex items-center gap-6 mb-8 relative z-10">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl text-3xl ${kid.gender === 'female' ? 'bg-gradient-to-br from-pink-400 to-pink-200' : 'bg-gradient-to-br from-blue-400 to-blue-200'}`}>
                                    <Baby size={32} />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-2xl font-bold text-dark font-fredoka">{kid.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        الفوج: {kid.group_name || 'غير محدد'} | العمر: {new Date().getFullYear() - new Date(kid.dob).getFullYear()} سنوات
                                    </p>
                                </div>
                                <StatusBadge status={kid.today_attendance} />
                            </div>

                            <Link to={`/parent/attendance?student_id=${kid.id}`} className="text-primary text-sm font-bold border border-primary px-4 py-1.5 rounded-lg inline-flex items-center gap-2 mb-8 hover:bg-primary/5 transition-colors">
                                <Calendar size={16} /> سجل الحضور الكامل
                            </Link>

                            {/* Today's Report */}
                            {kid.today_report ? (
                                <div className="bg-pink-50/50 p-6 rounded-2xl border-2 border-dashed border-pink-200">
                                    <h4 className="text-pink-600 font-bold mb-4 flex items-center gap-2"><Star size={18} fill="currentColor" /> تقرير اليوم</h4>
                                    <div className="text-gray-700 mb-4 bg-white/50 p-3 rounded-xl border border-white">
                                        <span className="font-bold text-pink-600 block mb-1">النشاطات:</span>
                                        {kid.today_report.activities}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-xl border border-pink-100 flex items-center gap-2 text-sm">
                                            <Smile size={16} className="text-accent" /> <strong>المزاج:</strong> {kid.today_report.mood}
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-pink-100 flex items-center gap-2 text-sm">
                                            <Utensils size={16} className="text-secondary" /> <strong>الأكل:</strong> {kid.today_report.meals}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-8 rounded-2xl text-center text-gray-400 flex flex-col items-center gap-2">
                                    <Clock size={32} opacity={0.3} />
                                    لم يتم إضافة تقرير اليوم بعد.
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="lg:col-span-2 glass-panel p-16 text-center text-gray-400">
                            <Baby size={64} className="mx-auto mb-4 opacity-20" />
                            لا يوجد أطفال مسجلين باسمك حالياً. يرجى مراجعة إدارة الروضة.
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default ParentPortalHome;
