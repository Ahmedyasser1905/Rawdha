import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ConfirmModal from '../components/ConfirmModal';
import api from '../services/api';
import {
    Search,
    Edit,
    Calendar,
    User,
    Baby,
    Plus,
    X,
    Trash2,
    Info,
    ChevronDown,
    GraduationCap,
    Tags
} from 'lucide-react';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [parents, setParents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        parent_id: '',
        dob: '',
        group_name: '',
        gender: 'male',
        medical_history: '',
        allergies: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/students.php', { params: { search } });
            setStudents(response.data.students);
            setParents(response.data.parents);
            setGroups(response.data.groups);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (student) => {
        setFormData({
            name: student.name,
            parent_id: student.parent_id,
            dob: student.dob,
            group_name: student.group_name || '',
            gender: student.gender,
            medical_history: student.medical_history || '',
            allergies: student.allergies || ''
        });
        setEditingId(student.id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/students.php?id=${id}`);
            fetchData();
        } catch (error) {
            alert('خطأ في حذف الطفل');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple year-based age calculation as requested
        const birthDate = new Date(formData.dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < 2 || age > 5) {
            alert(`خطأ: عمر الطفل يجب أن يكون بين سنتين و 5 سنوات فقط (بناءً على سنة الميلاد).\nالعمر الحالي: ${age} سنة.`);
            return;
        }

        try {
            if (editingId) {
                await api.put('/students.php', { ...formData, id: editingId });
            } else {
                await api.post('/students.php', formData);
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ name: '', parent_id: '', dob: '', group_name: '', gender: 'male', medical_history: '', allergies: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'خطأ في الحفظ');
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-secondary font-fredoka flex items-center gap-2">
                    <GraduationCap className="text-secondary" /> إدارة ملفات الأطفال
                </h1>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', parent_id: '', dob: '', group_name: '', gender: 'male', medical_history: '', allergies: '' });
                        setShowModal(true);
                    }}
                    className="bg-accent text-dark px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:rotate-1 transition-transform"
                >
                    <Plus size={20} />
                    إضافة طفل جديد
                </button>
            </div>

            <div className="glass-panel p-4 mb-8 flex gap-4 items-center">
                <div className="relative flex-grow">
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        className="w-full p-2 pr-10 border rounded-xl"
                        placeholder="ابحث عن اسم الطفل..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchData()}
                    />
                </div>
                <button onClick={fetchData} className="bg-primary text-white px-8 py-2 rounded-xl font-bold hover:scale-105 transition-transform">بحث</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? <div className="col-span-full text-center p-12 text-gray-400 font-bold">جاري تحميل البيانات...</div> :
                    students.length > 0 ? students.map(s => (
                        <div key={s.id} className="glass-panel p-6 flex items-start gap-4 relative group">
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${s.gender === 'female' ? 'bg-pink-400' : 'bg-blue-400'}`}></div>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl ${s.gender === 'female' ? 'bg-gradient-to-br from-pink-400 to-pink-200' : 'bg-gradient-to-br from-blue-400 to-blue-200'}`}>
                                <Baby size={32} />
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-xl text-dark">{s.name}</h4>
                                    {s.medical_history && <span className="p-1 bg-red-100 text-red-500 rounded-lg" title="تنبيه طبي"><Info size={14} /></span>}
                                </div>
                                <div className="text-xs text-gray-500 space-y-1 mb-4">
                                    <div className="flex items-center gap-1"><Calendar size={14} className="text-secondary" /> {s.dob} ({new Date().getFullYear() - new Date(s.dob).getFullYear()} سنوات)</div>
                                    <div className="flex items-center gap-1"><User size={14} className="text-primary" /> الولي: <span className="font-bold">{s.parent_name}</span></div>
                                    <div className={`flex items-center gap-1 font-bold ${s.group_name ? 'text-accent' : 'text-gray-300'}`}>
                                        <Tags size={14} /> الفوج: {s.group_name || 'غير محدد'}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(s)}
                                        className="flex-grow bg-white border border-gray-100 hover:bg-gray-50 text-secondary p-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <Edit size={14} /> تعديل
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete({ open: true, id: s.id })}
                                        className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-400 hover:text-white transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-[10px] text-gray-300 font-mono">
                                ID: #{s.id}
                            </div>
                        </div>
                    )) : <div className="col-span-full text-center p-12 text-gray-400">لا يوجد أطفال مسجلين.</div>}
            </div>

            {/* Add Student Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-dark/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500 my-8">
                        <div className="bg-gradient-to-r from-secondary to-blue-600 p-8 text-white relative">
                            <h3 className="text-2xl font-bold flex items-center gap-3"><Baby size={32} /> {editingId ? 'تعديل بيانات الطفل' : 'إضافة ملف طفل جديد'}</h3>
                            <button onClick={() => setShowModal(false)} className="absolute top-6 left-6 p-2 hover:bg-white/20 rounded-full transition-colors"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">الاسم الكامل للطفل</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-secondary outline-none transition-all font-bold text-lg"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-gray-700">تاريخ الميلاد</label>
                                            <input
                                                type="date"
                                                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-secondary outline-none transition-all"
                                                value={formData.dob}
                                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-gray-700">الجنس</label>
                                            <select
                                                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-secondary outline-none transition-all font-bold appearance-none bg-white cursor-pointer"
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            >
                                                <option value="male">ذكر ♂</option>
                                                <option value="female">أنثى ♀</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">ولي الأمر (المرتبط بالطفل)</label>
                                        <select
                                            className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-secondary outline-none transition-all font-bold bg-white"
                                            value={formData.parent_id}
                                            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                            required
                                        >
                                            <option value="">-- اختار الولي --</option>
                                            {parents.map(p => <option key={p.id} value={p.id}>{p.full_name} (@{p.username})</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">الفوج الدراسي</label>
                                        <select
                                            className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-secondary outline-none transition-all font-bold bg-white"
                                            value={formData.group_name}
                                            onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                                        >
                                            <option value="">-- لم يتم التحديد (بدون فوج) --</option>
                                            {groups.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">تاريخ صحي (اختياري)</label>
                                        <textarea
                                            className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-secondary outline-none transition-all h-24 resize-none"
                                            placeholder="أي أمراض مزمنة أو ملاحظات طبية..."
                                            value={formData.medical_history}
                                            onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">الحساسية (اختياري)</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-secondary outline-none transition-all"
                                            placeholder="حساسية من طعام معين أو دواء..."
                                            value={formData.allergies}
                                            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-secondary text-white py-5 rounded-2xl text-xl font-black shadow-xl hover:shadow-secondary/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-3">
                                {editingId ? <Edit size={24} /> : <Plus size={24} />}
                                {editingId ? 'حفظ التغييرات' : 'حفظ الملف المدرسي للطفل'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={() => handleDelete(confirmDelete.id)}
                title="حذف ملف الطفل"
                message="هل أنت متأكد من رغبتك في حذف ملف هذا الطفل نهائياً؟"
                confirmText="نعم، احذف"
                cancelText="تراجع"
            />
        </Layout>
    );
};

export default ManageStudents;
