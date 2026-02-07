import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = "info") => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    }, []);

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[100]">
                {notifications.map((n) => (
                    <div key={n.id} className={`p-4 rounded-xl shadow-lg border flex items-center gap-3 animate-in slide-in-from-right duration-300 ${n.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
                            n.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                                'bg-white border-gray-200 text-gray-700'
                        }`}>
                        {n.type === 'success' && <CheckCircle size={20} />}
                        {n.type === 'error' ? <AlertCircle size={20} /> : n.type === 'info' && <Info size={20} />}

                        <span className="font-medium text-sm">{n.message}</span>

                        <button onClick={() => removeNotification(n.id)} className="ml-2 opacity-50 hover:opacity-100">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}
