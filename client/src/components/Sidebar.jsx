import { useState } from "react";
import { LayoutDashboard, BookOpen, Calendar, Settings, LogOut, Smartphone, Star } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import AuthService from "../services/auth.service";
import studyLogo from "../assets/app-logo.png";
import ConfirmationModal from "./ConfirmationModal";

export const MENU_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/app/dashboard" },
    { icon: BookOpen, label: "My Subjects", path: "/app/courses" },
    { icon: Calendar, label: "Calendar", path: "/app/calendar" },
    { icon: Settings, label: "Settings", path: "/app/settings" },
];

export default function Sidebar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutConfirmOpen(true);
    };

    const confirmLogout = () => {
        AuthService.logout();
        window.location.href = "/";
    };

    return (
        <div className="hidden md:flex w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-[#ffa500]/20 dark:border-gray-700 text-gray-700 dark:text-gray-200 p-6 flex-col justify-between overflow-y-auto fixed left-0 top-0 font-sans shadow-sm z-50 transition-colors duration-300">
            <div>
                {/* LOGO */}
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 rounded-xl bg-[#ffa500]/20 flex items-center justify-center shadow-md overflow-hidden">
                        <img src={studyLogo} alt="StudySync Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#ffa500] tracking-tight">StudySync</h1>
                </div>

                {/* MENU */}
                <nav className="flex flex-col gap-2">
                    {MENU_ITEMS.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group font-medium ${isActive(item.path)
                                ? "bg-[#ffa500] text-white"
                                : "text-gray-500 hover:bg-orange-50 hover:text-[#ffa500]"
                                }`}
                        >
                            <item.icon size={20} className={isActive(item.path) ? "text-white" : ""} />
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className={`ml-auto text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${isActive(item.path) ? "bg-white text-[#ffa500]" : "bg-[#ffa500] text-white"
                                    }`}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* FOOTER ACTION */}
            <div className="mt-8">
                <div className="bg-[#fff8e1] dark:bg-gray-800 rounded-2xl p-4 text-[#ffa500] relative overflow-hidden mb-6 border border-[#ffa500]/10 dark:border-gray-700 transition-colors">
                    <div className="relative z-10 flex flex-col items-start">
                        <div className="w-8 h-8 rounded-full bg-[#ffa500] flex items-center justify-center mb-2 text-white shadow-sm">
                            <Smartphone size={16} />
                        </div>
                        <p className="font-bold text-sm leading-tight text-gray-800 dark:text-white">Mobile App</p>
                        <p className="text-xs font-medium text-[#ffa500] mt-0.5">Coming Soon 🚀</p>
                    </div>
                    {/* Abstract bg circle */}
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 border-4 border-[#ffa500]/10 rounded-full" />
                </div>



                <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-3 text-gray-400 hover:text-[#ffa500] transition px-4 py-2 w-full font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            <ConfirmationModal
                isOpen={isLogoutConfirmOpen}
                title="Logout"
                message="Are you sure you want to log out?"
                onConfirm={confirmLogout}
                onCancel={() => setIsLogoutConfirmOpen(false)}
                confirmText="Logout"
                confirmColor="bg-red-500"
            />
        </div>
    );
}

