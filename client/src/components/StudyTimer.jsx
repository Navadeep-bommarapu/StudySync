import { useState, useEffect } from "react";
import { X, Play, Pause, Square } from "lucide-react";

export default function StudyTimer({ course, topic, onClose, onSave }) {
    if (!course) return null; // Safety check

    const [targetReached, setTargetReached] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [accumulatedTime, setAccumulatedTime] = useState(0);

    // Calculate remaining time safely
    let targetSeconds = 0;
    let studiedSeconds = 0;

    if (topic) {
        targetSeconds = (topic.targetMinutes || 30) * 60;
        studiedSeconds = (topic.studiedMinutes || 0) * 60;
    } else {
        const targetHours = parseFloat(course.targetHours) || 0;
        const studiedHours = parseFloat(course.studiedHours) || 0;
        targetSeconds = targetHours * 3600;
        studiedSeconds = studiedHours * 3600;
    }

    const remainingSeconds = Math.max(0, targetSeconds - studiedSeconds);

    useEffect(() => {
        let interval = null;
        if (isActive && startTime) {
            interval = setInterval(() => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTime) / 1000);
                const totalSeconds = accumulatedTime + elapsed;

                setSeconds(totalSeconds);

                // Check if we hit the target
                if (remainingSeconds > 0 && totalSeconds >= remainingSeconds && !targetReached) {
                    setTargetReached(true);
                    // We don't stop the timer automatically, we just notify
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, startTime, accumulatedTime, remainingSeconds, targetReached]);

    // Auto-close when target reached (Optional: removed auto-close to let user decide)

    const toggle = () => {
        if (isActive) {
            // Pause
            setIsActive(false);
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            setAccumulatedTime(prev => prev + elapsed);
            setStartTime(null);
        } else {
            // Play
            setIsActive(true);
            setStartTime(Date.now());
        }
    };

    const handleStop = () => {
        setIsActive(false);

        let totalS = accumulatedTime;
        if (isActive && startTime) {
            const now = Date.now();
            totalS += Math.floor((now - startTime) / 1000);
        }

        // Convert seconds to minutes (float) for precision
        const minutes = totalS / 60;
        onSave(minutes, topic?.id);
    };

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        // Pad with leading zeros
        const pad = val => val < 10 ? `0${val}` : val;
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    };

    const progressPercent = remainingSeconds > 0 ? Math.min(100, (seconds / remainingSeconds) * 100) : 0;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl flex flex-col items-center relative animate-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition">
                    <X size={24} />
                </button>

                <div className={`w-16 h-16 ${course.color || 'bg-orange-100'} rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                    📖
                </div>

                <h3 className="text-xl font-bold text-gray-800 text-center mb-1">
                    {topic ? `Studying: ${topic.title}` : `Studying: ${course.title}`}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                    {topic ? `in ${course.title}` : 'Stay focused!'}
                </p>

                {/* Progress Ring or Bar */}
                {remainingSeconds > 0 && (
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${targetReached ? 'bg-green-500' : 'bg-[#ffa500]'}`}
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                )}

                {targetReached && (
                    <div className="mb-4 bg-green-100 text-green-700 px-4 py-2 rounded-xl text-xs font-bold animate-pulse">
                        🎉 Target Reached!
                    </div>
                )}

                <div className={`text-6xl font-mono font-bold mb-10 tracking-wider ${targetReached ? 'text-green-500' : 'text-[#ffa500]'}`}>
                    {formatTime(seconds)}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={toggle}
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition shadow-lg ${isActive ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-[#ffa500] hover:bg-orange-600'}`}
                    >
                        {isActive ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
                    </button>

                    <button
                        onClick={handleStop}
                        className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition shadow-lg"
                    >
                        <Square size={24} fill="white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
