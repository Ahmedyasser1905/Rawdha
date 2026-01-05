import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import {
    FileText,
    Search,
    Calendar,
    Layers,
    User,
    Smile,
    Coffee,
    ClipboardList,
    ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [groups, setGroups] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [groupFilter, setGroupFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await api.get('/reports.php', {
                params: { date, group: groupFilter }
            });
            setReports(response.data.reports || []);
            setGroups(response.data.groups || []);
        } catch (error) {
            console.error('Error fetching admin reports:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [date, groupFilter]);

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-secondary font-fredoka flex items-center gap-2">
                    <ClipboardList className="text-primary" /> تقارير جميع الأقسام
                </h1>
                <Link
                    to="/admin"
                    className="flex items-center gap-1 text-gray-500 hover:text-primary font-bold transition-colors"
                >
                    <ChevronLeft size={20} /> العودة للرئيسية
                </Link>
            </div>

            {/* Filters */}
            <div className="glass-panel p-6 mb-8 flex flex-wrap gap-6 items-center border-b-4 border-primary">
                <div className="flex flex-col gap-2 flex-grow min-w-[200px]">
                    <label className="text-sm font-bold text-gray-500 flex items-center gap-1">
                        <Calendar size={16} /> التاريخ
                    </label>
                    <input
                        type="date"
                        className="p-3 border rounded-xl bg-white font-bold"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2 flex-grow min-w-[200px]">
                    <label className="text-sm font-bold text-gray-500 flex items-center gap-1">
                        <Layers size={16} /> المجموعات / الأفواج
                    </label>
                    <select
                        className="p-3 border rounded-xl bg-white font-bold"
                        value={groupFilter}
                        onChange={(e) => setGroupFilter(e.target.value)}
                    >
                        <option value="">كل الأفواج</option>
                        {groups.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={fetchReports}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold mt-auto h-[52px] shadow-lg hover:scale-105 transition-transform"
                >
                    تحديث
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold">إجمالي التقارير</p>
                        <p className="text-2xl font-black text-dark">{reports.length}</p>
                    </div>
                </div>
                {/* Add more stats if needed */}
            </div>

            {/* Reports List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center p-12 text-gray-400 font-bold">جاري تحميل التقارير...</div>
                ) : reports.length > 0 ? (
                    reports.map(r => (
                        <div key={r.id} className="glass-panel p-6 flex flex-col relative group hover:shadow-xl transition-all border-r-4 border-accent">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg text-dark flex items-center gap-2">
                                        <User size={18} className="text-secondary" /> {r.student_name}
                                    </h4>
                                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                        الفوج: <span className="text-primary">{r.group_name}</span>
                                    </p>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-500 font-mono`}>
                                    #{r.id}
                                </span>
                            </div>

                            <div className="bg-gray-50/50 p-3 rounded-xl mb-4 border border-gray-100">
                                <p className="text-sm text-gray-600 leading-relaxed font-bold italic">
                                    "{r.activities}"
                                </p>
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold bg-white p-2 rounded-lg border border-gray-100">
                                    <Smile size={14} className="text-accent" />
                                    <span>{r.mood}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold bg-white p-2 rounded-lg border border-gray-100">
                                    <Coffee size={14} className="text-secondary" />
                                    <span>{r.meals}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-[10px] text-gray-400">بواسطة: {r.nanny_name}</span>
                                <span className="text-[10px] text-gray-300">{r.report_date}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center p-20 text-gray-400 bg-white/50 rounded-3xl border-2 border-dashed">
                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-xl font-bold">لا يوجد تقارير مرسلة لهذا اليوم أو هذا الفوج.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminReports;
