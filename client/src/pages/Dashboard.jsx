
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import CourseService from "../services/course.service";
import ActivityService from "../services/activity.service";
import CourseFormModal from "../components/CourseFormModal";
import StudyTimer from "../components/StudyTimer";
import CourseDetailModal from "../components/CourseDetailModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNotification } from "../context/NotificationContext";

import { Plus, Trash2, Play, Edit2, Sun, Moon, CheckCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const QUOTES = [
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "Strive for progress, not perfection.", author: "Unknown" }
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // Quote State
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    // Pick a random quote initially
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const handleQuoteClick = () => {
    let newQuote;
    do {
      newQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    } while (newQuote === quote && QUOTES.length > 1); // Avoid picking the same quote twice in a row
    setQuote(newQuote);
  };

  // Modals & Active States
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null); // Course being edited
  const [activeCourse, setActiveCourse] = useState(null); // Course currently studying (Timer)
  const [detailCourse, setDetailCourse] = useState(null); // Course for modal details

  const [activityData, setActivityData] = useState([]);

  const { theme, toggleTheme } = useTheme();

  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const { addNotification } = useNotification();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadCourses(currentUser.id);
      loadStats(currentUser.id);
    }
  }, []);

  const loadCourses = async (userId) => {
    try {
      const res = await CourseService.getAll(userId);
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStats = async (userId) => {
    try {
      const res = await ActivityService.getStats(userId);
      setActivityData(res.data.yearlyData || []);
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setIsAddCourseOpen(true);
  };

  const openEditModal = (course, e) => {
    e.stopPropagation();
    setEditingCourse(course);
    setIsAddCourseOpen(true);
  };

  const handleCourseSubmit = async (courseData) => {
    try {
      if (editingCourse) {
        await CourseService.update(editingCourse.id, courseData);
        addNotification("Subject updated!", "success");
      } else {
        await CourseService.create({ ...courseData, userId: user.id });
        addNotification("Subject added successfully!", "success");
      }
      setIsAddCourseOpen(false);
      setEditingCourse(null);
      loadCourses(user.id);
    } catch (err) {
      console.error(err);
      addNotification(err.response?.data?.message || err.message || "Failed to save subject.", "error");
    }
  };



  const requestDelete = (courseId, e) => {
    e.stopPropagation();
    setConfirmMessage("Are you sure you want to delete this subject? All progress will be lost.");
    setConfirmCallback(() => () => performDelete(courseId));
    setIsConfirmOpen(true);
  };

  const performDelete = async (courseId) => {
    try {
      await CourseService.remove(courseId);
      loadCourses(user.id);
      setIsConfirmOpen(false);
      addNotification("Subject deleted.", "success");
    } catch (err) {
      console.error(err);
      addNotification("Failed to delete subject.", "error");
    }
  };

  const handleStartStudy = (course, e) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveCourse(course);
    addNotification(`Started studying ${course.title}`, "success");
  };

  const handleSaveSession = async (minutes) => {
    try {
      await ActivityService.logSession({
        userId: user.id,
        courseId: activeCourse.id,
        minutes,
        date: new Date().toLocaleDateString('en-CA')
      });

      loadCourses(user.id);
      loadStats(user.id);
      setActiveCourse(null);
      addNotification(`Great job! logged ${minutes.toFixed(1)} minutes.`, "success");
    } catch (err) {
      console.error(err);
      addNotification("Failed to log session.", "error");
    }
  };

  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  // Helper to format hours into "1h 30m" or "30m"
  const formatTime = (hours) => {
    if (!hours) return "0m";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 pt-4 md:pt-0">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-black dark:text-white">Dashboard</h1>
          <p className="text-gray-500 font-medium">Welcome back, {capitalize(user?.username)}!</p>
        </div>

        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-200 hover:text-[#ffa500] hover:border-orange-100 transition shadow-sm"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>





          {/* User Info */}
          <div
            onClick={() => navigate('/app/settings', { state: { openEditProfile: true } })}
            className="w-10 h-10 rounded-full border-2 border-[#ffa500] p-0.5 overflow-hidden cursor-pointer hover:opacity-80 transition"
            title="Edit Profile"
          >
            <img className="rounded-full" src={user?.gender === 'female' ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" : "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"} alt="User" />
          </div>
        </div>
      </div>


      {/* MODALS */}
      {
        isAddCourseOpen && (
          <CourseFormModal
            onClose={() => setIsAddCourseOpen(false)}
            onSubmit={handleCourseSubmit}
            initialData={editingCourse}
          />
        )
      }
      {
        activeCourse && (
          <StudyTimer course={activeCourse} onClose={() => setActiveCourse(null)} onSave={handleSaveSession} />
        )
      }

      {/* Course Detail Modal */}
      {detailCourse && (
        <CourseDetailModal
          course={detailCourse}
          onClose={() => setDetailCourse(null)}
          onStart={() => {
            const c = detailCourse;
            setDetailCourse(null);
            setActiveCourse(c);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title="Delete Subject"
        message={confirmMessage}
        onConfirm={confirmCallback}
        onCancel={() => setIsConfirmOpen(false)}
        confirmText="Delete"
        confirmColor="bg-red-500"
      />

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-12 gap-6 mb-8 items-start">

        {/* LEFT COLUMN: SUBJECTS (8 Cols) */}
        <div className="col-span-12 custom-lg:col-span-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">My Subjects</h3>
            <button
              onClick={openCreateModal}
              className="bg-[#ffa500] text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 hover:text-white transition flex items-center gap-2"
            >
              <Plus size={16} /> Add Subject
            </button>
          </div>

          {courses.filter(c => !c.targetHours || c.studiedHours < c.targetHours).length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors">
              <p className="text-gray-400 font-bold">No active subjects.</p>
              <button onClick={openCreateModal} className="text-[#ffa500] font-bold mt-2 hover:underline">Add a new subject</button>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
              {courses.filter(c => !c.targetHours || c.studiedHours < c.targetHours).map((course) => (
                <div
                  key={course.id}
                  onClick={() => setDetailCourse(course)}
                  className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-[#ffa500]/30 transition group relative cursor-pointer flex flex-col justify-between min-h-[160px] min-w-[280px] w-[280px] shrink-0"
                >
                  {/* Actions removed and moved to Courses page */}

                  <div className="flex items-start gap-3 mb-3 relative">
                    {/* Action Buttons */}
                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition z-10 bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm">
                      <button
                        onClick={(e) => openEditModal(course, e)}
                        className="p-1.5 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          requestDelete(course.id);
                        }}
                        className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className={`w-12 h-12 ${course.color || 'bg-orange-100 dark:bg-orange-900'} rounded-2xl flex items-center justify-center text-xl shadow-inner`}>
                      📖
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-800 dark:text-white truncate max-w-[140px] capitalize">{course.title}</h4>
                      <p className="text-gray-400 text-xs">{(course.topics?.filter(t => t.isCompleted).length || 0)}/{(course.topics?.length || 0)} Topics • {formatTime(course.targetHours)} Goal</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Progress</span>
                      <span className="font-bold text-[#ffa500]">{formatTime(course.studiedHours)} Done</span>
                    </div>

                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                      <div
                        className="bg-[#ffa500] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (course.studiedHours / (course.targetHours || 1)) * 100)}%` }}
                      ></div>
                    </div>

                    {(parseFloat(course.studiedHours || 0) >= parseFloat(course.targetHours || 0) && parseFloat(course.targetHours || 0) > 0) ? (
                      <div className="w-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-default">
                        <CheckCircle size={14} /> Completed
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleStartStudy(course, e)}
                        className="w-full bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white font-bold py-2.5 rounded-xl text-xs hover:bg-[#ffa500] hover:text-black transition flex items-center justify-center gap-2 group-hover:shadow-md"
                      >
                        <Play size={14} fill="currentColor" className="opacity-50" /> Start Session
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ACTIVITY CHART (Moved below Subjects) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
            {/* Check if any data exists for styling */}
            {(() => {
              const hasActivity = activityData && activityData.some(d => d.minutes > 0);

              return (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${hasActivity ? 'text-gray-800 dark:text-white' : 'text-gray-300 dark:text-gray-600'}`}>Study Activity</h3>
                    <div className="flex items-center gap-2 text-sm font-bold text-orange-500 bg-orange-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                      🔥 Streak: {activityData.streak || 0} Days
                    </div>
                  </div>

                  <div className="h-full flex flex-col">
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                        Past Year
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>Less</span>
                        <div className="w-[10px] h-[10px] bg-gray-100 dark:bg-white/5 rounded-[2px]" title="0 mins"></div>
                        <div className="w-[10px] h-[10px] bg-[#F2AC57] dark:bg-[#F2AC57]/30 rounded-[2px]" title="1-20 mins"></div>
                        <div className="w-[10px] h-[10px] bg-[#EE9336] dark:bg-[#EE9336]/50 rounded-[2px]" title="21-40 mins"></div>
                        <div className="w-[10px] h-[10px] bg-[#E87A18] dark:bg-[#E87A18]/70 rounded-[2px]" title="41-60 mins"></div>
                        <div className="w-[10px] h-[10px] bg-[#DE6105] dark:bg-[#DE6105]/85 rounded-[2px]" title="61-80 mins"></div>
                        <div className="w-[10px] h-[10px] bg-[#C64200] dark:bg-[#C64200] rounded-[2px]" title="81-100 mins"></div>
                        <div className="w-[10px] h-[10px] bg-[#A33600] dark:bg-[#A33600] rounded-[2px]" title="100+ mins"></div>
                        <span>More</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto pb-4 custom-scrollbar">
                      {/* Grid with 8 rows (7 days + 1 label row), filling column by column */}
                      <div className="grid grid-rows-[repeat(7,10px)_20px] grid-flow-col gap-[3px] w-max">
                        {(() => {
                          const today = new Date();
                          // We want exactly 52 or 53 weeks to show a full year?
                          // Usually 365 days.
                          const startDate = new Date(today);
                          startDate.setDate(today.getDate() - 364);

                          // Calculate offset to align Monday to top (Row 1)
                          // getDay(): Sun=0, Mon=1, ..., Sat=6
                          // We want Mon=0, ..., Sun=6
                          const startDay = startDate.getDay();
                          const offset = startDay === 0 ? 6 : startDay - 1;

                          // Generate Date Objects for 365 days
                          const allDays = [];
                          // Add offsets
                          for (let i = 0; i < offset; i++) allDays.push(null);
                          // Add real days
                          for (let i = 0; i < 365; i++) {
                            const d = new Date(startDate);
                            d.setDate(startDate.getDate() + i);
                            allDays.push(d);
                          }

                          // Map for data lookup
                          const activityMap = new Map();
                          activityData?.forEach(d => activityMap.set(d.dateStr, d));

                          // Group into Weeks to inject labels
                          const weeks = [];
                          let currentWeek = [];

                          allDays.forEach((day, index) => {
                            currentWeek.push(day);
                            if (currentWeek.length === 7) {
                              weeks.push(currentWeek);
                              currentWeek = [];
                            }
                          });
                          if (currentWeek.length > 0) {
                            // Fill remaining week with nulls if needed (shouldn't happen often if we plan right, but good for safety)
                            while (currentWeek.length < 7) currentWeek.push(null);
                            weeks.push(currentWeek);
                          }

                          // Flatten with Label logic
                          const flatGridItems = [];
                          let lastMonthLabel = -1;

                          weeks.forEach((week) => {
                            // Check for month label
                            // We show label if the first day of the week is the start of a month OR if the month changed within this week (simplified: check first valid day)
                            // Actually standard is: if the week contains the 1st, or close to it.
                            // Let's look at the first valid day of the week.
                            let label = null;
                            const firstDay = week.find(d => d !== null);
                            if (firstDay) {
                              const m = firstDay.getMonth();
                              if (m !== lastMonthLabel) {
                                label = firstDay.toLocaleDateString('en-US', { month: 'short' });
                                lastMonthLabel = m;
                              }
                            }

                            // Add the 7 day cells
                            week.forEach(dateObj => {
                              if (!dateObj) {
                                // Empty/Offset cell
                                flatGridItems.push({ type: 'empty' });
                              } else {
                                const dateStr = dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + String(dateObj.getDate()).padStart(2, '0');
                                const dayData = activityMap.get(dateStr) || { hours: 0, minutes: 0 };
                                flatGridItems.push({ type: 'day', dateStr, hours: dayData.hours || 0, minutes: dayData.minutes || 0 });
                              }
                            });

                            // Add the Label cell (8th row)
                            flatGridItems.push({ type: 'label', text: label });
                          });

                          return flatGridItems.map((item, idx) => {
                            if (item.type === 'empty') {
                              return <div key={idx} className="w-[10px] h-[10px]"></div>;
                            }

                            if (item.type === 'label') {
                              return (
                                <div key={idx} className="text-[10px] text-gray-400 dark:text-gray-500 font-medium h-[20px] flex items-end leading-none">
                                  {item.text}
                                </div>
                              );
                            }

                            // Fix: Use item.minutes directly as it contains the total minutes. 
                            // Previously (hours * 60) + minutes was double counting.
                            const totalMinutes = item.minutes;

                            let bgClass = "bg-gray-100 border-none dark:bg-white/5"; // Solid filled empty cells

                            // Custom Orange Palette (Matches User Image)
                            // Thresholds updated to every 20 minutes as requested
                            if (totalMinutes > 0) {
                              if (totalMinutes <= 20) bgClass = "bg-[#F2AC57] dark:bg-[#F2AC57]/30";      // Level 1: 1-20 mins
                              else if (totalMinutes <= 40) bgClass = "bg-[#EE9336] dark:bg-[#EE9336]/50"; // Level 2: 21-40 mins
                              else if (totalMinutes <= 60) bgClass = "bg-[#E87A18] dark:bg-[#E87A18]/70"; // Level 3: 41-60 mins
                              else if (totalMinutes <= 80) bgClass = "bg-[#DE6105] dark:bg-[#DE6105]/85"; // Level 4: 61-80 mins
                              else if (totalMinutes <= 100) bgClass = "bg-[#C64200] dark:bg-[#C64200]";   // Level 5: 81-100 mins
                              else bgClass = "bg-[#A33600] dark:bg-[#A33600]";                            // Level 6: 100+ mins
                            }

                            const today = new Date();
                            const offsetMinutes = today.getTimezoneOffset();
                            const localToday = new Date(today.getTime() - (offsetMinutes * 60000));
                            const todayStr = localToday.toISOString().split('T')[0];

                            const isToday = item.dateStr === todayStr;

                            return (
                              <div
                                key={item.dateStr}
                                className={`w-[10px] h-[10px] rounded-[2px] ${bgClass} group relative cursor-pointer transition-none ${isToday ? 'opacity-100 brightness-110 shadow-sm z-10' : 'hover:opacity-80'}`}
                              >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                  <div className="font-semibold">{item.dateStr} {isToday && "(Today)"}</div>
                                  <div>{item.hours}h ({Math.round(item.minutes)}m)</div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* NEW SECTION 1: STUDY INSIGHTS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            {/* 1. Total Study Time */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-2">
                ⏱️
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Total Time</p>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {courses.reduce((acc, c) => acc + (c.studiedHours || 0), 0).toFixed(1)}h
              </h4>
            </div>

            {/* 2. Total Subjects */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center text-center">
              <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center mb-2">
                📚
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Total Subjects</p>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {courses.length}
              </h4>
            </div>

            {/* 3. Active Subjects */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center text-center">
              <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center mb-2">
                �
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Active Subjects</p>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {courses.filter(c => !c.targetHours || (c.studiedHours < c.targetHours)).length}
              </h4>
            </div>

            {/* 4. Current Streak (or Best Streak) */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center text-center">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center mb-2">
                🔥
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Current Streak</p>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {activityData?.currentStreak || 0} days
              </h4>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: WEEKLY SCHEDULE (4 Cols) */}
        <div className="col-span-12 custom-lg:col-span-4 space-y-6 h-fit">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Weekly Schedule</h3>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {(() => {
                const today = new Date();

                return Array.from({ length: 7 }).map((_, i) => {
                  const date = new Date(today);
                  date.setDate(today.getDate() + i);

                  // Format YYYY-MM-DD manually to avoid UTC issues
                  const dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = date.getDate();

                  // Check if it is today (local time match)
                  const now = new Date();
                  const isToday = dayNum === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

                  const dayCourses = courses.filter(c => c.dueDate === dateStr);

                  return (
                    <div key={dateStr} className={`flex items-start gap-4 p-3 rounded-2xl transition group ${isToday ? 'bg-[#fff8e1] dark:bg-gray-700/50 border border-orange-100 dark:border-gray-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'}`}>
                      <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl font-bold shadow-sm transition shrink-0 ${isToday ? 'bg-[#ffa500] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 group-hover:bg-orange-200 group-hover:text-orange-700'}`}>
                        <span className="text-xs">{dayName}</span>
                        <span className="text-lg leading-none">{dayNum}</span>
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        {dayCourses.length > 0 ? (
                          dayCourses.map(course => (
                            <div
                              key={course.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailCourse(course);
                              }}
                              className="mb-2 last:mb-0 cursor-pointer group/item hover:bg-white/50 dark:hover:bg-white/10 p-1 rounded-lg transition"
                            >
                              <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm truncate group-hover/item:text-[#ffa500] transition capitalize">{course.title}</h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <div className={`w-2 h-2 rounded-full ${course.color || 'bg-orange-500'}`}></div>
                                {(parseFloat(course.studiedHours || 0) >= parseFloat(course.targetHours || 0) && parseFloat(course.targetHours || 0) > 0) ? (
                                  <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                                    <CheckCircle size={10} /> Completed
                                  </p>
                                ) : (
                                  <p className="text-xs text-[#ffa500] font-bold">Due Today</p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-full flex items-center">
                            <p className="text-xs text-gray-400 dark:text-gray-500 italic">No due dates</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Daily Motivation (Small Card) */}
          <div
            onClick={handleQuoteClick}
            className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-5 text-white shadow-md relative overflow-hidden h-fit transition-all duration-500 hover:scale-[1.02] cursor-pointer"
            title="Click for new motivation"
          >
            <div className="absolute -bottom-2 -right-2 opacity-20">
              <span className="text-6xl">❝</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xs font-bold mb-1 opacity-90 uppercase tracking-widest">Daily Motivation</h3>
              <div className="min-h-[80px] flex flex-col justify-center">
                <p className="text-sm font-bold leading-relaxed animate-in fade-in duration-700 key={quote.text}">
                  "{quote.text}"
                </p>
                <p className="mt-2 text-xs font-medium opacity-80">— {quote.author}</p>
              </div>
            </div>
          </div>
        </div>



      </div >
    </div >
  );
}
