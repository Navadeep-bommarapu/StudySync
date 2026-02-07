import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import AuthService from "../services/auth.service";
import CourseService from "../services/course.service";

// Custom styles
import "../styles/calendar.css";

export default function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            loadCourses(user.id);
        }
    }, []);

    const loadCourses = async (userId) => {
        try {
            setLoading(true);
            const response = await CourseService.getAll(userId);
            setCourses(response.data);
        } catch (error) {
            console.error("Error loading courses:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter courses that have due dates
    const dueCourses = courses.filter(c => c.dueDate);

    // Get courses for a specific date
    const getCoursesForDate = (d) => {
        const dateStr = format(d, 'yyyy-MM-dd');
        return dueCourses.filter(c => c.dueDate === dateStr);
    };

    const tileContent = ({ date, view }) => {
        if (view === "month") {
            const dayCourses = getCoursesForDate(date);
            return dayCourses.length > 0 ? (
                <div className="flex flex-col gap-1 mt-1 w-full px-1">
                    {dayCourses.slice(0, 3).map((course, i) => {
                        const isCompleted = (parseFloat(course.studiedHours || 0) >= parseFloat(course.targetHours || 0) && parseFloat(course.targetHours || 0) > 0);
                        return (
                            <div
                                key={course.id}
                                className={`text-[10px] truncate px-1.5 py-0.5 rounded-md font-medium capitalize ${isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-600 decoration-green-600' : 'bg-[#ffa500]/10 text-orange-700'}`}
                                title={course.title}
                            >
                                {course.title}
                            </div>
                        )
                    })}
                    {dayCourses.length > 3 && (
                        <span className="text-[9px] text-gray-400 pl-1">+{dayCourses.length - 3} more</span>
                    )}
                </div>
            ) : null;
        }
    };

    const selectedDateCourses = getCoursesForDate(date);

    const formatTime = (hours) => {
        if (!hours) return "0m";
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        if (h === 0) return `${m}m`;
        if (m === 0) return `${h}h`;
        return `${h}h ${m}m`;
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-black dark:text-white">Calendar</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CALENDAR WIDGET */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-orange-100 dark:border-gray-700">
                    <Calendar
                        onChange={setDate}
                        value={date}
                        className="w-full border-none font-sans dark:bg-gray-800 dark:text-white"
                        tileContent={tileContent}
                        nextLabel={<ChevronRight size={20} className="text-gray-400 hover:text-[#ffa500]" />}
                        prevLabel={<ChevronLeft size={20} className="text-gray-400 hover:text-[#ffa500]" />}
                        next2Label={null}
                        prev2Label={null}
                        tileClassName={({ activeStartDate, date, view }) =>
                            "rounded-xl hover:bg-orange-50 dark:hover:bg-gray-700 focus:bg-orange-100 dark:focus:bg-gray-600 transition-all h-24 flex flex-col items-center justify-start pt-2 text-sm font-medium text-gray-700 dark:text-gray-300 data-[active]:bg-[#ffa500] data-[active]:text-white"
                        }
                    />
                </div>

                {/* SIDEBAR: EVENTS FOR SELECTED DATE */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Schedule for</h3>
                    <p className="text-4xl font-bold text-[#ffa500] mb-2">{format(date, "d")}</p>
                    <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold text-sm mb-6">{format(date, "MMMM yyyy")}</p>

                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-sm text-gray-400">Loading...</p>
                        ) : selectedDateCourses.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-400 italic">No deadlines for this day.</p>
                            </div>
                        ) : (
                            selectedDateCourses.map(course => {
                                const isCompleted = (parseFloat(course.studiedHours || 0) >= parseFloat(course.targetHours || 0) && parseFloat(course.targetHours || 0) > 0);
                                return (
                                    <div key={course.id} className={`p-4 rounded-2xl border ${isCompleted ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800' : 'bg-orange-50 dark:bg-gray-700 border-orange-100 dark:border-gray-600'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-8 h-8 ${course.color || 'bg-white dark:bg-gray-600'} rounded-full flex items-center justify-center text-xs shadow-sm`}>
                                                📖
                                            </div>
                                            <div>
                                                <h4 className={`font-bold text-sm capitalize ${isCompleted ? 'text-green-800 dark:text-green-300' : 'text-gray-800 dark:text-white'}`}>{course.title}</h4>
                                                {isCompleted ? (
                                                    <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Completed</span>
                                                ) : (
                                                    <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Due Today</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className={`text-xs pl-11 ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-300'}`}>
                                            Target: {formatTime(course.targetHours)} • {course.topics?.length || 0} Topics
                                        </p>
                                    </div>
                                );
                            })
                        )}

                        <div className="pt-6 border-t border-gray-50 dark:border-gray-700 mt-4">
                            <p className="text-xs text-gray-400 text-center">Select a date to view deadlines.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
