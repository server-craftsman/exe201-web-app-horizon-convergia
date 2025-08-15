import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface DateFilterProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onApplyFilter: () => void;
    onResetFilter: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onApplyFilter,
    onResetFilter
}) => {
    const getQuickDateRange = (range: 'today' | 'week' | 'month' | 'year') => {
        const now = new Date();
        const end = new Date(now);
        let start = new Date(now);

        switch (range) {
            case 'today':
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'week':
                start.setDate(now.getDate() - 7);
                break;
            case 'month':
                start.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                start.setFullYear(now.getFullYear() - 1);
                break;
        }

        return {
            start: start.toISOString().slice(0, 16),
            end: end.toISOString().slice(0, 16)
        };
    };

    const handleQuickFilter = (range: 'today' | 'week' | 'month' | 'year') => {
        const { start, end } = getQuickDateRange(range);
        onStartDateChange(start);
        onEndDateChange(end);
    };

    const getRangeLabel = (range: 'today' | 'week' | 'month' | 'year') => {
        switch (range) {
            case 'today': return 'Hôm nay';
            case 'week': return '1 tuần qua';
            case 'month': return '1 tháng qua';
            case 'year': return '1 năm qua';
            default: return '';
        }
    };

    const isActiveQuickFilter = (range: 'today' | 'week' | 'month' | 'year') => {
        const { start, end } = getQuickDateRange(range);
        return startDate === start && endDate === end;
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-amber-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Lọc theo thời gian</h3>
            </div>

            {/* Quick Filter Buttons */}
            <div className="mb-6">
                <div className="flex items-center mb-3">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-300">Lọc nhanh:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(['today', 'week', 'month', 'year'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => handleQuickFilter(range)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActiveQuickFilter(range)
                                ? 'bg-amber-500 text-white shadow-lg'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border border-gray-600'
                                }`}
                        >
                            {getRangeLabel(range)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Date Range */}
            <div className="mb-4">
                <div className="flex items-center mb-3">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-300">Khoảng thời gian tùy chỉnh:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
                            Từ ngày
                        </label>
                        <input
                            type="datetime-local"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
                            Đến ngày
                        </label>
                        <input
                            type="datetime-local"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={onApplyFilter}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                    <Calendar className="w-4 h-4 mr-2" />
                    Áp dụng bộ lọc
                </button>
                <button
                    onClick={onResetFilter}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors border border-gray-600"
                >
                    Đặt lại
                </button>
            </div>

            {/* Current Filter Display */}
            {(startDate || endDate) && (
                <div className="mt-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="text-sm text-gray-300">
                        <span className="font-medium">Bộ lọc hiện tại:</span>
                        <div className="mt-1 text-gray-400">
                            {startDate && <div>Từ: {new Date(startDate).toLocaleString('vi-VN')}</div>}
                            {endDate && <div>Đến: {new Date(endDate).toLocaleString('vi-VN')}</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateFilter;
