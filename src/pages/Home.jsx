import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Hero3D from '../components/Hero3D';
import {
    Shapes,
    ArrowLeft,
    ArrowRight,
    Users,
    GraduationCap,
    Heart,
    ShieldCheck,
    Clock,
    Star,
    Phone,
    Mail,
    MapPin,
    ChevronDown,
    Menu,
    X,
    Sun,
    Coffee,
    BookOpen,
    Send,
    CheckCircle2
} from 'lucide-react';

const Home = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smooth scroll handler
    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Offset for fixed header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setMobileMenuOpen(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormStatus({ loading: true, success: false, error: null });

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Determine if this is a contact message or a registration request
        const isRegistration = form.id === 'registration-form';
        const action = isRegistration ? 'register_request' : 'send_message';

        if (isRegistration && data.child_age > 5) {
            setFormStatus({
                loading: false,
                success: false,
                error: 'عذراً، نحن نقبل الأطفال حتى عمر 5 سنوات فقط.'
            });
            return;
        }

        try {
            // Assuming 'api' is an axios instance or similar, imported elsewhere
            // Example: import api from '../utils/api';
            await api.post('/public_api.php', {
                action,
                ...data
            });
            setFormStatus({ loading: false, success: true, error: null });
            form.reset();
            setTimeout(() => {
                setFormStatus({ loading: false, success: false, error: null });
                if (isRegistration) setIsModalOpen(false);
            }, 3000);
        } catch (error) {
            setFormStatus({
                loading: false,
                success: false,
                error: error.response?.data?.error || 'حدث خطأ أثناء الإرسال'
            });
        }
    };

    const services = [
        {
            icon: <Sun className="text-accent" size={32} />,
            title: "رعاية مبكرة",
            desc: "بيئة غنية بالعاطفة والاهتمام لأطفالنا الصغار لضمان بداية مثالية.",
            color: "bg-orange-50"
        },
        {
            icon: <BookOpen className="text-secondary" size={32} />,
            title: "تعليم تفاعلي",
            desc: "مناهج حديثة تركز على التعلم من خلال اللعب واكتشاف المواهب.",
            color: "bg-blue-50"
        },
        {
            icon: <Heart className="text-primary" size={32} />,
            title: "تغذية صحية",
            desc: "وجبات متوازنة ومعدّة خصيصاً لتناسب احتياجات النمو لكل طفل.",
            color: "bg-red-50"
        },
        {
            icon: <ShieldCheck className="text-green-500" size={32} />,
            title: "أمان تام",
            desc: "نظام مراقبة متكامل وفريق متخصص لضمان سلامة طفلك في كل ثانية.",
            color: "bg-green-50"
        }
    ];

    const stats = [
        { label: "طفل سعيد", value: "250+", icon: <Users size={20} /> },
        { label: "مربية معتمدة", value: "15", icon: <Star size={20} /> },
        { label: "سنوات خبرة", value: "10+", icon: <Clock size={20} /> }
    ];

    return (
        <div className="min-h-screen bg-[#fcfaf5] font-cairo text-right relative" dir="rtl">
            {/* --- Navbar --- */}
            <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6 px-4'}`}>
                <div className={`container mx-auto transition-all duration-500 ${scrolled ? 'max-w-6xl' : 'max-w-7xl'}`}>
                    <div className={`px-6 py-4 flex items-center justify-between rounded-[2rem] transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-xl' : 'bg-transparent'}`}>
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group relative">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                                <Shapes size={28} />
                            </div>
                            <span className="text-2xl font-black text-dark font-fredoka tracking-tight">روضة الأحلام</span>
                            <span className="absolute -top-1 -right-4 text-[10px] bg-red-500 text-white px-1 rounded opacity-50">V2</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#" onClick={(e) => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-bold text-dark hover:text-primary transition-colors">الرئيسية</a>
                            <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="font-bold text-gray-400 hover:text-primary transition-colors">خدماتنا</a>
                            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="font-bold text-gray-400 hover:text-primary transition-colors">من نحن</a>
                            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="font-bold text-gray-400 hover:text-primary transition-colors">اتصل بنا</a>
                        </div>

                        {/* Login Button */}
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="hidden md:flex items-center gap-2 bg-dark text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-primary transition-all active:scale-95"
                            >
                                تسجيل الدخول
                                <ArrowLeft size={20} />
                            </Link>
                            <button
                                className="md:hidden p-3 bg-white rounded-2xl shadow-md text-dark"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white rounded-[2rem] shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
                        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }} className="font-bold text-dark p-4 bg-gray-50 rounded-2xl">الرئيسية</a>
                        <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="font-bold text-gray-500 p-4">خدماتنا</a>
                        <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="font-bold text-gray-500 p-4">من نحن</a>
                        <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="font-bold text-gray-500 p-4">اتصل بنا</a>
                        <Link to="/login" className="bg-primary text-white p-4 rounded-2xl font-black text-center flex items-center justify-center gap-2">
                            تسجيل الدخول <ArrowLeft size={18} />
                        </Link>
                    </div>
                )}
            </nav>

            {/* --- Hero Section --- */}
            <header className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
                {/* 3D Background (Restricted to Hero) */}
                <Hero3D />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        {/* School Icon (Center) */}
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl animate-in zoom-in duration-1000 border-8 border-white/50">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/167/167707.png"
                                alt="School"
                                className="w-20 active:scale-110 transition-transform"
                            />
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full font-black text-sm mb-6 border border-accent/20 animate-in fade-in slide-in-from-bottom duration-700">
                            <Star size={16} fill="currentColor" /> حيث تبدأ الأحلام الكبيرة
                        </div>

                        <h1 className="text-6xl lg:text-9xl font-black text-dark leading-[1.1] mb-8 font-fredoka animate-in fade-in slide-in-from-bottom duration-700 delay-100 italic">
                            روضة الأحلام
                        </h1>

                        <p className="text-xl lg:text-2xl text-gray-500 leading-relaxed max-w-2xl mb-12 font-bold animate-in fade-in slide-in-from-bottom duration-700 delay-200">
                            بيئة آمنة ومحفزة لتنمية مهارات أطفالكم بمناهج تعليمية وتربوية حديثة.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-12 py-5 bg-secondary text-white rounded-3xl font-black text-xl shadow-2xl shadow-secondary/30 hover:scale-105 active:scale-95 transition-all"
                            >
                                احجز مكان لطفلك
                            </button>
                            <button
                                onClick={(e) => scrollToSection(e, 'services')}
                                className="px-12 py-5 bg-white/70 backdrop-blur-md text-dark border-2 border-white rounded-3xl font-black text-xl hover:bg-white transition-all flex items-center gap-3"
                            >
                                اكتشف المزيد <ChevronDown size={24} className="animate-bounce" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Stats Bar --- */}
            <div className="relative z-20 container mx-auto px-6 -mb-20">
                <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10 border border-white shadow-2xl grid md:grid-cols-3 gap-8 divide-x divide-x-reverse divide-gray-100 overflow-hidden">
                    {stats.map((s, i) => (
                        <div key={i} className="flex flex-col items-center text-center group">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mb-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-500">
                                {s.icon}
                            </div>
                            <div className="text-4xl font-black text-dark mb-1 font-fredoka">{s.value}</div>
                            <div className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Services Section --- */}
            <section id="services" className="pt-48 pb-32 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-20">
                        <h2 className="text-5xl font-black text-dark mb-6 font-fredoka italic">لماذا "روضة الأحلام"؟</h2>
                        <div className="w-24 h-2 bg-accent rounded-full"></div>
                        <p className="max-w-2xl mt-8 text-lg text-gray-500 font-bold leading-relaxed">
                            نحن لا نوفر مجرد مكان لرعاية طفلك، بل نصمم تجربة تعليمية وعاطفية متكاملة تساعده على اكتشاف قدراته في أرقى الظروف.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((s, i) => (
                            <div key={i} className={`p-10 rounded-[3rem] ${s.color} border border-transparent hover:border-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center group`}>
                                <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-xl mb-8 group-hover:rotate-[360deg] duration-1000 transition-all">
                                    {s.icon}
                                </div>
                                <h3 className="text-2xl font-black text-dark mb-4">{s.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-bold">
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Environment Section (Updated to match design) --- */}
            <section id="about" className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        {/* Image Side (Left in RTL is usually visually perceived as Left) */}
                        <div className="lg:w-1/2 relative order-2 lg:order-1">
                            <div className="relative rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border-[12px] border-white rotate-3 hover:rotate-0 transition-transform duration-700 aspect-[4/3] bg-gray-100">
                                <img
                                    src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=1200"
                                    alt="Modern Daycare Classroom"
                                    className="w-full h-full object-cover scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>

                                {/* Trust Badge (Match mockup) */}
                                <div className="absolute bottom-6 left-6 p-5 bg-white/95 backdrop-blur-md rounded-[2rem] shadow-xl text-dark font-black text-center min-w-[180px] border border-white z-20">
                                    <div className="flex justify-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map(x => <Star key={x} size={16} fill="#FFD700" className="text-[#FFD700]" />)}
                                    </div>
                                    <span className="text-lg">ثقة أكثر من <span className="text-secondary">500</span> عائلة</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Side (Right) */}
                        <div className="lg:w-1/2 order-1 lg:order-2 text-right">
                            <h2 className="text-5xl lg:text-7xl font-black text-[#2D3436] mb-12 font-fredoka leading-tight">
                                بيئة مجهزة بأحدث <br />
                                <span className="text-[#3498db] mt-2 block">الوسائل التربوية</span>
                            </h2>

                            <div className="space-y-10">
                                {[
                                    { t: "فصول ذكية", d: "مجهزة بتقنيات تعليمية تفاعلية تحبب الطفل في المعلومات.", i: <Sun size={24} />, c: "bg-blue-50 text-blue-500" },
                                    { t: "ألعاب تنمية المهارات", d: "اختيار مدروس للألعاب التي تحفز التفكير المنطقي والإبداعي.", i: <Shapes size={24} />, c: "bg-blue-50 text-blue-500" },
                                    { t: "متابعة طبية دورية", d: "فريق تمريض متخصص لمراقبة صحة ونمو أطفالنا.", i: <Heart size={24} />, c: "bg-blue-50 text-blue-500" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-6 group">
                                        <div className={`w-16 h-16 shrink-0 rounded-[1.5rem] ${item.c} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 border border-white`}>
                                            {item.i}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-dark text-2xl mb-2">{item.t}</h4>
                                            <p className="text-gray-500 font-bold text-lg leading-relaxed max-w-md">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Contact Section --- */}
            <section id="contact" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Contact Info */}
                        <div className="flex flex-col gap-10">
                            <div>
                                <h2 className="text-5xl font-black text-dark mb-6 font-fredoka italic">تواصل معنا</h2>
                                <p className="text-xl text-gray-500 font-bold max-w-md">نحن هنا للإجابة على جميع استفساراتكم حول برامجنا وكيفية الانضمام.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-6 p-6 bg-[#fcfaf5] rounded-3xl border border-gray-100 hover:border-primary transition-all group">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">الهاتف</div>
                                        <div className="text-xl font-black text-dark">0540829636</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-6 bg-[#fcfaf5] rounded-3xl border border-gray-100 hover:border-secondary transition-all group">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm group-hover:bg-secondary group-hover:text-white transition-all">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">البريد الإلكتروني</div>
                                        <div className="text-xl font-black text-dark">contact@dream-daycare.com</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-6 bg-[#fcfaf5] rounded-3xl border border-gray-100 hover:border-accent transition-all group">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-accent shadow-sm group-hover:bg-accent group-hover:text-white transition-all">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">الموقع</div>
                                        <div className="text-xl font-black text-dark">حي دالاس، السوقر، تيارت</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-dark rounded-[3.5rem] p-10 lg:p-14 text-white relative shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                                <Shapes className="w-full h-full scale-110" />
                            </div>

                            <h3 className="text-3xl font-black mb-8 relative z-10">أرسل لنا رسالة</h3>
                            <form id="contact-form" className="space-y-6 relative z-10" onSubmit={handleFormSubmit}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400">الاسم الكامل</label>
                                        <input name="name" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary transition-all outline-none" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400">البريد الإلكتروني</label>
                                        <input name="email" type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary transition-all outline-none" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400">الموضوع</label>
                                    <input name="subject" type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary transition-all outline-none" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400">الرسالة</label>
                                    <textarea name="message" rows="4" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary transition-all outline-none resize-none" required></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={formStatus.loading}
                                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {formStatus.loading ? 'جاري الإرسال...' : (
                                        <>إرسال الرسالة <Send size={20} /></>
                                    )}
                                </button>

                                {formStatus.success && (
                                    <div className="flex items-center gap-3 text-green-400 font-bold bg-green-400/10 p-4 rounded-2xl animate-in fade-in zoom-in duration-300">
                                        <CheckCircle2 size={20} /> تم إرسال رسالتك بنجاح!
                                    </div>
                                )}
                                {formStatus.error && (
                                    <div className="text-red-400 font-bold p-2 text-center">{formStatus.error}</div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Registration Modal --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-dark/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
                        {/* Modal Header */}
                        <div className="bg-secondary p-10 text-white relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 left-6 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                            >
                                <X size={24} />
                            </button>
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                <GraduationCap size={32} />
                            </div>
                            <h3 className="text-3xl font-black mb-2 font-fredoka">طلب تسجيل طفل</h3>
                            <p className="text-white/80 font-bold">املأ البيانات أدناه وسيتواصل معك فريقنا في أقرب وقت ممكن.</p>
                        </div>

                        {/* Modal Body */}
                        <form id="registration-form" className="p-10 space-y-6" onSubmit={handleFormSubmit}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-dark/60">اسم ولي الأمر</label>
                                    <input name="parent_name" type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:border-secondary transition-all outline-none" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-dark/60">رقم الهاتف</label>
                                    <input name="phone" type="tel" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:border-secondary transition-all outline-none" required />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-dark/60">اسم الطفل</label>
                                    <input name="child_name" type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:border-secondary transition-all outline-none" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-dark/60">عمر الطفل</label>
                                    <select name="child_age" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:border-secondary transition-all outline-none appearance-none" required>
                                        <option value="">اختر العمر</option>
                                        <option value="رضيع">رضيع (أقل من سنة)</option>
                                        <option value="حضانة">حضانة (1 - 3 سنوات)</option>
                                        <option value="تحضيري">تحضيري (4 - 5 سنوات)</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={formStatus.loading}
                                className="w-full bg-secondary text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-secondary/20"
                            >
                                {formStatus.loading ? 'جاري إرسال الطلب...' : (
                                    <>تأكيد طلب التسجيل <ArrowLeft size={20} /></>
                                )}
                            </button>

                            {formStatus.success && (
                                <div className="flex items-center gap-3 text-green-600 font-bold bg-green-50 p-4 rounded-2xl animate-in fade-in zoom-in duration-300">
                                    <CheckCircle2 size={20} /> تم استلام طلبك! سنتصل بك قريباً.
                                </div>
                            )}
                            {formStatus.error && (
                                <div className="text-red-600 font-bold p-2 text-center">{formStatus.error}</div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* --- Footer --- */}
            <footer className="bg-dark text-white pt-24 pb-12">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 text-right">
                        {/* Brand Column */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                                    <Shapes size={28} />
                                </div>
                                <span className="text-2xl font-black font-fredoka">روضة الأحلام</span>
                            </div>
                            <p className="text-gray-400 font-bold leading-relaxed">
                                نؤمن أن كل طفل هو حلم يستحق الرعاية. نحن هنا لنجعل الطفولة رحلة استثنائية من التعلم والسعادة.
                            </p>
                        </div>

                        {/* Fast Links */}
                        <div>
                            <h4 className="text-xl font-black mb-8 border-b border-white/10 pb-4">روابط سريعة</h4>
                            <ul className="space-y-4 text-gray-400 font-bold">
                                <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-primary transition-all">الرئيسية</a></li>
                                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-primary transition-all">خدماتنا</a></li>
                                <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-primary transition-all">من نحن</a></li>
                                <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-primary transition-all">اتصل بنا</a></li>
                            </ul>
                        </div>

                        {/* Our Services */}
                        <div>
                            <h4 className="text-xl font-black mb-8 border-b border-white/10 pb-4">برامجنا</h4>
                            <ul className="space-y-4 text-gray-400 font-bold">
                                <li>• التحضيري</li>
                                <li>• حضانة الرضع</li>
                                <li>• نادي اللغات</li>
                                <li>• التربية الدينية</li>
                            </ul>
                        </div>

                        {/* Location */}
                        <div>
                            <h4 className="text-xl font-black mb-8 border-b border-white/10 pb-4">ساعات العمل</h4>
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-gray-400 font-bold">
                                نفتح أبوابنا من الأحد إلى الخميس <br />
                                <div className="mt-4 flex items-center gap-2 text-white font-black italic">
                                    <Clock size={16} className="text-accent" /> 08:00 صباحاً - 05:00 مساءً
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 text-center text-gray-500 font-bold text-sm">
                        جميع الحقوق محفوظة &copy; {new Date().getFullYear()} روضة الأحلام. صمم بكل ❤️ لأجل أطفالنا.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
