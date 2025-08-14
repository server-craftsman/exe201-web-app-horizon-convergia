import React from 'react';
import { useReview } from '@hooks/modules/useReview';
import { useUserInfo } from '@hooks/index';
import type { ReviewResponse } from '../../../../types/review/Review.res.type';
import { notificationMessage } from '@utils/helper';

interface ReviewManagementProps {
    productId: string;
    className?: string;
}

const Star: React.FC<{ filled: boolean; onClick?: () => void; size?: 'sm' | 'md' }>
    = ({ filled, onClick, size = 'md' }) => (
        <button type="button" onClick={onClick}
            className={`inline-flex ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} items-center justify-center`}
            aria-label="star">
            <svg viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
                className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${filled ? 'text-amber-500' : 'text-gray-300'}`}>
                <path strokeWidth="1.2" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.802-2.035a1 1 0 00-1.175 0l-2.802 2.035c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.17-3.292z" />
            </svg>
        </button>
    );

const ReviewManagement: React.FC<ReviewManagementProps> = ({ productId, className }) => {
    const user = useUserInfo();
    const { useProductReviews, createReview, deleteReview } = useReview();
    const { data, isLoading } = useProductReviews(productId);
    const reviews: ReviewResponse[] = (data?.items || []) as ReviewResponse[];

    const [text, setText] = React.useState('');
    const [rating, setRating] = React.useState<number>(5);

    const avgRating = React.useMemo(() => {
        if (!reviews.length) return 0;
        const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
        return Math.round((sum / reviews.length) * 10) / 10;
    }, [reviews]);

    const dist = React.useMemo(() => {
        const buckets = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
        for (const r of reviews) {
            const v = Math.max(1, Math.min(5, Number(r.rating) || 0));
            buckets[v] += 1;
        }
        return buckets;
    }, [reviews]);

    const handleSubmit = () => {
        if (!user?.id) { notificationMessage('Vui lòng đăng nhập để đánh giá', 'warning'); return; }
        if (!text.trim()) { notificationMessage('Vui lòng nhập nhận xét', 'warning'); return; }
        createReview.mutate({ comment: text.trim(), rating, productId, userId: user.id });
        setText('');
        setRating(5);
    };

    const handleDelete = (id: string) => deleteReview.mutate({ id, productId });

    return (
        <section className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 ${className || ''}`}>
            <div className="flex items-start gap-6 flex-col md:flex-row">
                {/* Summary */}
                <div className="w-full md:w-64">
                    <div className="flex items-end gap-2">
                        <div className="text-4xl font-extrabold text-gray-900">{avgRating || '0.0'}</div>
                        <div className="text-sm text-gray-500">/ 5</div>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} filled={i <= Math.round(avgRating)} size="md" />)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{reviews.length} đánh giá</div>
                    <div className="mt-4 space-y-1">
                        {[5, 4, 3, 2, 1].map(n => {
                            const count = dist[n];
                            const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                            return (
                                <div key={n} className="flex items-center gap-2">
                                    <div className="text-xs text-gray-600 w-10">{n} sao</div>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className="text-xs text-gray-500 w-8 text-right">{pct}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Write review */}
                <div className="flex-1">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-700">Chấm điểm:</span>
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} filled={i <= rating} onClick={() => setRating(i)} />
                                ))}
                            </div>
                        </div>
                        <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
                            placeholder="Chia sẻ cảm nhận của bạn..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        <div className="mt-2 flex justify-end">
                            <button onClick={handleSubmit}
                                disabled={createReview.isPending}
                                className="px-4 py-2 bg-gray-900 hover:bg-amber-600 text-white rounded-lg text-sm disabled:opacity-60">
                                {createReview.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews list */}
            <div className="mt-6">
                {isLoading ? (
                    <div className="text-gray-500 text-sm">Đang tải đánh giá...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-gray-500 text-sm">Chưa có đánh giá nào</div>
                ) : (
                    <div className="space-y-3">
                        {reviews.map((r) => (
                            <div key={r.id} className="flex items-start justify-between bg-white border border-gray-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-semibold">
                                        {r.userId?.slice(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map(i => <Star key={i} filled={i <= (r.rating || 0)} size="sm" />)}
                                            </div>
                                            <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString('vi-VN')}</span>
                                        </div>
                                        <div className="text-sm text-gray-800 mt-1">{r.comment}</div>
                                    </div>
                                </div>
                                {user?.id === r.userId && (
                                    <button onClick={() => handleDelete(r.id)}
                                        disabled={deleteReview.isPending}
                                        className="text-xs text-red-600 hover:underline">
                                        {deleteReview.isPending ? 'Đang xóa...' : 'Xóa'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ReviewManagement;
