import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

export default function AuthModal({ type, onClose, onSwitch }) {
    const isLogin = type === "login";
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isLogin) {
                await AuthService.login(formData.email, formData.password);
            } else {
                await AuthService.signup(formData.username, formData.email, formData.password);
            }
            navigate("/dashboard");

            onClose(); // Ensure modal closes
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white md:rounded-xl w-full md:w-[90%] max-w-sm md:max-w-md p-4 md:p-10 text-center md:shadow-2xl relative h-full md:h-auto flex flex-col justify-center"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl font-bold z-50"
                >
                    ✕
                </button>

                <h1 className="text-xl md:text-3xl font-bold text-[#ffa500] mb-2">
                    {isLogin ? "Login" : "Sign Up"}
                </h1>
                <p className="text-gray-400 mt-1 mb-4 md:mb-6 text-xs md:text-base">
                    {isLogin ? "Welcome back to your study planner" : "Start planning your studies smarter"}
                </p>

                {error && <p className="text-red-500 mb-4 font-semibold">{error}</p>}

                <form className="flex flex-col gap-4 text-left" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-black">Username:</label>
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="border-2 border-[#ffa500] bg-white focus:outline-none focus:ring-2 focus:ring-[#ffa500] p-3 rounded-lg transition-colors w-full text-black placeholder-gray-400"
                                placeholder="Ex. John Doe"
                                required
                            />
                        </div>
                    )}
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-black">Email:</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border-2 border-[#ffa500] bg-white focus:outline-none focus:ring-2 focus:ring-[#ffa500] p-3 rounded-lg transition-colors w-full text-black placeholder-gray-400"
                            placeholder="email@gmail.com"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-black">Password:</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border-2 border-[#ffa500] bg-white focus:outline-none focus:ring-2 focus:ring-[#ffa500] p-3 rounded-lg transition-colors w-full text-black placeholder-gray-400"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="bg-[#ffa500] text-white hover:bg-orange-600 transition py-3 rounded-lg font-bold mt-4 shadow-md disabled:opacity-50"
                    >
                        {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={onSwitch}
                        className="font-bold text-[#ffa500] underline hover:no-underline"
                    >
                        {isLogin ? "Sign up" : "Login"}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}
