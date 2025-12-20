import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { searchVideosByTopic } from '../../../lib/youtube';
import { useCurrentCompetition, useCompetitionHistory, useFinalResults } from '../../../shared/hooks/useCoverArena';
import { useQueryClient } from '@tanstack/react-query';

export default function CompetitionManager({ user, selectedTopics, setManualTopic }) {
    const queryClient = useQueryClient();
    const { data: currentCompetition } = useCurrentCompetition();
    const { data: competitionHistory = [] } = useCompetitionHistory();
    const { data: finalResults = [] } = useFinalResults(currentCompetition?.id);

    const [votingPeriod, setVotingPeriod] = useState({
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
    });
    const [isScraping, setIsScraping] = useState(false);
    const [isAnnouncing, setIsAnnouncing] = useState(false);

    // 현재 Competition 상태 동기화 (필요시)
    useEffect(() => {
        if (currentCompetition) {
            // 이미 진행중이면 시간 정보를 가져올 수도 있음
        }
    }, [currentCompetition]);

    const handleVotingPeriodChange = (field, value) => {
        setVotingPeriod(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleExecuteTopics = async () => {
        if (!selectedTopics.length) {
            alert('실행할 주제를 1개 이상 선택해주세요.');
            return;
        }
        const confirmed = confirm(`선택된 ${selectedTopics.length}개 주제로 스크랩을 실행하시겠습니까?\n\n이 작업은 몇 분 정도 소요될 수 있습니다.`);
        if (!confirmed) return;

        setIsScraping(true);
        try {
            // 0. 기존 Active Competition 종료
            await fetch('/api/close-active-competitions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            // 1. competition 생성
            const currentStartTime = new Date().toISOString();
            const { data: compData, error: compError } = await supabase
                .from('coversong_competitions')
                .insert({
                    topic: selectedTopics.join(', '),
                    start_time: currentStartTime,
                    end_time: votingPeriod.endTime,
                    status: 'active'
                })
                .select()
                .single();

            if (compError || !compData) {
                alert('Competition 생성 실패: ' + (compError?.message || '')); return;
            }

            const competitionId = compData.id;

            // 2. coversong_competition_topics에 연결
            const topicRows = selectedTopics.map(topic => ({ competition_id: competitionId, topic }));
            const { error: topicError } = await supabase
                .from('coversong_competition_topics')
                .insert(topicRows);

            if (topicError) {
                alert('competition_topics 저장 실패: ' + topicError.message); return;
            }

            // 3. 각 topic별 영상 스크랩 및 저장
            let totalVideos = 0;
            for (let i = 0; i < selectedTopics.length; i++) {
                const topic = selectedTopics[i];
                console.log(`[스크랩] ${i + 1}/${selectedTopics.length}:`, topic);
                let videos = await searchVideosByTopic(topic, 200);
                videos = videos.slice(0, 100);
                const videoRows = videos.map(v => ({
                    id: v.id,
                    title: v.title,
                    channel: v.channel,
                    thumbnail: v.thumbnail,
                    youtube_id: v.youtubeId,
                    views: v.views,
                    likes: v.likes,
                    arena_likes: 0,
                    topic,
                    competition_id: competitionId
                }));

                const { error: videoError } = await supabase
                    .from('coversong_videos')
                    .upsert(videoRows, { onConflict: ['id'] });

                if (videoError) {
                    alert(`'${topic}' 영상 저장 실패: ` + videoError.message); return;
                }
                totalVideos += videoRows.length;
            }

            // 4. 메인 타이틀 업데이트
            const newMainTitle = selectedTopics.join(', ');
            try {
                const configResponse = await fetch('/api/update-main-title', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, mainTitle: newMainTitle })
                });

                if (configResponse.ok) {
                    if (setManualTopic) setManualTopic(newMainTitle);
                    queryClient.invalidateQueries(['mainTitle']);
                } else {
                    console.error('메인 타이틀 업데이트 실패:', await configResponse.json());
                }
            } catch (err) {
                console.error('메인 타이틀 업데이트 오류:', err);
            }

            queryClient.invalidateQueries(['currentCompetition', 'competitionHistory']);

            alert(`스크랩 완료!\n총 ${selectedTopics.length}개 주제, ${totalVideos}개 영상이 저장되었습니다.\n메인 타이틀이 "${newMainTitle}"(으)로 변경되었습니다.`);
            window.location.href = `/?competition_id=${competitionId}`;

        } catch (error) {
            alert('스크랩 실행 중 오류: ' + error.message);
        } finally {
            setIsScraping(false);
        }
    };

    const handleAnnounceResults = async () => {
        if (!currentCompetition) {
            alert('현재 진행 중인 Competition이 없습니다.');
            return;
        }

        const confirmed = window.confirm(
            `"${currentCompetition.topic}" Competition의 최종 순위를 발표하시겠습니까?\n\n` +
            '이 작업은 되돌릴 수 없습니다.'
        );

        if (!confirmed) return;

        setIsAnnouncing(true);

        try {
            // 1. 순위 확정
            const updatePromises = finalResults.map((video, index) =>
                supabase
                    .from('coversong_videos')
                    .update({ final_rank: index + 1 })
                    .eq('id', video.id)
            );

            await Promise.all(updatePromises);

            // 2. 결과 집계 RPC
            const { data: roundNumber, error: updateError } = await supabase
                .rpc('update_competition_results', {
                    p_competition_id: currentCompetition.id
                });

            if (updateError) {
                console.error('Competition 업데이트 오류:', updateError);
                throw updateError;
            }

            const top3 = finalResults.slice(0, 3);
            const message = `🏆 ${roundNumber}회차 최종 순위 발표 완료!\n\n` +
                `주제: ${currentCompetition.topic}\n\n` +
                `1위: ${top3[0]?.channel} (${top3[0]?.site_score?.toLocaleString()}점)\n` +
                `2위: ${top3[1]?.channel} (${top3[1]?.site_score?.toLocaleString()}점)\n` +
                `3위: ${top3[2]?.channel} (${top3[2]?.site_score?.toLocaleString()}점)\n\n` +
                `총 ${finalResults.length}개 영상 참가`;

            alert(message);

            queryClient.invalidateQueries(['currentCompetition', 'competitionHistory', 'finalResults']);

        } catch (error) {
            console.error('발표 오류:', error);
            alert('발표 중 오류가 발생했습니다: ' + error.message);
        } finally {
            setIsAnnouncing(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Competition 투표 제어 패널 */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">⚔️ Competition 제어</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-300 mb-2">시작 시간</label>
                            <input
                                type="datetime-local"
                                value={votingPeriod.startTime.slice(0, 16)}
                                onChange={(e) => handleVotingPeriodChange('startTime', e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">종료 시간</label>
                            <input
                                type="datetime-local"
                                value={votingPeriod.endTime.slice(0, 16)}
                                onChange={(e) => handleVotingPeriodChange('endTime', e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col justify-end space-y-4">
                        <div className="p-4 bg-white/5 rounded border border-white/10">
                            <span className="text-gray-300 block mb-2">선택된 주제 ({selectedTopics.length}개)</span>
                            <div className="text-white font-medium mb-4 h-12 overflow-y-auto">
                                {selectedTopics.length > 0 ? selectedTopics.join(', ') : '선택된 주제 없음'}
                            </div>
                            <button
                                onClick={handleExecuteTopics}
                                disabled={isScraping || selectedTopics.length === 0}
                                className={`w-full py-3 rounded font-bold text-white transition ${isScraping || selectedTopics.length === 0
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30'
                                    }`}
                            >
                                {isScraping ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        스크랩 및 Competition 생성 중...
                                    </span>
                                ) : (
                                    '⚔️ 새 Competition 시작 (스크랩 실행)'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 현재 Competition 상태 관리 */}
            {currentCompetition && (
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md rounded-lg p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                        진행 중인 Competition: {currentCompetition.topic}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 mb-6">
                        <div>시작: {new Date(currentCompetition.start_time).toLocaleString()}</div>
                        <div>종료: {new Date(currentCompetition.end_time).toLocaleString()}</div>
                        <div>상태: <span className="text-green-400 font-bold uppercase">{currentCompetition.status}</span></div>
                    </div>

                    <button
                        onClick={handleAnnounceResults}
                        disabled={isAnnouncing}
                        className={`w-full py-4 rounded-lg font-bold text-white text-lg transition ${isAnnouncing
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 shadow-lg shadow-yellow-600/30'
                            }`}
                    >
                        {isAnnouncing ? '발표 처리 중...' : '🏆 최종 순위 발표 및 종료'}
                    </button>
                </div>
            )}

            {/* 히스토리 */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">지난 Competition 기록</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="text-xs uppercase bg-white/5 text-gray-400">
                            <tr>
                                <th className="px-4 py-2">회차</th>
                                <th className="px-4 py-2">주제</th>
                                <th className="px-4 py-2">종료일</th>
                                <th className="px-4 py-2">상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {competitionHistory.map((comp) => (
                                <tr key={comp.id} className="hover:bg-white/5">
                                    <td className="px-4 py-2 font-mono text-sm">{comp.round_number || '-'}</td>
                                    <td className="px-4 py-2 font-medium text-white">{comp.topic}</td>
                                    <td className="px-4 py-2 text-sm">{new Date(comp.end_time).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        <span className="px-2 py-1 bg-gray-700 rounded text-xs">{comp.status}</span>
                                    </td>
                                </tr>
                            ))}
                            {competitionHistory.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-4 py-4 text-center text-gray-500">기록이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
