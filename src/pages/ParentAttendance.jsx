import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import {
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    ArrowRight,
    BarChart3
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

const ParentAttendance = () => {
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('student_id');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!studentId) return;
            setLoading(true);
            try {
                const response = await api.get(`/parent_portal.php?action=attendance&student_id=${studentId}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId]);

    const getDayName = (dateStr) => {
        const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        return days[new Date(dateStr).getDay()];
    };

    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'present': return <span className="text-green-600 font-bold flex items-center gap-1 justify-end"><CheckCircle size={14} /> حاضر</span>;
            case 'absent': return <span className="text-red-600 font-bold flex items-center gap-1 justify-end"><XCircle size={14} /> غائب</span>;
            case 'late': return <span className="text-yellow-600 font-bold flex items-center gap-1 justify-end"><Clock size={14} /> متأخر</span>;
            default: return null;
        }
    };

    if (!studentId) return <Layout><div className="text-center p-12">يرجى اختيار طفل أولاً.</div></Layout>;

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-secondary font-fredoka flex items-center gap-2">
                    <Calendar className="text-primary" /> سجل الحضور: {data?.student_name}
                </h1>
                <Link to="/parent" className="text-gray-400 hover:text-primary flex items-center gap-1 font-bold">
                    العودة <ArrowRight size={18} className="rotate-180" />
                </Link>
            </div>

            {loading ? <div className="text-center p-12 text-gray-400">جاري التحميل...</div> : data && (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="glass-panel p-6 text-center">
                            <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                            <div className="text-2xl font-black">{data.stats.present || 0}</div>
                            <div className="text-sm text-gray-400 font-bold">أيام الحضور</div>
                        </div>
                        <div className="glass-panel p-6 text-center">
                            <XCircle size={32} className="mx-auto mb-2 text-red-500" />
                            <div className="text-2xl font-black">{data.stats.absent || 0}</div>
                            <div className="text-sm text-gray-400 font-bold">أيام الغياب</div>
                        </div>
                        <div className="glass-panel p-6 text-center">
                            <Clock size={32} className="mx-auto mb-2 text-yellow-500" />
                            <div className="text-2xl font-black">{data.stats.late || 0}</div>
                            <div className="text-sm text-gray-400 font-bold">أيام التأخير</div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="glass-panel overflow-hidden">
                        <div className="p-4 border-b bg-white/30 font-bold flex items-center gap-2">
                            <BarChart3 size={18} /> السجل التفصيلي (آخر 50 يوم)
                        </div>
                        <table className="w-full text-right">
                            <thead>
                                <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                                    <th className="p-4">التاريخ</th>
                                    <th className="p-4">اليوم</th>
                                    <th className="p-4 text-left">الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.history.length > 0 ? data.history.map((row, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-white transition-colors">
                                        <td className="p-4 font-mono">{row.date}</td>
                                        <td className="p-4 text-gray-400 text-sm">{getDayName(row.date)}</td>
                                        <td className="p-4"><StatusBadge status={row.status} /></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="p-12 text-center text-gray-400 italic">لا توجد سجلات حضور مسجلة.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </Layout>
    );
};

export default ParentAttendance;
