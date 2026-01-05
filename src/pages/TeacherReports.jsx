import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { FileText, Send, Smile, Coffee, Edit3, User } from 'lucide-react';

const TeacherReports = () => {
    const [students, setStudents] = useState([]);
    const [reports, setReports] = useState([]);
    const [formData, setFormData] = useState({
        student_id: '',
        activities: '',
        mood: 'سعيد',
        meals: 'أكمل وجبته'
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/reports.php');
            setStudents(response.data.students);
            setReports(response.data.reports);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/reports.php', formData);
            setMessage('✅ تم إرسال التقرير بنجاح!');
            setFormData({ student_id: '', activities: '', mood: 'سعيد', meals: 'أكمل وجبته' });
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ فشل في إرسال التقرير');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-secondary font-fredoka flex items-center gap-2 mb-8">
                <FileText className="text-primary" /> دفتر المراسلة اليومي
            </h1>

            {message && (
                <div className={`p-4 rounded-xl mb-6 text-center font-bold ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Form */}
                <div className="glass-panel p-8">
                    <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                        <Edit3 size={20} /> كتابة تقرير جديد
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">اختر الطفل</label>
                            <select
                                name="student_id"
                                className="w-full p-3 border rounded-xl"
                                value={formData.student_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- اختر الطفل --</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">نشاطات اليوم</label>
                            <textarea
                                name="activities"
                                rows="3"
                                className="w-full p-3 border rounded-xl"
                                placeholder="رسم، حفظ قرآن، ألعاب خارجية..."
                                value={formData.activities}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 flex items-center gap-1">
                                    <Smile size={16} className="text-accent" /> المزاج
                                </label>
                                <select
                                    name="mood"
                                    className="w-full p-3 border rounded-xl"
                                    value={formData.mood}
                                    onChange={handleChange}
                                >
                                    <option value="سعيد">😄 سعيد</option>
                                    <option value="هادئ">🙂 هادئ</option>
                                    <option value="عنيد">😤 عنيد</option>
                                    <option value="حزين">😢 حزين</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 flex items-center gap-1">
                                    <Coffee size={16} className="text-secondary" /> الوجبات
                                </label>
                                <select
                                    name="meals"
                                    className="w-full p-3 border rounded-xl"
                                    value={formData.meals}
                                    onChange={handleChange}
                                >
                                    <option value="أكمل وجبته">🍽️ أكمل وجبته</option>
                                    <option value="أكل القليل">🥣 أكل القليل</option>
                                    <option value="لم يأكل">❌ لم يأكل</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            <Send size={20} /> {submitting ? 'جاري الإرسال...' : 'إرسال التقرير للأولياء'}
                        </button>
                    </form>
                </div>

                {/* History/List (Simplified) */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-500 mb-4">تقارير اليوم الأخيرة</h3>
                    {loading ? (
                        <div className="text-center p-8">جاري التحميل...</div>
                    ) : reports.length > 0 ? (
                        reports.map(r => {
                            const student = students.find(s => s.id === r.student_id);
                            return (
                                <div key={r.id} className="glass-panel p-4 flex gap-4 border-r-4 border-secondary">
                                    <div className="bg-gray-100 p-2 rounded-lg h-fit">
                                        <User size={20} className="text-gray-400" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold">{student?.name || 'طفل'}</h4>
                                            <span className="text-[10px] text-gray-400">{r.report_date}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{r.activities}</p>
                                        <div className="mt-2 flex gap-3 text-xs font-bold">
                                            <span className="text-accent">{r.mood}</span>
                                            <span className="text-secondary">{r.meals}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center p-12 text-gray-400 border-2 border-dashed rounded-3xl">
                            لا يوجد تقارير مرسلة اليوم بعد.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default TeacherReports;
