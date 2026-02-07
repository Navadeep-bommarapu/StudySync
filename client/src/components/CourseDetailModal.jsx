import { X, CheckCircle, Circle, Video, Link as LinkIcon, Plus, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function CourseDetailModal({ course, onClose, onStart }) {
    if (!course) return null;

    const [activeTab, setActiveTab] = useState("topics");
    const [localTopics, setLocalTopics] = useState(course.topics || []);

    useEffect(() => {
        setLocalTopics(course.topics || []);
    }, [course]);

    // Helper
    const formatTime = (hours) => {
        if (!hours) return "0m";
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        if (h === 0) return `${m}m`;
        if (m === 0) return `${h}h`;
        return `${h}h ${m}m`;
    };

    // Force visible style just in case of animation issues
    const overlayStyle = { opacity: 1, pointerEvents: 'auto' };

    const handleToggle = async (topicId) => {
        try {
            // Optimistic update
            const updatedTopics = localTopics.map(t =>
                t.id === topicId ? { ...t, isCompleted: !t.isCompleted } : t
            );
            setLocalTopics(updatedTopics);

            // API Call
            const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
            await fetch(`http://localhost:5000/api/topics/${topicId}/toggle`, {
                method: 'PUT',
                headers: { 'x-access-token': token }
            });
        } catch (err) {
            console.error("Failed to toggle topic", err);
            // Revert on error could be added here
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4 transition-opacity duration-200" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden transform transition-all duration-200 flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className={`${course.color || 'bg-orange-100 dark:bg-orange-900'} p-6 flex justify-between items-start`}>
                    <div>
                        <div className="bg-white/50 dark:bg-black/20 inline-flex px-3 py-1 rounded-full text-xs font-bold mb-2 backdrop-blur-md dark:text-gray-100">
                            {formatTime(course.targetHours)} Target
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white capitalize">{course.title}</h2>
                        <p className="text-gray-600 dark:text-gray-300 font-medium opacity-80 mt-1">
                            {formatTime(course.studiedHours)} studied so far
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {onStart && (
                            <button
                                onClick={onStart}
                                className="bg-black/80 hover:bg-black text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition shadow-sm backdrop-blur-md"
                            >
                                <Video size={16} className="hidden" /> {/* Hidden icon for spacing hack if needed, or proper icon */}
                                <span>Start Session</span>
                            </button>
                        )}
                        <button onClick={onClose} className="bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 p-2 rounded-full transition text-gray-700 dark:text-white">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 dark:border-gray-700 px-6 pt-4 gap-6 bg-white dark:bg-gray-800">
                    <button
                        onClick={() => setActiveTab("topics")}
                        className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === "topics" ? "border-[#ffa500] text-[#ffa500]" : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                    >
                        Topics & Progress
                    </button>
                    <button
                        onClick={() => setActiveTab("resources")}
                        className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === "resources" ? "border-[#ffa500] text-[#ffa500]" : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                    >
                        Resources Library
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 dark:bg-gray-900">
                    {activeTab === "topics" && (
                        <div className="space-y-3">
                            {!course.topics || course.topics.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">No topics added yet.</p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {/* Header (Desktop onlyish, or just hidden for mobile simplicity) */}
                                    <div className="hidden md:flex justify-between text-xs text-gray-400 uppercase tracking-wider px-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="w-12">Status</span>
                                        <span className="flex-1">Topic</span>
                                        <span>Resources</span>
                                    </div>

                                    {localTopics.map((topic) => (
                                        <div key={topic.id} className="group bg-white dark:bg-gray-800 p-3 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 hover:shadow-sm transition flex flex-col md:flex-row gap-3 items-start md:items-center">
                                            {/* Top Row (Mobile): Status + Title */}
                                            <div className="flex items-start gap-3 flex-1 w-full">
                                                <button
                                                    onClick={() => handleToggle(topic.id)}
                                                    className="mt-0.5 text-gray-300 hover:text-[#ffa500] transition shrink-0"
                                                >
                                                    {topic.isCompleted ? <CheckCircle size={22} className="text-green-500 bg-green-50 dark:bg-green-900/30 rounded-full" /> : <Circle size={22} />}
                                                </button>

                                                <div
                                                    className="flex-1 cursor-pointer"
                                                    onClick={() => handleToggle(topic.id)}
                                                >
                                                    <div className={`font-bold text-gray-800 dark:text-gray-200 capitalize leading-tight ${topic.isCompleted ? 'line-through text-gray-400 dark:text-gray-600' : ''}`}>
                                                        {topic.title}
                                                    </div>
                                                    {(topic.targetMinutes > 0) && (
                                                        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium mt-1">
                                                            <Clock size={12} className="text-orange-400" />
                                                            <span>{topic.targetMinutes} mins</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bottom Row (Mobile): Resources - Right aligned on Desktop */}
                                            <div className="pl-10 md:pl-0 flex justify-end md:justify-end w-full md:w-auto">
                                                {(topic.resources || []).length > 0 ? (
                                                    <div className="flex gap-2 flex-wrap justify-end">
                                                        {topic.resources.map((r, idx) => (
                                                            <a key={idx} href={r.url} target="_blank" rel="noopener noreferrer"
                                                                className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50 transition flex items-center gap-2"
                                                                title={`${r.type}: ${r.title}`}
                                                            >
                                                                {r.type === 'video' ? <Video size={16} className="shrink-0" /> : <LinkIcon size={16} className="shrink-0" />}
                                                                <span className="text-xs font-medium max-w-[80px] truncate md:hidden">{r.title}</span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="hidden md:inline text-xs text-gray-300">-</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "resources" && (
                        <div className="space-y-4">
                            {(!course.topics || course.topics.every(t => !t.resources || t.resources.length === 0)) ? (
                                <p className="text-gray-400 text-center py-8">No resources found.</p>
                            ) : (
                                course.topics.flatMap(t => (t.resources || []).map(r => ({ ...r, topicTitle: t.title }))).map((res, i) => (
                                    <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#ffa500] hover:shadow-md transition group">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${res.type === 'video' ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-500'}`}>
                                                {res.type === 'video' ? <Video size={20} /> : <LinkIcon size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 dark:text-white group-hover:text-[#ffa500] transition">{res.title}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">Topic: {res.topicTitle}</p>
                                                <p className="text-xs text-gray-400 truncate max-w-xs mt-1">{res.url}</p>
                                            </div>
                                        </div>
                                    </a>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
