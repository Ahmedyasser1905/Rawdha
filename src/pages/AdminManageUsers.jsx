import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ConfirmModal from '../components/ConfirmModal';
import api from '../services/api';
import {
    Users,
    Search,
    UserPlus,
    Trash2,
    UserCog,
    X,
    Shield,
    Key,
    User,
    Tags
} from 'lucide-react';

const AdminManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        role: 'parent',
        group_name: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users.php', {
                params: { search, role: roleFilter }
            });
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setFormData({
            username: user.username,
            password: '', // Leave empty for no change
            full_name: user.full_name,
            role: user.role,
            group_name: user.group_name || ''
        });
        setEditingId(user.id);
        setShowModal(true);
    };

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/users.php?id=${id}`);
            fetchUsers();
        } catch (error) {
            alert('خطأ في حذف المستخدم');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put('/users.php', { ...formData, id: editingId });
            } else {
                await api.post('/users.php', formData);
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ username: '', password: '', full_name: '', role: 'parent', group_name: '' });
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.error || 'خطأ في حفظ البيانات');
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-secondary font-fredoka flex items-center gap-2">
                    <Users className="text-primary" /> إدارة طاقم العمال والأولياء
                </h1>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ username: '', password: '', full_name: '', role: 'parent', group_name: '' });
                        setShowModal(true);
                    }}
                    className="bg-accent text-dark px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:scale-105 transition-transform"
                >
                    <UserPlus size={20} />
                    إضافة مستخدم جديد
                </button>
            </div>

            <div className="glass-panel p-4 mb-8 flex flex-wrap gap-4 items-center">
                <div className="relative flex-grow min-w-[300px]">
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        className="w-full p-2 pr-10 border rounded-xl"
                        placeholder="ابحث عن اسم المستخدم أو الاسم الكامل..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
                    />
                </div>
                <select
                    className="p-2 border rounded-xl font-bold"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="all">كل الرتب</option>
                    <option value="admin">مدير</option>
                    <option value="teacher">مربية / أستاذة</option>
                    <option value="parent">ولي أمر</option>
                </select>
                <button onClick={fetchUsers} className="bg-primary text-white px-8 py-2 rounded-xl font-bold">تصفية</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <div className="col-span-full text-center p-12 text-gray-400">جاري التحميل...</div> :
                    users.length > 0 ? users.map(u => (
                        <div key={u.id} className="glass-panel p-6 flex flex-col items-center text-center relative group">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 shadow-lg ${u.role === 'admin' ? 'bg-red-400' : u.role === 'teacher' ? 'bg-secondary' : 'bg-primary'}`}>
                                <User size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-1">{u.full_name}</h3>
                            <p className="text-gray-400 text-sm mb-4">@{u.username}</p>

                            <div className="flex gap-2 text-xs mb-6">
                                <span className={`px-3 py-1 rounded-full font-bold ${u.role === 'admin' ? 'bg-red-100 text-red-600' : u.role === 'teacher' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {u.role === 'admin' ? 'مدير' : u.role === 'teacher' ? 'مربية' : 'ولي أمر'}
                                </span>
                                {u.group_name && <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{u.group_name}</span>}
                            </div>

                            <div className="flex gap-3 w-full border-t pt-4 mt-auto">
                                <button
                                    onClick={() => handleEdit(u)}
                                    className="flex-grow flex items-center justify-center gap-1 text-secondary hover:bg-secondary/5 p-2 rounded-lg transition-colors font-bold"
                                >
                                    <UserCog size={16} /> تعديل
                                </button>
                                <button
                                    onClick={() => setConfirmDelete({ open: true, id: u.id })}
                                    className="flex-grow flex items-center justify-center gap-1 text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors font-bold"
                                >
                                    <Trash2 size={16} /> حذف
                                </button>
                            </div>
                        </div>
                    )) : <div className="col-span-full text-center p-12 text-gray-400">لا يوجد مستخدمين.</div>}
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-6 bg-primary text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                {editingId ? <UserCog /> : <UserPlus />}
                                {editingId ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-1 rounded-full"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 flex items-center gap-1"><User size={16} /> الاسم الكامل</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border rounded-xl shadow-inner bg-gray-50 focus:bg-white transition-colors"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-1"><Shield size={16} /> اسم المستخدم</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border rounded-xl shadow-inner bg-gray-50 uppercase font-mono tracking-tighter"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-1"><Key size={16} /> {editingId ? 'كلمة السر (اتركها فارغة لعدم التغيير)' : 'كلمة السر'}</label>
                                    <input
                                        type="password"
                                        className="w-full p-3 border rounded-xl shadow-inner bg-gray-50 focus:bg-white transition-colors"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!editingId}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 flex items-center gap-1"><Tags size={16} /> الرتبة / الصلاحية</label>
                                <select
                                    className="w-full p-3 border rounded-xl font-bold bg-white"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="parent">ولي أمر</option>
                                    <option value="teacher">مربية / أستاذة (Educator)</option>
                                    <option value="admin">مدير النظام (Admin)</option>
                                </select>
                            </div>
                            {formData.role === 'teacher' && (
                                <div className="animate-in slide-in-from-top duration-300">
                                    <label className="block text-sm font-bold mb-2">اسم الفوج (اختياري)</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border rounded-xl"
                                        placeholder="مثال: البراعم، العصافير"
                                        value={formData.group_name}
                                        onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                                    />
                                </div>
                            )}
                            <button className="w-full bg-primary text-white py-4 rounded-xl font-extrabold shadow-lg hover:opacity-90 transition-opacity">
                                حفظ بيانات المستخدم
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={() => handleDelete(confirmDelete.id)}
                title="حذف المستخدم"
                message="هل أنت متأكد من رغبتك في حذف هذا المستخدم؟ لا يمكن استعادة البيانات بعد الحذف."
                confirmText="نعم، حذف الآن"
                cancelText="تراجع"
            />
        </Layout>
    );
};

export default AdminManageUsers;
