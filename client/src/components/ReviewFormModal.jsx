import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
import ReviewService from "../services/review.service";
import AuthService from "../services/auth.service";
import { useNotification } from "../context/NotificationContext";

export default function ReviewFormModal({ onClose, onSuccess }) {
    const [review, setReview] = useState({ name: "", rating: 5, comment: "" });
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user && user.username) {
            const capitalizedName = user.username.charAt(0).toUpperCase() + user.username.slice(1);
            setReview(prev => ({ ...prev, name: capitalizedName }));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!review.name || !review.comment) return;

        setLoading(true);
        ReviewService.create(review)
            .then(() => {
                setLoading(false);
                addNotification("Review submitted successfully!", "success");
                if (onSuccess) onSuccess();
                onClose();
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                addNotification("Failed to submit review.", "error");
            });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white transition">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold mb-4 text-[#ffa500]">Write a Review</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div>
                        <label className="block font-bold mb-1 text-gray-700 dark:text-gray-200">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReview({ ...review, rating: star })}
                                    className={`transition-colors ${review.rating >= star ? "text-[#ffa500] fill-[#ffa500]" : "text-gray-300 dark:text-gray-600"}`}
                                >
                                    <Star size={24} fill={review.rating >= star ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block font-bold mb-1 text-gray-700 dark:text-gray-200">Comment</label>
                        <textarea
                            className="w-full border dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#ffa500] dark:bg-gray-700 dark:text-white transition"
                            rows={4}
                            value={review.comment}
                            onChange={e => setReview({ ...review, comment: e.target.value })}
                            placeholder="Share your experience..."
                            required
                        />
                    </div>
                    <button disabled={loading} className="bg-[#ffa500] text-black font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50">
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}
