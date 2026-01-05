import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shapes, User, Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(username, password);
            // Redirect based on role
            switch (data.user.role) {
                case 'admin': navigate('/admin'); break;
                case 'teacher': navigate('/teacher'); break;
                case 'parent': navigate('/parent'); break;
                default: navigate('/');
            }
        } catch (err) {
            setError(err.message || 'خطأ في تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 bg-white bg-opacity-95 rounded-3xl shadow-2xl border-4 border-secondary overflow-hidden relative"
            >
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
                        <Shapes size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary">مرحباً بكم</h2>
                    <p className="text-gray-500">بوابة روضة الأحلام</p>
                </div>

                {error && (
                    <div className="bg-red-500 text-white p-3 rounded-xl mb-6 text-center font-bold animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">اسم المستخدم</label>
                        <div className="relative">
                            <span className="absolute right-3 top-3 text-gray-400">
                                <User size={20} />
                            </span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 pr-10 border-2 border-gray-100 rounded-xl focus:border-secondary outline-none transition-all"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">كلمة المرور</label>
                        <div className="relative">
                            <span className="absolute right-3 top-3 text-gray-400">
                                <Lock size={20} />
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pr-10 border-2 border-gray-100 rounded-xl focus:border-secondary outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'جاري الدخول...' : 'دخول'}
                        <ArrowLeft size={20} />
                    </button>
                </form>

                <div className="text-center mt-6">
                    <a href="/" className="text-gray-500 hover:text-secondary text-sm transition-colors">العودة للرئيسية</a>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
