import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar, { MENU_ITEMS } from "../components/Sidebar";
import { Menu, X, LogOut } from "lucide-react";
import AuthService from "../services/auth.service";
import useSessionTimeout from "../hooks/useSessionTimeout";

export default function AppLayout() {
    useSessionTimeout(30 * 60 * 1000); // 30 minutes timeout
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        AuthService.logout();
        window.location.href = "/";
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#fdfbf7] dark:bg-gray-950 font-sans transition-colors duration-300 overflow-hidden">
            <Sidebar />

            {/* MOBILE HEADER */}
            <div className="md:hidden bg-white dark:bg-gray-900 p-4 flex justify-between items-center shadow-sm sticky top-0 z-50 border-b dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#ffa500] flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <h1 className="text-xl font-extrabold text-[#ffa500]">StudySync</h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* MOBILE DROPDOWN MENU */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-lg absolute top-16 left-0 w-full z-40 animate-in slide-in-from-top-2 duration-200">
                    <nav className="flex flex-col p-4 gap-2">
                        {MENU_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium ${isActive(item.path)
                                    ? "bg-[#ffa500] text-white"
                                    : "text-gray-500 hover:bg-orange-50 hover:text-[#ffa500]"
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-[#ffa500] transition font-medium mt-2 border-t border-gray-50"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </nav>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="md:ml-64 flex-1 p-4 md:p-8 text-black dark:text-white h-[calc(100vh-64px)] md:h-screen overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}
