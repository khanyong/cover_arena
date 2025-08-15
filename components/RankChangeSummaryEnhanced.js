import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function RankChangeSummaryEnhanced({ videos, competitionId, excludeFirst = false, onVideoClick }) {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'weekly', 'new'
  const [risingStars, setRisingStars] = useState({
    daily: [],
    weekly: [],
    newEntry: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    if (videos && videos.length > 0) {
      calculateRisingStars();
    }
  }, [videos, excludeFirst]); // videos가 변경될 때 다시 계산

  const calculateRisingStars = () => {
    setLoading(true);
    
    // videos prop에서 직접 계산하기 (블럭된 영상이 이미 제외된 상태)
    console.log('Calculating rising stars from videos prop:', videos?.length);
    
    if (!videos || videos.length === 0) {
      setRisingStars({ daily: [], weekly: [], newEntry: [] });
      setLoading(false);
      return;
    }

    // 신규 진입 찾기 (previous_rank가 null인 영상들)
    let newEntryVideos = videos
      .filter(v => v.originalPreviousRank === null || v.originalPreviousRank === undefined)
      .slice(0, 3)
      .map((v, index) => ({
        video_id: v.youtube_id || v.id,
        video_title: v.title,
        channel: v.channel,
        thumbnail: v.thumbnail,
        category: 'new_entry',
        rank_position: index + 1,
        end_rank: v.displayRank,
        displayRank: v.displayRank,
        video: v
      }));
    
    // 일일 급상승 찾기 (순위가 상승한 영상들)
    let dailyRisingVideos = videos
      .filter(v => 
        v.displayPreviousRank !== null && 
        v.displayPreviousRank !== undefined &&
        v.displayRank < v.displayPreviousRank
      )
      .sort((a, b) => {
        const aChange = a.displayPreviousRank - a.displayRank;
        const bChange = b.displayPreviousRank - b.displayRank;
        return bChange - aChange;
      })
      .slice(0, 3)
      .map((v, index) => ({
        video_id: v.youtube_id || v.id,
        video_title: v.title,
        channel: v.channel,
        thumbnail: v.thumbnail,
        category: 'daily_rising',
        rank_position: index + 1,
        rank_change: v.displayPreviousRank - v.displayRank,
        end_rank: v.displayRank,
        displayRank: v.displayRank,
        video: v
      }));

    // excludeFirst가 true면 1위 제외
    if (excludeFirst) {
      dailyRisingVideos = dailyRisingVideos.filter(d => d.rank_position > 1);
      newEntryVideos = newEntryVideos.filter(d => d.rank_position > 1);
    }
    
    console.log('Final rising stars:', { 
      daily: dailyRisingVideos, 
      weekly: [], 
      newEntry: newEntryVideos 
    });
    
    setRisingStars({
      daily: dailyRisingVideos,
      weekly: [], // 주간 데이터는 나중에 구현
      newEntry: newEntryVideos
    });
    
    setLoading(false);
  };

  const fetchVideoHistory = async (videoId) => {
    try {
      // 영상의 전체 순위 히스토리 조회
      const { data: history, error } = await supabase
        .from('coversong_rank_history')
        .select('*')
        .eq('video_id', videoId)
        .eq('competition_id', competitionId)
        .order('recorded_date', { ascending: true });

      if (error) {
        console.error('순위 히스토리 조회 오류:', error);
        return null;
      }

      // 기간별 변동 조회
      const { data: changes } = await supabase
        .from('coversong_rank_changes')
        .select('*')
        .eq('video_id', videoId)
        .eq('competition_id', competitionId)
        .order('period_end', { ascending: false });

      return { history, changes };
    } catch (error) {
      console.error('히스토리 조회 오류:', error);
      return null;
    }
  };

  const handleVideoClick = async (video) => {
    const historyData = await fetchVideoHistory(video.video_id);
    if (historyData) {
      setSelectedVideo({
        ...video,
        ...historyData
      });
      setShowHistoryModal(true);
    }
  };

  // 비디오 카드 컴포넌트
  const VideoCard = ({ star, index }) => {
    const video = star.video || {};
    
    return (
      <div 
        className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        onClick={() => {
          // onVideoClick이 전달되면 상세 모달 열기, 아니면 히스토리 모달 열기
          if (onVideoClick) {
            const videoData = star.video || {
              id: star.video_id,
              title: star.video_title,
              channel: star.channel,
              thumbnail: star.thumbnail,
              ...star
            };
            onVideoClick(videoData);
          } else {
            handleVideoClick(star);
          }
        }}
      >
        <div className="relative">
          <img 
            src={video.thumbnail || star.thumbnail || `https://img.youtube.com/vi/${star.video_id}/hqdefault.jpg`}
            alt={video.title || star.video_title}
            className="w-full h-40 object-cover"
          />
          <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white ${
            star.category === 'new_entry' ? 'bg-green-600' : 'bg-blue-600'
          }`}>
            {star.rank_position === 1 ? '🥇' : star.rank_position === 2 ? '🥈' : '🥉'} 
            {star.category === 'new_entry' ? '신규' : '급상승'} {star.rank_position}위
          </div>
        </div>
        
        <div className="p-4">
          <h4 className="text-sm font-bold text-white line-clamp-2">
            {video.title || star.video_title}
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            {video.channel || star.channel}
          </p>
          {star.rank_change && (
            <p className="text-xs text-blue-400 mt-2">
              {star.category === 'daily_rising' ? '24시간' : '7일'} 동안 {star.rank_change}계단 상승
            </p>
          )}
          {star.category === 'new_entry' && (
            <p className="text-xs text-green-400 mt-2">
              신규 진입 • 현재 {star.displayRank}위
            </p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-neutral-700/50 shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-neutral-700/50 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            {excludeFirst ? '📊 순위 변동 TOP 2-3' : '🚀 순위 급상승 & 신규 진입 TOP 3'}
          </h3>
          
          {/* 탭 선택 */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'daily' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
              }`}
            >
              일일 급상승
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'weekly' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
              }`}
            >
              주간 급상승
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'new' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
              }`}
            >
              신규 진입
            </button>
          </div>
        </div>

        {/* 카테고리별 TOP 3 표시 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeTab === 'daily' && risingStars.daily.map((star, index) => (
            <VideoCard key={`daily-${index}`} star={star} index={index} />
          ))}
          {activeTab === 'weekly' && risingStars.weekly.map((star, index) => (
            <VideoCard key={`weekly-${index}`} star={star} index={index} />
          ))}
          {activeTab === 'new' && risingStars.newEntry.map((star, index) => (
            <VideoCard key={`new-${index}`} star={star} index={index} />
          ))}
        </div>

        {/* 데이터가 없을 때 */}
        {((activeTab === 'daily' && risingStars.daily.length === 0) ||
          (activeTab === 'weekly' && risingStars.weekly.length === 0) ||
          (activeTab === 'new' && risingStars.newEntry.length === 0)) && (
          <div className="text-center text-gray-400 py-8">
            {activeTab === 'weekly' && risingStars.weekly.length === 0 
              ? '주간 데이터는 일요일마다 업데이트됩니다.' 
              : '해당하는 영상이 없습니다.'}
          </div>
        )}
      </div>

      {/* 히스토리 모달 */}
      {showHistoryModal && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">
                {selectedVideo.video_title || selectedVideo.video?.title}
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {/* 히스토리 차트나 정보 표시 */}
            <div className="space-y-4">
              {selectedVideo.history && selectedVideo.history.length > 0 ? (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">순위 변동 히스토리</h4>
                  <div className="space-y-2">
                    {selectedVideo.history.map((record, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          {new Date(record.recorded_date).toLocaleDateString()}
                        </span>
                        <span className="text-white font-semibold">
                          {record.rank}위
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">히스토리 정보가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}