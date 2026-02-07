import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import "../styles/calendar.css"; // Reuse existing styles or override

export default function DailyScheduleWidget({ courses }) {
    const [date, setDate] = useState(new Date());

    // Filter tasks/deadlines for selected date
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    const tasksForDay = courses.filter(c => c.dueDate === selectedDateStr);

    return (
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full min-h-[500px]">
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                <span className="bg-[#ffa500] text-white p-1 rounded-lg">📅</span> Calendar
            </h2>

            {/* CALENDAR */}
            <div className="mb-6">
                <Calendar
                    onChange={setDate}
                    value={date}
                    className="w-full border-none font-sans text-sm dark:bg-gray-900 dark:text-gray-300"
                    nextLabel={<ChevronRight size={16} className="text-gray-400 hover:text-[#ffa500]" />}
                    prevLabel={<ChevronLeft size={16} className="text-gray-400 hover:text-[#ffa500]" />}
                    next2Label={null}
                    prev2Label={null}
                    tileClassName={({ activeStartDate, date, view }) =>
                        "rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 focus:bg-orange-100 dark:focus:bg-gray-600 transition-all h-10 w-10 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300 data-[active]:bg-[#ffa500] data-[active]:text-white"
                    }
                />
            </div>

            {/* TIMELINE / AGENDA */}
            <div className="flex-1 flex flex-col">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                    Schedule for {format(date, "MMM d")}
                </h3>

                <div className="overflow-y-auto custom-scrollbar flex-1 space-y-3 pr-1">
                    {tasksForDay.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 italic text-sm">
                            No study tasks for this day.
                        </div>
                    ) : (
                        tasksForDay.map(task => (
                            <div key={task.id} className="relative pl-4 border-l-2 border-[#ffa500] py-1">
                                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{task.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Target: {task.targetHours}h</p>
                            </div>
                        ))
                    )}

                    {/* Mock Timeline Items to show "Schedule" feel if empty? User wanted "timeline". 
                        I'll add static time slots if real tasks are missing just to simulate structure 
                        or leave it as task list. User said "display whole month day", 
                        so the Calendar is key. Use the task list for specific day details.
                    */}
                </div>
            </div>
        </div>
    );
}
