import React from 'react';
import { Calendar } from 'lucide-react';

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
    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-amber-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Lọc theo thời gian</h3>
            </div>
            
         
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            <div className="flex gap-3">
                <button
                    onClick={onApplyFilter}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Áp dụng
                </button>
                <button
                    onClick={onResetFilter}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors border border-gray-600"
                >
                    Đặt lại
                </button>
            </div>
        </div>
    );
};

export default DateFilter;
