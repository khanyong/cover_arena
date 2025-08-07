import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function RankChangeSummaryEnhanced({ videos, competitionId, excludeFirst = false }) {
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
    if (competitionId) {
      fetchRisingStars();
    }
  }, [competitionId]);

  const fetchRisingStars = async () => {
    try {
      setLoading(true);
      
      // 가장 최근의 급상승 영상들 조회
      console.log('Fetching rising stars for competition:', competitionId);
      
      // 먼저 가장 최근 날짜 확인
      const { data: latestDate } = await supabase
        .from('coversong_rising_stars')
        .select('recorded_date')
        .eq('competition_id', competitionId)
        .order('recorded_date', { ascending: false })
        .limit(1)
        .single();
      
      const targetDate = latestDate?.recorded_date || new Date().toISOString().split('T')[0];
      console.log('Using date:', targetDate);
      
      const { data, error } = await supabase
        .from('coversong_rising_stars')
        .select('*')
        .eq('competition_id', competitionId)
        .eq('recorded_date', targetDate)
        .order('rank_position', { ascending: true });

      console.log('Rising stars data:', data);
      console.log('Rising stars error:', error);

      if (error) {
        console.error('급상승 영상 조회 오류:', error);
        return;
      }

      if (data && data.length > 0) {
        // video_id로 실제 비디오 정보 가져오기
        const videoIds = [...new Set(data.map(d => d.video_id))];
        const { data: videos } = await supabase
          .from('coversong_videos')
          .select('*')
          .in('id', videoIds);
        
        const videoMap = {};
        if (videos) {
          videos.forEach(v => {
            videoMap[v.id] = v;
          });
        }
        
        // 각 rising star에 video 정보 추가
        const enrichedData = data.map(star => ({
          ...star,
          video: videoMap[star.video_id] || {
            title: star.video_title,
            channel: star.channel,
            thumbnail: star.thumbnail
          }
        }));
        
        console.log('Enriched data:', enrichedData);
        // excludeFirst가 true면 1위 제외 (RisingStarVideo와 중복 방지)
        let daily = enrichedData.filter(d => d.category === 'daily_rising');
        let weekly = enrichedData.filter(d => d.category === 'weekly_rising');
        let newEntry = enrichedData.filter(d => d.category === 'new_entry');
        
        if (excludeFirst) {
          daily = daily.filter(d => d.rank_position > 1);
          weekly = weekly.filter(d => d.rank_position > 1);
          newEntry = newEntry.filter(d => d.rank_position > 1);
        }
        
        console.log('Final rising stars:', { daily, weekly, newEntry });
        
        setRisingStars({
          daily,
          weekly,
          newEntry
        });
      } else {
        // 데이터가 없을 때
        console.log('No rising stars data found');
        setRisingStars({
          daily: [],
          weekly: [],
          newEntry: []
        });
      }
    } catch (error) {
      console.error('급상승 영상 처리 오류:', error);
    } finally {
      setLoading(false);
    }
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

  const RankChangeIcon = ({ change, isNew }) => {
    if (isNew) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <polygon points="20,2 4,12 20,22" fill="#10B981" />
        </svg>
      );
    }
    if (change > 0) {
      return (
        <div className="flex items-center text-blue-400">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <polygon points="12,4 22,20 2,20" fill="#3B82F6" />
          </svg>
          <span className="ml-1 font-bold">+{change}</span>
        </div>
      );
    }
    return null;
  };

  const VideoCard = ({ star, index }) => {
    const video = star.video || {};
    return (
      <div 
        key={star.id}
        className="bg-gradient-to-br from-neutral-800/60 to-neutral-900/60 rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform"
        onClick={() => handleVideoClick(star)}
      >
        <div className="flex items-start space-x-3">
          <div className="text-3xl font-bold text-yellow-400">
            {excludeFirst ? index + 2 : index + 1}
          </div>
          <div className="flex-1">
            <div className="aspect-video relative mb-2">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute top-2 right-2 bg-black/70 rounded-full p-2">
                <RankChangeIcon 
                  change={star.rank_change} 
                  isNew={star.category === 'new_entry'} 
                />
              </div>
            </div>
            <h4 className="text-sm font-bold text-white line-clamp-2">
              {video.title}
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              {video.channel}
            </p>
            {star.rank_change && (
              <p className="text-xs text-blue-400 mt-2">
                {star.category === 'daily_rising' ? '24시간' : '7일'} 동안 {star.rank_change}계단 상승
              </p>
            )}
            {star.category === 'new_entry' && (
              <p className="text-xs text-green-400 mt-2">
                신규 진입 • 현재 {star.end_rank || video.current_rank}위
              </p>
            )}
          </div>
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
            <VideoCard key={star.id} star={star} index={index} />
          ))}
          {activeTab === 'weekly' && risingStars.weekly.map((star, index) => (
            <VideoCard key={star.id} star={star} index={index} />
          ))}
          {activeTab === 'new' && risingStars.newEntry.map((star, index) => (
            <VideoCard key={star.id} star={star} index={index} />
          ))}
        </div>

        {/* 데이터가 없을 때 */}
        {((activeTab === 'daily' && risingStars.daily.length === 0) ||
          (activeTab === 'weekly' && risingStars.weekly.length === 0) ||
          (activeTab === 'new' && risingStars.newEntry.length === 0)) && (
          <div className="text-center text-gray-400 py-8">
            {activeTab === 'weekly' && risingStars.weekly.length === 0 
              ? '주간 데이터는 일요일마다 업데이트됩니다.' 
              : '아직 데이터가 없습니다.'}
          </div>
        )}
      </div>

      {/* 순위 히스토리 모달 */}
      {showHistoryModal && selectedVideo && (
        <VideoRankHistoryModal 
          video={selectedVideo}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </>
  );
}

// 순위 히스토리 모달 컴포넌트
function VideoRankHistoryModal({ video, onClose }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getChangeLabel = (change) => {
    if (change > 0) return `+${change}`;
    if (change < 0) return `${change}`;
    return '→';
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-blue-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-neutral-900/95 p-6 border-b border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                순위 변동 히스토리
              </h2>
              <p className="text-gray-300">{video.video?.title || video.video_title}</p>
              <p className="text-sm text-gray-400">{video.video?.channel || video.channel}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* 기간별 요약 */}
          {video.changes && video.changes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">기간별 변동</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {video.changes.map(change => (
                  <div key={change.id} className="bg-neutral-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">
                      {change.period_type === 'daily' && '일일'}
                      {change.period_type === 'weekly' && '주간'}
                      {change.period_type === 'total' && '전체 기간'}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-bold">{change.start_rank || 'NEW'}위</span>
                        <span className="mx-2 text-gray-500">→</span>
                        <span className="text-white font-bold">{change.end_rank}위</span>
                      </div>
                      <div className={`font-bold ${getChangeColor(change.rank_change)}`}>
                        {getChangeLabel(change.rank_change)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      최고: {change.max_rank}위 | 최저: {change.min_rank}위
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 일별 히스토리 차트 */}
          {video.history && video.history.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-3">일별 순위 추이</h3>
              <div className="bg-neutral-800/50 rounded-lg p-4">
                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    {/* 간단한 라인 차트 구현 */}
                    <div className="relative h-64">
                      {video.history.map((point, index) => {
                        const maxRank = Math.max(...video.history.map(h => h.rank));
                        const yPos = (point.rank / maxRank) * 100;
                        
                        return (
                          <div
                            key={point.id}
                            className="absolute"
                            style={{
                              left: `${(index / (video.history.length - 1)) * 100}%`,
                              bottom: `${100 - yPos}%`,
                            }}
                          >
                            <div className="relative">
                              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                                {formatDate(point.recorded_date)}
                              </div>
                              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-white font-bold">
                                {point.rank}위
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}