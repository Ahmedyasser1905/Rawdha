import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import {
    Users,
    GraduationCap,
    Layers,
    ChevronRight,
    ArrowRight,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminManageGroups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin_groups.php?action=list');
            setGroups(response.data.groups);
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const THEME_COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6'];

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-secondary font-fredoka flex items-center gap-2">
                    <Layers className="text-primary" /> إدارة الأفواج والأقسام
                </h1>
            </div>

            {loading ? <div className="text-center p-12 text-gray-400 font-bold">جاري تحميل البيانات...</div> :
                groups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {groups.map((g, i) => {
                            const color = THEME_COLORS[i % THEME_COLORS.length];
                            return (
                                <div key={g.name} className="glass-panel overflow-hidden group hover:scale-[1.02] transition-transform duration-300" style={{ borderBottom: `6px solid ${color}` }}>
                                    <div className="p-8">
                                        <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl mb-6 font-black text-2xl" style={{ backgroundColor: color }}>
                                            {g.name}
                                        </div>
                                        <h3 className="text-2xl font-bold text-dark mb-2">فوج {g.name}</h3>
                                        <p className="text-gray-400 text-sm flex items-center gap-1 mb-6">
                                            <Users size={14} /> المربية: <span className="text-dark font-bold">{g.teachers || 'بدون مربية'}</span>
                                        </p>

                                        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl mb-8">
                                            <div className="flex-1 text-center">
                                                <div className="text-xl font-black" style={{ color }}>{g.student_count}</div>
                                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">بطفل</div>
                                            </div>
                                            <div className="w-[1px] bg-gray-200"></div>
                                            <div className="flex-1 text-center">
                                                <div className="text-xl font-black text-dark">{g.teacher_count}</div>
                                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">مربية</div>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/admin/groups/${g.name}`}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: color }}
                                        >
                                            التفاصيل والحضور <ExternalLink size={16} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-panel p-20 text-center flex flex-col items-center gap-4 text-gray-400">
                        <Layers size={64} className="opacity-20" />
                        <p className="text-xl font-bold">لا يوجد أفواج نشطة حالياً.</p>
                        <p className="text-sm">قم بإضافة مربيات وتعيين أرقام أفواجهم من صفحة المستخدمين لتظهر هنا.</p>
                        <Link to="/admin/users" className="bg-primary text-white px-8 py-2 rounded-xl mt-4 font-bold shadow-md">إدارة المستخدمين</Link>
                    </div>
                )}
        </Layout>
    );
};

export default AdminManageGroups;
