import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import 'react-calendar/dist/Calendar.css';
import { useTheme } from "../context/ThemeContext";

export default function DatePicker({ value, onChange, placeholder = "Select date", className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const { theme } = useTheme();

    // Handle outside click to close
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDateChange = (date) => {
        // Format to YYYY-MM-DD for consistency with native input
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        const dateStr = localDate.toISOString().split('T')[0];
        onChange(dateStr);
        setIsOpen(false);
    };

    // Parse value to Date object for calendar
    const dateValue = value ? new Date(value) : null;

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus-within:border-[#ffa500] focus-within:bg-white dark:focus-within:bg-gray-600 rounded-xl transition flex items-center justify-between cursor-pointer group"
            >
                <div className={`flex items-center gap-3 ${!value ? 'text-gray-400' : 'text-gray-800 dark:text-white font-medium'}`}>
                    <CalendarIcon size={20} className={isOpen ? "text-[#ffa500]" : "text-gray-400 group-hover:text-[#ffa500] transition"} />
                    <span>{value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : placeholder}</span>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 top-full left-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                    <style>
                        {`
                            .react-calendar {
                                border: none;
                                background: transparent;
                                font-family: inherit;
                                width: 260px; /* Fixed smaller width */
                            }
                            .react-calendar__navigation {
                                display: flex;
                                margin-bottom: 0.5rem;
                            }
                            .react-calendar__navigation button {
                                min-width: 30px;
                                background: none;
                                font-size: 14px;
                                font-weight: bold;
                                color: ${theme === 'dark' ? '#fff' : '#1f2937'};
                            }
                            .react-calendar__navigation button:enabled:hover,
                            .react-calendar__navigation button:enabled:focus {
                                background-color: ${theme === 'dark' ? '#374151' : '#f3f4f6'};
                                border-radius: 8px;
                            }
                            .react-calendar__month-view__weekdays {
                                color: #9ca3af;
                                font-size: 0.65rem;
                                font-weight: bold;
                                text-decoration: none;
                                text-transform: uppercase;
                            }
                            .react-calendar__month-view__days__day {
                                color: ${theme === 'dark' ? '#d1d5db' : '#374151'};
                                font-weight: 500;
                                font-size: 12px;
                            }
                            .react-calendar__tile {
                                padding: 6px 4px;
                                border-radius: 6px;
                                transition: all 0.2s;
                            }
                            .react-calendar__tile:enabled:hover,
                            .react-calendar__tile:enabled:focus {
                                background-color: ${theme === 'dark' ? '#374151' : '#f3f4f6'};
                                color: #ffa500;
                            }
                            .react-calendar__tile--now {
                                background: transparent !important;
                                color: #ffa500 !important;
                                border: 1px solid #ffa500 !important;
                            }
                            .react-calendar__tile--active {
                                background: #ffa500 !important;
                                color: white !important;
                                box-shadow: 0 4px 6px -1px rgba(255, 165, 0, 0.3);
                            }
                            .react-calendar__month-view__days__day--weekend {
                                color: #f87171;
                            }
                            .dark .react-calendar__month-view__days__day--neighboringMonth {
                                color: #4b5563;
                            }
                        `}
                    </style>
                    <Calendar
                        onChange={handleDateChange}
                        value={dateValue}
                        calendarType="gregory"
                        prevLabel={<ChevronLeft size={20} />}
                        nextLabel={<ChevronRight size={20} />}
                    />
                </div>
            )}
        </div>
    );
}
