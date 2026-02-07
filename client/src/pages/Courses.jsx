
import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import CourseService from "../services/course.service";
import StudyTimer from "../components/StudyTimer";
import ActivityService from "../services/activity.service";
import CourseFormModal from "../components/CourseFormModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNotification } from "../context/NotificationContext";
import { Plus, Play, Link as LinkIcon, Trash2, Edit2, Video, CheckCircle, Circle, Clock } from "lucide-react";

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Add/Edit State
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [activeCourse, setActiveCourse] = useState(null); // Timer State
    const [activeTopic, setActiveTopic] = useState(null); // Topic Timer State

    // Delete Confirmation State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");

    const { addNotification } = useNotification();

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            loadCourses(currentUser.id);
        }
    }, []);

    const loadCourses = async (userId) => {
        try {
            setLoading(true);
            const response = await CourseService.getAll(userId);
            setCourses(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error loading courses:", error);
        } finally {
            setLoading(false);
        }
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

    const openCreateModal = () => {
        setEditingCourse(null);
        setIsAddCourseOpen(true);
    };

    const openEditModal = (course, e) => {
        e.stopPropagation();
        setEditingCourse(course);
        setIsAddCourseOpen(true);
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

    const handleTimerSave = async (minutes, topicId) => {
        try {
            await ActivityService.logSession({
                userId: user.id,
                courseId: activeCourse.id,
                topicId: topicId,
                minutes: minutes,
                date: new Date().toLocaleDateString('en-CA') // Local YYYY-MM-DD
            });

            // Refresh courses to update progress
            loadCourses(user.id);
            setActiveCourse(null);
            setActiveTopic(null);
            addNotification(`Great job! logged ${minutes.toFixed(1)} minutes.`, "success");
        } catch (err) {
            console.error(err);
            addNotification("Failed to save activity.", "error");
        }
    };

    // Toggle Topic Logic (extracted from Modal)
    const handleToggle = async (courseId, topicId) => {
        // Find course and topic
        const course = courses.find(c => c.id === courseId);
        if (!course) return;

        // Optimistic Update
        const updatedCourses = courses.map(c => {
            if (c.id === courseId) {
                return {
                    ...c,
                    topics: c.topics.map(t =>
                        t.id === topicId ? { ...t, isCompleted: !t.isCompleted } : t
                    )
                };
            }
            return c;
        });
        setCourses(updatedCourses);

        try {
            // API Call
            const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
            await fetch(`http://localhost:5000/api/topics/${topicId}/toggle`, {
                method: 'PUT',
                headers: { 'x-access-token': token }
            });
            // No need to reload, optimistic update handles it. 
            // Ideally verify success but for prototype this is smooth.
        } catch (err) {
            console.error("Failed to toggle topic", err);
            loadCourses(user.id); // Revert on error
        }
    };

    const formatTime = (hours) => {
        if (!hours) return "0m";
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        if (h === 0) return `${m}m`;
        if (m === 0) return `${h}h`;
        return `${h}h ${m}m`;
    };

    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

    // Filter active and completed courses
    const activeCourses = courses.filter(course => {
        const target = parseFloat(course.targetHours || 0);
        const studied = parseFloat(course.studiedHours || 0);
        return target === 0 || studied < target;
    });

    const completedCourses = courses.filter(course => {
        const target = parseFloat(course.targetHours || 0);
        const studied = parseFloat(course.studiedHours || 0);
        return target > 0 && studied >= target;
    });

    return (
        <div className="h-full">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-10 pt-4 md:pt-0">
                <div>
                    <h2 className="text-3xl font-bold mb-1 text-black">My Subjects</h2>
                    <p className="text-gray-500 font-medium">Review and manage your learning path.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={openCreateModal}
                        className="bg-[#ffa500] text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 hover:text-white transition flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Subject
                    </button>
                </div>
            </div>

            {/* ADD/EDIT COURSE MODAL */}
            {isAddCourseOpen && (
                <CourseFormModal
                    onClose={() => setIsAddCourseOpen(false)}
                    onSubmit={handleCourseSubmit}
                    initialData={editingCourse}
                />
            )}

            {/* CONFIRMATION MODAL */}
            <ConfirmationModal
                isOpen={isConfirmOpen}
                title="Delete Subject"
                message={confirmMessage}
                onConfirm={confirmCallback}
                onCancel={() => setIsConfirmOpen(false)}
                confirmText="Delete"
                confirmColor="bg-red-500"
            />

            {/* CONTENT */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading your subjects...</div>
            ) : activeCourses.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700 transition-colors">
                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">No active subjects!</h3>
                    <p className="text-gray-400 mb-6">
                        {completedCourses.length > 0 ? "You've finished everything! Check below." : "Add a subject to get started."}
                    </p>
                    <button
                        onClick={openCreateModal}
                        className="bg-[#ffa500] text-black px-6 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 hover:text-white transition"
                    >
                        <Plus size={16} className="inline mr-2" /> Start New Subject
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCourses.map(course => (
                        <div
                            key={course.id}
                            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition group flex flex-col h-[400px] relative"
                        >
                            {/* Header Section */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 ${course.color || 'bg-orange-100 dark:bg-orange-900'} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                                        📖
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-800 dark:text-white truncate capitalize" title={course.title}>{course.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                            <span>{(course.topics?.filter(t => t.isCompleted).length || 0)}/{(course.topics?.length || 0)} Topics</span>
                                            <span>•</span>
                                            <span>{formatTime(course.targetHours)} Total</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => openEditModal(course, e)}
                                        className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => requestDelete(course.id, e)}
                                        className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center text-xs mb-1.5">
                                    <span className="text-gray-400 font-medium">Progress</span>
                                    <span className="font-bold text-[#ffa500]">
                                        {course.targetHours > 0
                                            ? Math.round((course.studiedHours / course.targetHours) * 100)
                                            : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-[#ffa500] h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, (course.studiedHours / (course.targetHours || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Expanded Topics List - Scrollable */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 mb-6">
                                {course.topics && course.topics.length > 0 ? (
                                    course.topics.map((topic, i) => (
                                        <div key={topic.id} className="group/topic">
                                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                                <button
                                                    onClick={() => handleToggle(course.id, topic.id)}
                                                    className="mt-0.5 text-gray-300 hover:text-[#ffa500] transition flex-shrink-0"
                                                >
                                                    {topic.isCompleted ? <CheckCircle size={18} className="text-green-500 bg-green-50 dark:bg-green-900/30 rounded-full" /> : <Circle size={18} />}
                                                </button>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <span className={`font-bold text-sm text-gray-700 dark:text-gray-200 capitalize leading-tight ${topic.isCompleted ? 'line-through text-gray-400' : ''}`}>
                                                            {topic.title}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            {topic.targetMinutes > 0 && (
                                                                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded flex-shrink-0">
                                                                    <Clock size={10} className="text-orange-400" />
                                                                    <span>{topic.targetMinutes}m</span>
                                                                    {topic.studiedMinutes > 0 && <span className="text-green-500">({parseFloat(topic.studiedMinutes).toFixed(2)}m done)</span>}
                                                                </div>
                                                            )}
                                                            {(!topic.isCompleted && (!topic.targetMinutes || topic.studiedMinutes < topic.targetMinutes)) && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setActiveCourse(course);
                                                                        setActiveTopic(topic);
                                                                    }}
                                                                    className="p-1 rounded-full bg-orange-100 text-orange-500 hover:bg-[#ffa500] hover:text-white transition"
                                                                    title="Start Topic Session"
                                                                >
                                                                    <Play size={10} fill="currentColor" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Resources */}
                                                    {topic.resources && topic.resources.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {topic.resources.map((r, idx) => (
                                                                <a
                                                                    key={idx}
                                                                    href={r.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded text-xs hover:bg-orange-100 dark:hover:bg-orange-900/40 transition"
                                                                    title={r.title}
                                                                >
                                                                    {r.type === 'video' ? <Video size={10} /> : <LinkIcon size={10} />}
                                                                    <span className="truncate max-w-[100px]">{r.title}</span>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400 text-sm italic">
                                        No topics added yet.
                                    </div>
                                )}
                            </div>

                            {/* Footer / Start Session */}
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                                <div className="flex justify-between items-center">
                                    {course.dueDate ? (
                                        <span className="flex items-center gap-1 text-xs text-orange-400 font-bold bg-orange-50 dark:bg-gray-700 px-2 py-1 rounded">
                                            Due: {course.dueDate}
                                        </span>
                                    ) : <span></span>}

                                    {(parseFloat(course.studiedHours || 0) >= parseFloat(course.targetHours || 0) && parseFloat(course.targetHours || 0) > 0) ? (
                                        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 cursor-default">
                                            <CheckCircle size={14} /> Completed
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setActiveCourse(course);
                                            }}
                                            className="bg-[#ffa500] text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 hover:text-white transition flex items-center gap-2 shadow-lg shadow-orange-200 dark:shadow-none"
                                        >
                                            <Play size={14} fill="currentColor" /> Start Session
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* COMPLETED SUBJECTS SECTION */}
            {completedCourses.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <CheckCircle className="text-green-500" /> Completed Subjects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 hover:opacity-100 transition-opacity">
                        {completedCourses.map(course => (
                            <div
                                key={course.id}
                                className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[400px] relative grayscale hover:grayscale-0 transition duration-500"
                            >
                                {/* Header Section */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-14 h-14 ${course.color || 'bg-gray-200 dark:bg-gray-700'} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                                            🎓
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-600 dark:text-gray-300 truncate capitalize" title={course.title}>{course.title}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                <span>{formatTime(course.targetHours)} Total</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => requestDelete(course.id, e)}
                                            className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center text-xs mb-1.5">
                                        <span className="text-gray-400 font-medium">Progress</span>
                                        <span className="font-bold text-green-600">100%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div className="bg-green-500 h-2 rounded-full w-full"></div>
                                    </div>
                                </div>

                                {/* Completed Topics List */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 mb-6">
                                    {course.topics && course.topics.length > 0 ? (
                                        course.topics.map((topic, i) => (
                                            <div key={topic.id} className="group/topic">
                                                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition">
                                                    <div className="mt-0.5 text-green-500 flex-shrink-0">
                                                        <CheckCircle size={18} className="bg-green-100 dark:bg-green-900/30 rounded-full" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <span className="font-bold text-sm text-gray-500 dark:text-gray-400 capitalize leading-tight line-through">
                                                                {topic.title}
                                                            </span>
                                                            {topic.targetMinutes > 0 && (
                                                                <div className="text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded flex-shrink-0">
                                                                    {topic.targetMinutes}m
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 text-sm italic">
                                            No topics added.
                                        </div>
                                    )}
                                </div>

                                {/* Completion Badge */}
                                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 justify-center cursor-default">
                                        <CheckCircle size={14} /> Completed
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STUDY TIMER */}
            {
                activeCourse && (
                    <StudyTimer
                        course={activeCourse}
                        topic={activeTopic}
                        onClose={() => {
                            setActiveCourse(null);
                            setActiveTopic(null);
                        }}
                        onSave={handleTimerSave}
                    />
                )
            }
        </div>
    );
}
