import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Users,
    GraduationCap,
    Calendar,
    FileText,
    MessageSquare,
    LogOut,
    LayoutDashboard,
    Layers,
    ClipboardList,
    FilePlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const getLinks = () => {
        if (user?.role === 'admin') {
            return [
                { name: 'الرئيسية', icon: LayoutDashboard, path: '/admin' },
                { name: 'المستخدمين', icon: Users, path: '/admin/users' },
                { name: 'الأطفال', icon: GraduationCap, path: '/admin/students' },
                { name: 'الأفواج', icon: Layers, path: '/admin/groups' },
                { name: 'المالية', icon: FileText, path: '/admin/finance' },
                { name: 'التقارير', icon: ClipboardList, path: '/admin/reports' },
                { name: 'الرسائل', icon: MessageSquare, path: '/admin/messages' },
                { name: 'طلبات التسجيل', icon: FilePlus, path: '/admin/registration-requests' },
            ];
        }
        if (user?.role === 'teacher') {
            return [
                { name: 'الرئيسية', icon: LayoutDashboard, path: '/teacher' },
                { name: 'الحضور', icon: Calendar, path: '/teacher/attendance' },
                { name: 'التقارير', icon: FileText, path: '/teacher/reports' },
            ];
        }
        if (user?.role === 'parent') {
            return [
                { name: 'الرئيسية', icon: LayoutDashboard, path: '/parent' },
                { name: 'الحضور', icon: Calendar, path: '/parent/attendance' },
                { name: 'الفواتير', icon: FileText, path: '/parent/invoices' },
            ];
        }
        return [];
    };

    const links = getLinks();

    return (
        <div className="w-64 bg-dark text-white min-h-screen fixed right-0 top-0 z-50 p-6 flex flex-col shadow-2xl">
            <div className="mb-10 text-center">
                <h2 className="text-2xl font-gradoka font-bold text-primary">روضة الأحلام</h2>
                <p className="text-xs text-gray-400 mt-1">{user?.full_name}</p>
            </div>

            <nav className="flex-grow space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/10 text-gray-300 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-bold">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={() => logout()}
                className="mt-auto flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
            >
                <LogOut size={20} />
                <span className="font-bold">تسجيل الخروج</span>
            </button>
        </div>
    );
};

export default Sidebar;
