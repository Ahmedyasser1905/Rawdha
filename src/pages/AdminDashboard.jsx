import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import {
    Users,
    Baby,
    GraduationCap,
    AlertCircle,
    TrendingUp,
    Plus,
    Clock,
    ArrowRight,
    TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell,
    PieChart, Pie
} from 'recharts';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/admin_dashboard.php');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !data) return <Layout><div className="flex items-center justify-center h-[200px] text-gray-500 font-bold">جاري تحميل البيانات...</div></Layout>;

    const COLORS = ['#0984e3', '#ff78b0', '#00cec9', '#fab1a0', '#6c5ce7'];

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-fredoka text-dark">لوحة القيادة</h1>
                    <p className="text-gray-400 mt-1">نظرة عامة على نشاط الروضة اليوم</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/admin/finance" className="bg-white border-2 border-gray-100 p-2 rounded-xl text-gray-400 hover:text-primary transition-colors">
                        {new Date().toLocaleDateString('ar-DZ')}
                    </Link>
                </div>
            </div>

            {/* Alerts */}
            <div className="flex flex-col gap-4 mb-8">
                {data.stats.pending_payments > 0 && (
                    <Link to="/admin/finance" className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex justify-between items-center group">
                        <div className="flex items-center gap-3 text-orange-700 font-bold">
                            <AlertCircle className="group-hover:animate-bounce" />
                            يوجد {data.stats.pending_payments} طلب دفع نقدي معلق يحتاج للمراجعة.
                        </div>
                        <ArrowRight size={20} className="text-orange-400 rotate-180" />
                    </Link>
                )}
                {data.stats.unpaid_invoices > 0 && (
                    <Link to="/admin/finance" className="bg-red-50 border border-red-200 p-4 rounded-2xl flex justify-between items-center group">
                        <div className="flex items-center gap-3 text-red-700 font-bold">
                            <AlertCircle className="group-hover:animate-bounce" />
                            يوجد {data.stats.unpaid_invoices} فاتورة غير مدفوعة تحتاج للمتابعة.
                        </div>
                        <ArrowRight size={20} className="text-red-400 rotate-180" />
                    </Link>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Users size={80} /></div>
                    <div className="text-gray-400 text-sm mb-1">عدد المربيات</div>
                    <div className="text-3xl font-black text-secondary">{data.stats.teachers}</div>
                </div>
                <div className="glass-panel p-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Baby size={80} /></div>
                    <div className="text-gray-400 text-sm mb-1">عدد الأطفال</div>
                    <div className="text-3xl font-black text-accent">{data.stats.students}</div>
                </div>
                <div className="glass-panel p-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><GraduationCap size={80} /></div>
                    <div className="text-gray-400 text-sm mb-1">عدد الأولياء</div>
                    <div className="text-3xl font-black text-primary">{data.stats.parents}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Income Area Chart */}
                <div className="glass-panel p-8 min-h-[400px]">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <TrendingUp className="text-green-500" /> تحليل المداخيل (آخر 6 أشهر)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.income_history}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="total" stroke="#6c5ce7" fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Charts */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="glass-panel p-6 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 text-center md:text-right">
                            <h3 className="text-lg font-bold mb-4">توزيع الأطفال حسب الفوج</h3>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.group_distribution}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#00cec9" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel p-6 flex items-center gap-8 overflow-hidden">
                        <div className="w-1/2">
                            <h3 className="text-lg font-bold mb-4">توزيع الجنس</h3>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie
                                        data={data.gender_distribution}
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.gender_distribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-4">
                            {data.gender_distribution.map((d, i) => (
                                <div key={d.name} className="flex justify-between items-center text-sm">
                                    <span className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full`} style={{ background: COLORS[i] }}></div> {d.name === 'male' ? 'ذكور' : 'إناث'}</span>
                                    <span className="font-bold">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="glass-panel p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Clock /> أحدث المسجلين</h3>
                    <div className="space-y-4">
                        {data.recent_users.map((u, i) => (
                            <div key={i} className="flex justify-between items-center p-3 border-b last:border-0 hover:bg-gray-50 transition-colors rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">{u.full_name.charAt(0)}</div>
                                    <div>
                                        <div className="font-bold text-sm">{u.full_name}</div>
                                        <div className="text-[10px] bg-gray-100 px-2 rounded-full inline-block uppercase">{u.role}</div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-gray-400">{u.created_at.split(' ')[0]}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-panel p-8 bg-gradient-to-br from-primary to-blue-600 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12"><Plus size={150} /></div>
                    <h3 className="text-xl font-bold mb-8 relative z-10 flex items-center gap-2"><TrendingUp /> إجراءات سريعة</h3>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <Link to="/admin/users" className="bg-white/20 backdrop-blur-md p-6 rounded-2xl hover:bg-white/30 transition-all flex flex-col items-center gap-3">
                            <Plus size={32} />
                            <span className="font-bold text-sm">إضافة مستخدم</span>
                        </Link>
                        <Link to="/admin/students" className="bg-white/20 backdrop-blur-md p-6 rounded-2xl hover:bg-white/30 transition-all flex flex-col items-center gap-3">
                            <Baby size={32} />
                            <span className="font-bold text-sm">إضافة طفل</span>
                        </Link>
                        <Link to="/admin/finance" className="bg-white/20 backdrop-blur-md p-6 rounded-2xl hover:bg-white/30 transition-all flex flex-col items-center gap-3">
                            <TrendingUp size={32} />
                            <span className="font-bold text-sm">تقرير مالي</span>
                        </Link>
                        <Link to="/admin/reports" className="bg-white/20 backdrop-blur-md p-6 rounded-2xl hover:bg-white/30 transition-all flex flex-col items-center gap-3">
                            <GraduationCap size={32} />
                            <span className="font-bold text-sm">التقارير</span>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
