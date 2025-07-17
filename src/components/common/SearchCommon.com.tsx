import React from 'react';

interface SearchCommonProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    loading?: boolean;
    placeholder?: string;
}

const SearchCommon: React.FC<SearchCommonProps> = ({ value, onChange, onSearch, loading, placeholder }) => {
    return (
        <div className="relative flex items-center gap-2 w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder || 'Tìm kiếm...'}
                className="w-1/2 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
            />
            <button
                onClick={onSearch}
                disabled={loading}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold shadow transition-all duration-200 flex items-center gap-2 disabled:opacity-60"
                title="Tra cứu theo tên"
            >
                {loading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <span>Tra Cứu</span>
                )}
            </button>
        </div>
    );
};

export default SearchCommon;