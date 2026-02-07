
import { useState, useEffect } from "react";

import { X, Plus, Trash2, Video, Link as LinkIcon, AlertCircle, Clock } from "lucide-react";
import DatePicker from "./DatePicker";


export default function CourseFormModal({ onClose, onSubmit, initialData = null }) {
    const [step, setStep] = useState(1);

    // Step 1 State
    const [formData, setFormData] = useState({
        title: "",
        targetHours: "",
        targetMinutes: "",
        dueDate: "",
        color: "bg-orange-100"
    });

    // Step 2 & 3 State (Topics)
    // Structure: [{ id: 1, title: 'Topic 1', resources: [{ type: 'link', title: 'Ref', url: '...' }] }]
    const [topics, setTopics] = useState([]);
    const [newTopic, setNewTopic] = useState("");

    // Initialize with data if editing
    useEffect(() => {
        if (initialData) {
            const decimalHours = initialData.targetHours || 0;
            const h = Math.floor(decimalHours);
            const m = Math.round((decimalHours - h) * 60);

            setFormData({
                title: initialData.title || "",
                targetHours: h === 0 && m === 0 ? "" : h.toString(),
                targetMinutes: h === 0 && m === 0 ? "" : m.toString(),
                dueDate: initialData.dueDate || "",
                color: initialData.color || "bg-orange-100"
            });
            // Map topics to our edit format
            if (initialData.topics) {
                setTopics(initialData.topics.map(t => ({
                    id: t.id || Date.now() + Math.random(), // Ensure ID for UI key
                    title: t.title,
                    isCompleted: t.isCompleted || false,
                    targetMinutes: t.targetMinutes || 30,
                    resources: t.resources || []
                })));
            }
        }
    }, [initialData]);

    // Helper to add topic
    const addTopic = () => {
        if (!newTopic.trim()) return;
        setTopics([...topics, { id: Date.now(), title: newTopic, isCompleted: false, targetMinutes: 30, resources: [] }]);
        setNewTopic("");
    };

    const removeTopic = (id) => {
        setTopics(topics.filter(t => t.id !== id));
    };

    // Helper to add resource
    const addResource = (topicId, type, title, url) => {
        setTopics(topics.map(t => {
            if (t.id === topicId) {
                return { ...t, resources: [...t.resources, { type, title, url }] };
            }
            return t;
        }));
    };

    // Sub-component for adding resource
    const ResourceInput = ({ topicId }) => {
        const [showInput, setShowInput] = useState(false);
        const [rType, setRType] = useState("link");
        const [rTitle, setRTitle] = useState("");
        const [rUrl, setRUrl] = useState("");

        const handleAdd = () => {
            if (rTitle && rUrl) {
                addResource(topicId, rType, rTitle, rUrl);
                setShowInput(false);
                setRTitle("");
                setRUrl("");
            }
        };

        if (!showInput) return (
            <button onClick={() => setShowInput(true)} className="text-xs text-[#ffa500] font-bold mt-2 hover:underline flex items-center gap-1">
                <Plus size={12} /> Add Resource
            </button>
        );

        return (
            <div className="mt-2 text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border border-gray-100 dark:border-gray-600">
                <select value={rType} onChange={e => setRType(e.target.value)} className="w-full text-xs p-1 mb-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none">
                    <option value="link">Article/Link</option>
                    <option value="video">Video</option>
                </select>
                <input
                    placeholder="Title (e.g. Intro to JS)"
                    className="w-full p-1 mb-1 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white text-xs"
                    value={rTitle} onChange={e => setRTitle(e.target.value)}
                />
                <input
                    placeholder="URL"
                    className="w-full p-1 mb-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white text-xs"
                    value={rUrl} onChange={e => setRUrl(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowInput(false)} className="text-xs text-gray-400 hover:text-gray-200">Cancel</button>
                    <button onClick={handleAdd} className="text-xs bg-[#ffa500] text-white px-2 py-1 rounded">Add</button>
                </div>
            </div>
        );
    };

    const colorOptions = [
        "bg-orange-100", "bg-blue-100", "bg-green-100",
        "bg-yellow-100", "bg-purple-100", "bg-pink-100"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        // Calculate total hours from ALL topics
        const totalMinutes = topics.reduce((acc, t) => acc + (parseInt(t.targetMinutes) || 0), 0);
        const finalTargetHours = totalMinutes / 60;

        // Prepare final data
        const payload = {
            ...(initialData && { id: initialData.id }), // Include ID if editing
            ...formData,
            targetHours: finalTargetHours,
            dueDate: formData.dueDate ? formData.dueDate : null, // Set dueDate to null if empty string
            topics: topics.map(t => ({ // Strip temporary IDs if needed, but for now just send
                title: t.title,
                isCompleted: t.isCompleted || false,
                targetMinutes: parseInt(t.targetMinutes) || 30,
                resources: t.resources
            }))
        };
        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#ffa500] p-6 flex justify-between items-center text-white">
                    <h2 className="text-2xl font-bold">
                        {initialData ? "Edit Subject" : "Add New Subject"}
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject Title</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-[#ffa500] focus:bg-white dark:focus:bg-gray-600 rounded-xl outline-none transition font-medium dark:text-white placeholder-gray-400"
                                    placeholder="e.g. Advanced Calculus"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>



                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Due Date (Optional)</label>
                                <DatePicker
                                    value={formData.dueDate || ""}
                                    onChange={(date) => setFormData({ ...formData, dueDate: date })}
                                    placeholder="Select due date"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Color Tag</label>
                                <div className="flex gap-3">
                                    {colorOptions.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-12 h-12 rounded-full border-2 ${color} ${formData.color === color ? 'border-gray-600 dark:border-white scale-110 shadow-md' : 'border-transparent'} transition cursor-pointer`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            {/* Topics List */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Topics to Learn</label>
                                <p className="text-xs text-gray-400 mb-4">Add the specific topics you need to cover.</p>

                                <div className="space-y-3 mb-4">
                                    {topics.length === 0 && <p className="text-sm text-gray-300 italic">No topics added yet.</p>}
                                    {topics.map((t, idx) => (
                                        <div key={t.id} className="border border-gray-100 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                                    <span className="font-bold text-gray-700 dark:text-white capitalize truncate">#{idx + 1} {t.title}</span>

                                                    {/* Aesthetic Time Input */}
                                                    <div className="flex items-center gap-1 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 px-3 py-1.5 rounded-full border border-orange-200/50 dark:border-gray-600 shadow-sm transition hover:shadow-md hover:border-orange-300 group/time">
                                                        <Clock size={13} className="text-[#ffa500] group-hover/time:rotate-12 transition-transform" />
                                                        <input
                                                            type="number"
                                                            className="w-8 bg-transparent text-xs font-bold text-gray-700 dark:text-gray-200 text-center focus:outline-none p-0 appearance-none selection:bg-orange-200"
                                                            placeholder="30"
                                                            min="1"
                                                            value={t.targetMinutes}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setTopics(topics.map(topic =>
                                                                    topic.id === t.id ? { ...topic, targetMinutes: val } : topic
                                                                ));
                                                            }}
                                                        />
                                                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold lowercase tracking-wide">min</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeTopic(t.id)} className="text-gray-300 hover:text-red-500 transition p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Sub-list of resources */}
                                            {t.resources.map((r, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300 ml-2 mb-1">
                                                    {r.type === 'video' ? <Video size={10} /> : <LinkIcon size={10} />}
                                                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-[150px]">{r.title}</a>
                                                </div>
                                            ))}

                                            <ResourceInput topicId={t.id} />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a new topic..."
                                        className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-none outline-none text-sm dark:text-white dark:placeholder-gray-400"
                                        value={newTopic}
                                        onChange={e => setNewTopic(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addTopic()}
                                    />
                                    <button onClick={addTopic} className="bg-gray-800 dark:bg-black text-white p-3 rounded-xl hover:bg-black dark:hover:bg-gray-900 transition">
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                    {step === 1 ? (
                        <button onClick={onClose} className="font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">Cancel</button>
                    ) : (
                        <button onClick={() => setStep(1)} className="font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">Back</button>
                    )}

                    {step === 1 ? (
                        <button
                            disabled={!formData.title}
                            onClick={() => setStep(2)}
                            className="bg-[#ffa500] text-black px-8 py-3 rounded-xl font-bold hover:bg-orange-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {initialData ? "Next: Review Topics" : "Next: Add Topics"}
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="bg-[#ffa500] text-black px-8 py-3 rounded-xl font-bold hover:bg-orange-600 hover:text-white transition shadow-lg shadow-orange-200"
                        >
                            {initialData ? "Save Changes" : "Create Subject"}
                        </button>
                    )}
                </div>
            </div>
        </div >
    );
}
