import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import {
    Calendar,
    ChevronRight,
    CheckCircle,
    XCircle,
    Clock,
    Users,
    GraduationCap,
    ArrowRight
} from 'lucide-react';

const AdminGroupDetails = () => {
    const { name } = useParams();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [data, setData] = useState({ students: [], attendance: {} });
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin_groups.php', {
                params: { action: 'details', group: name, date }
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching group details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [name, date]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'present': return <CheckCircle className="text-green-500" size={18} />;
            case 'absent': return <XCircle className="text-red-500" size={18} />;
            case 'late': return <Clock className="text-yellow-500" size={18} />;
            default: return <div className="w-[18px] h-[18px] rounded-full border-2 border-dashed border-gray-300"></div>;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'present': return 'حاضر';
            case 'absent': return 'غائب';
            case 'late': return 'متأخر';
            default: return 'لم يسجل';
        }
    };

    const stats = {
        total: data.students.length,
        present: Object.values(data.attendance).filter(s => s === 'present').length,
        absent: Object.values(data.attendance).filter(s => s === 'absent').length,
        pending: data.students.length - Object.keys(data.attendance).length
    };

    return (
        <Layout>
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Link to="/admin/groups" className="hover:text-primary transition-colors">الأفواج</Link>
                    <ChevronRight size={14} />
                    <span className="text-secondary font-bold">تفاصيل فوج {name}</span>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-6">
                    <h1 className="text-3xl font-bold text-secondary font-fredoka flex items-center gap-3">
                        <Users className="text-primary" /> سجل حضور فوج {name}
                    </h1>

                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <Calendar size={20} className="text-primary mr-2" />
                        <input
                            type="date"
                            className="outline-none font-bold text-dark bg-transparent"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="glass-panel p-6 text-center border-b-4 border-blue-400">
                    <div className="text-3xl font-black text-blue-500 mb-1">{stats.total}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">إجمالي الأطفال</div>
                </div>
                <div className="glass-panel p-6 text-center border-b-4 border-green-400">
                    <div className="text-3xl font-black text-green-500 mb-1">{stats.present}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">حضور</div>
                </div>
                <div className="glass-panel p-6 text-center border-b-4 border-red-400">
                    <div className="text-3xl font-black text-red-500 mb-1">{stats.absent}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">غياب</div>
                </div>
                <div className="glass-panel p-6 text-center border-b-4 border-yellow-400">
                    <div className="text-3xl font-black text-yellow-500 mb-1">{stats.pending}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">لم يسجل بعد</div>
                </div>
            </div>

            {/* Students List */}
            <div className="glass-panel overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-dark flex items-center gap-2">
                        <GraduationCap size={20} className="text-secondary" /> قائمة أطفال الفوج
                    </h3>
                    <div className="text-xs text-gray-400 font-bold">
                        تاريخ السجل: <span className="text-dark">{date}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 text-center text-gray-400 font-bold">جاري تحميل سجل الحضور...</div>
                ) : data.students.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {data.students.map(student => {
                            const status = data.attendance[student.id];
                            return (
                                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-md ${student.gender === 'female' ? 'bg-pink-300' : 'bg-blue-300'}`}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-dark">{student.name}</div>
                                            <div className="text-xs text-gray-400">كود الطفل: #{student.id}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm min-w-[140px] justify-center">
                                        {getStatusIcon(status)}
                                        <span className={`text-sm font-bold ${status ? 'text-dark' : 'text-gray-300'}`}>
                                            {getStatusLabel(status)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-20 text-center text-gray-400">
                        <p className="text-lg font-bold">لا يوجد أطفال في هذا الفوج حالياً.</p>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <Link to="/admin/groups" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    <ArrowRight size={20} /> العودة لقائمة الأفواج
                </Link>
            </div>
        </Layout>
    );
};

export default AdminGroupDetails;
