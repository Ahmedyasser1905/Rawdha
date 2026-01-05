import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Calendar, CheckCircle, XCircle, Clock, Save, User } from 'lucide-react';

const TeacherAttendance = () => {
    const [students, setStudents] = useState([]);
    const [statuses, setStatuses] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/attendance.php', { params: { date } });
            setStudents(response.data.students);
            // Initialize or set existing statuses
            const initialStatuses = {};
            response.data.students.forEach(s => {
                initialStatuses[s.id] = response.data.attendance[s.id] || 'present';
            });
            setStatuses(initialStatuses);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [date]);

    const handleStatusChange = (studentId, status) => {
        setStatuses(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/attendance.php', { date, statuses });
            setMessage('✅ تم حفظ الحضور بنجاح!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ فشل في حفظ الحضور');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-secondary font-fredoka flex items-center gap-2">
                        <Calendar className="text-primary" /> تسجيل الحضور اليومي
                    </h1>
                    <p className="text-gray-500 mt-1">تاريخ: {date}</p>
                </div>
                <div className="flex gap-4 items-center">
                    <input
                        type="date"
                        className="p-2 border rounded-xl"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? 'جاري الحفظ...' : 'حفظ القائمة'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl mb-6 text-center font-bold shadow-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <div className="glass-panel overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b-2 border-gray-200">
                            <th className="p-4">الطفل</th>
                            <th className="p-4">العمر</th>
                            <th className="p-4 text-center">الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="p-12 text-center text-gray-500">جاري التحميل...</td></tr>
                        ) : students.length > 0 ? (
                            students.map(s => (
                                <tr key={s.id} className="border-b border-gray-100 hover:bg-white/50 transition-colors">
                                    <td className="p-4 font-bold flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${s.gender === 'female' ? 'bg-pink-100 text-pink-500' : 'bg-blue-100 text-blue-500'}`}>
                                            <User size={18} />
                                        </div>
                                        {s.name}
                                    </td>
                                    <td className="p-4 text-gray-400">
                                        {s.dob ? `${new Date().getFullYear() - new Date(s.dob).getFullYear()} سنوات` : '--'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={() => handleStatusChange(s.id, 'present')}
                                                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all ${statuses[s.id] === 'present' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-500'}`}
                                            >
                                                <CheckCircle size={16} /> حاضر
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(s.id, 'absent')}
                                                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all ${statuses[s.id] === 'absent' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-700'}`}
                                            >
                                                <XCircle size={16} /> غائب
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(s.id, 'late')}
                                                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all ${statuses[s.id] === 'late' ? 'bg-yellow-400 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600'}`}
                                            >
                                                <Clock size={16} /> متأخر
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3" className="p-12 text-center text-gray-500">لا يوجد أطفال في فوجكِ</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default TeacherAttendance;
