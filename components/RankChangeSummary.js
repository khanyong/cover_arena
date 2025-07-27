import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function RankChangeSummary({ videos, competitionId }) {
  const [summary, setSummary] = useState({
    new_count: 0,
    up_count: 0,
    down_count: 0,
    same_count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (competitionId) {
      fetchRankSummary();
    }
  }, [competitionId, videos]);

  const fetchRankSummary = async () => {
    try {
      setLoading(true);
      
      // 순위변동 요약 조회
      const { data, error } = await supabase.rpc('get_rank_summary', {
        p_competition_id: competitionId
      });

      if (error) {
        console.error('순위변동 요약 조회 오류:', error);
        return;
      }

      if (data && data.length > 0) {
        setSummary(data[0]);
      }
    } catch (error) {
      console.error('순위변동 요약 처리 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-neutral-700/50 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-neutral-700/50 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        📊 순위 변동 요약
        <span className="ml-2 text-sm text-gray-300">(이전 업데이트 대비)</span>
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {summary.new_count}
          </div>
          <div className="text-sm text-gray-300">🆕 신규</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {summary.up_count}
          </div>
          <div className="text-sm text-gray-300">↗️ 상승</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            {summary.down_count}
          </div>
          <div className="text-sm text-gray-300">↘️ 하락</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400">
            {summary.same_count}
          </div>
          <div className="text-sm text-gray-300">→ 유지</div>
        </div>
      </div>

      {/* 업데이트 시간 */}
      <div className="mt-4 text-center text-xs text-gray-400">
        마지막 업데이트: {videos.length > 0 && videos[0].updated_at 
          ? new Date(videos[0].updated_at).toLocaleString('ko-KR')
          : new Date().toLocaleString('ko-KR')
        }
      </div>
    </div>
  );
} 