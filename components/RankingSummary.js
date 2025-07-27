import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function RankingSummary({ competitionId }) {
  const [summary, setSummary] = useState({
    new_count: 0,
    up_count: 0,
    down_count: 0,
    same_count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankingSummary();
  }, [competitionId]);

  const fetchRankingSummary = async () => {
    try {
      setLoading(true);
      
      // 순위변동 계산 함수 실행
      await supabase.rpc('update_video_rankings', {
        p_competition_id: competitionId
      });

      // 순위변동 요약 조회
      const { data, error } = await supabase.rpc('get_ranking_summary', {
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="flex space-x-4">
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        📊 순위변동 요약
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 신규 진입 */}
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {summary.new_count}
          </div>
          <div className="text-sm text-green-700 font-medium">
            🆕 신규
          </div>
        </div>

        {/* 순위 상승 */}
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {summary.up_count}
          </div>
          <div className="text-sm text-blue-700 font-medium">
            📈 상승
          </div>
        </div>

        {/* 순위 하락 */}
        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">
            {summary.down_count}
          </div>
          <div className="text-sm text-red-700 font-medium">
            📉 하락
          </div>
        </div>

        {/* 순위 유지 */}
        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {summary.same_count}
          </div>
          <div className="text-sm text-gray-700 font-medium">
            ➡️ 유지
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        마지막 업데이트: {new Date().toLocaleString('ko-KR')}
      </div>
    </div>
  );
} 