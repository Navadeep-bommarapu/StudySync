import { useEffect } from 'react';
import AuthService from '../services/auth.service';

const useSessionTimeout = (timeout = 1800000) => { // Default to 30 mins
    useEffect(() => {
        let timer;

        const logout = () => {
            AuthService.logout();
            window.location.href = "/";
        };

        const resetTimer = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(logout, timeout);
        };

        // Events to detect user activity
        const events = ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        // Add event listeners
        events.forEach(event => window.addEventListener(event, resetTimer));

        // Initial start
        resetTimer();

        // Cleanup
        return () => {
            events.forEach(event => window.removeEventListener(event, resetTimer));
            if (timer) clearTimeout(timer);
        };
    }, [timeout]);
};

export default useSessionTimeout;
