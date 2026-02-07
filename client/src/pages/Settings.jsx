import { useState, useEffect } from "react";
import { Moon, Sun, User, Shield, Trash2, Save } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import DatePicker from "../components/DatePicker";

import { useLocation } from "react-router-dom";

export default function Settings() {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [user, setUser] = useState(AuthService.getCurrentUser());
    const [formData, setFormData] = useState({
        gender: user?.gender || 'male',
        dob: user?.dob || ''
    });

    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // ... (other state)

    useEffect(() => {
        if (location.state?.openEditProfile) {
            setShowEditModal(true);
            // Clear state so it doesn't reopen on refresh/navigation
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        if (user) {
            setFormData({
                gender: user.gender || 'male',
                dob: user.dob || ''
            });
        }
    }, [user]);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            // alert("New passwords do not match!"); // User requested no alerts
            return;
        }
        if (passwordData.newPassword.length < 6) {
            // alert("Password must be at least 6 characters.");
            return;
        }

        UserService.changePassword({
            userId: user.id,
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword
        }).then(res => {
            setShowPasswordModal(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        }).catch(err => {
            console.error(err);
        });
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = () => {
        UserService.deleteAccount(user.id).then(res => {
            AuthService.logout();
            window.location.href = "/";
        }).catch(err => {
            console.error(err);
        });
    };



    const handleUpdateProfile = () => {
        UserService.updateProfile({
            userId: user.id,
            gender: formData.gender,
            dob: formData.dob
        }).then(res => {
            // Update local storage user data
            const updatedUser = { ...user, gender: res.data.gender, dob: res.data.dob };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setShowEditModal(false);
        }).catch(err => {
            console.error(err);
        });
    };


    return (
        <div className="">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your preferences and account.</p>
            </div>

            <div className="space-y-6 max-w-2xl">
                {/* APPEARANCE */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                        Appearance
                    </h2>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-[#ffa500]/20 text-[#ffa500]' : 'bg-gray-100 text-gray-500'}`}>
                                {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-white">Dark Mode</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${theme === 'dark' ? 'bg-[#ffa500]' : 'bg-gray-300'}`}
                        >
                            <div className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                {/* ACCOUNT */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                        Account
                    </h2>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full border-2 border-[#ffa500] p-0.5 overflow-hidden bg-white">
                            <img
                                className="rounded-full w-full h-full object-cover"
                                src={user?.gender === 'female' ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" : "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"}
                                alt="User"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">{user?.username}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-3 text-gray-600 dark:text-gray-300"
                        >
                            <User size={18} /> Edit Profile
                        </button>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-3 text-gray-600 dark:text-gray-300"
                        >
                            <Shield size={18} /> Password & Security
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <h3 className="text-red-500 font-bold mb-2">Danger Zone</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                        <button
                            onClick={handleDeleteAccount}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 border border-red-200 dark:border-red-900/50"
                        >
                            <Trash2 size={16} /> Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* EDIT PROFILE MODAL */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-6 relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Edit Profile</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">Close</button>
                        </div>

                        <div className="space-y-6">
                            {/* Gender Selection */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-3">Avatar / Gender</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setFormData({ ...formData, gender: 'male' })}
                                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${formData.gender === 'male' ? 'border-[#ffa500] bg-[#ffa500]/10' : 'border-gray-200 dark:border-gray-700 bg-transparent'}`}
                                    >
                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                                            {/* Show exactly what the user will get */}
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="Male" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Male</span>
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, gender: 'female' })}
                                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${formData.gender === 'female' ? 'border-[#ffa500] bg-[#ffa500]/10' : 'border-gray-200 dark:border-gray-700 bg-transparent'}`}
                                    >
                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Female" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Female</span>
                                    </button>
                                </div>
                            </div>

                            {/* DOB Input */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Date of Birth</label>
                                <DatePicker
                                    value={formData.dob}
                                    onChange={(date) => setFormData({ ...formData, dob: date })}
                                    placeholder="Select date of birth"
                                />
                            </div>

                            <button
                                onClick={handleUpdateProfile}
                                className="w-full bg-[#ffa500] text-black font-bold py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
                            >
                                <Save size={20} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CHANGE PASSWORD MODAL */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-6 relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">Close</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#ffa500] outline-none"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#ffa500] outline-none"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#ffa500] outline-none"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <button
                                onClick={handleChangePassword}
                                className="w-full bg-[#ffa500] text-black font-bold py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 mt-4"
                            >
                                <Save size={20} /> Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE ACCOUNT CONFIRMATION MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 relative text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Account?</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteAccount}
                                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
