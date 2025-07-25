import React from 'react';

export default function VideoFilters({ 
  activeFilter, 
  onFilterChange, 
  totalVideos, 
  filteredCount 
}) {
  const filters = [
    { id: 'all', label: '전체', icon: '🎬', count: totalVideos },
    { id: 'trending', label: '인기 급상승', icon: '📈', count: Math.floor(totalVideos * 0.3) },
    { id: 'recent', label: '최신 업로드', icon: '🆕', count: Math.floor(totalVideos * 0.2) },
    { id: 'high-score', label: '고득점', icon: '🏆', count: Math.floor(totalVideos * 0.25) },
    { id: 'arena-likes', label: '회원 추천', icon: '❤️', count: Math.floor(totalVideos * 0.15) }
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-neutral-800/50 text-gray-300 hover:text-white hover:bg-neutral-700/50 border border-neutral-700/50'
                }`}
          >
            <span className="text-lg">{filter.icon}</span>
            <span>{filter.label}</span>
            <span className="text-xs opacity-75">({filter.count})</span>
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-400">
        현재 표시: <span className="font-semibold text-white">{filteredCount}</span>개 영상
      </div>
    </div>
  );
} 