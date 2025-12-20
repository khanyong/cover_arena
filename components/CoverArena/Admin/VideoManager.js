import { useState } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { useBlockedVideos, useBlockedChannels } from '../../../shared/hooks/useCoverArena';
import { useQueryClient } from '@tanstack/react-query';

export default function VideoManager({ user }) {
    const queryClient = useQueryClient();
    const { data: blockedVideos = [] } = useBlockedVideos();
    const { data: blockedChannels = [] } = useBlockedChannels();

    const [videoSearchQuery, setVideoSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedVideosForBlock, setSelectedVideosForBlock] = useState([]);

    const [channelSearchQuery, setChannelSearchQuery] = useState('');
    const [channelToBlock, setChannelToBlock] = useState('');
    const [channelIdToBlock, setChannelIdToBlock] = useState('');
    const [blockReason, setBlockReason] = useState('');
    const [blockTab, setBlockTab] = useState('videos'); // 'videos' or 'channels'

    const searchVideos = async () => {
        if (!videoSearchQuery.trim()) return;

        setIsSearching(true);
        setSelectedVideosForBlock([]);
        try {
            const blockedYoutubeIds = blockedVideos.map(b => b.youtube_id);

            const { data, error } = await supabase
                .from('coversong_videos')
                .select('*')
                .or(`title.ilike.%${videoSearchQuery}%,channel.ilike.%${videoSearchQuery}%,youtube_id.ilike.%${videoSearchQuery}%`)
                .limit(50);

            if (!error && data) {
                const filteredResults = data.filter(video =>
                    !blockedYoutubeIds.includes(video.youtube_id)
                ).slice(0, 20);

                setSearchResults(filteredResults);
            }
        } catch (error) {
            console.error('영상 검색 오류:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const blockVideo = async (youtubeId, title, reason) => {
        try {
            const { error } = await supabase
                .from('coversong_blocked_videos')
                .insert({
                    youtube_id: youtubeId,
                    reason: reason || `${title} - 관리자에 의해 차단됨`,
                    blocked_by: user?.id
                });

            if (error) {
                if (error.code === '23505') {
                    alert('이미 차단된 영상입니다.');
                } else {
                    alert('영상 차단에 실패했습니다: ' + error.message);
                }
            } else {
                alert('영상이 차단되었습니다.');
                queryClient.invalidateQueries(['blockedVideos']);
                setSearchResults([]);
                setVideoSearchQuery('');
            }
        } catch (error) {
            alert('영상 차단 중 오류가 발생했습니다.');
        }
    };

    const unblockVideo = async (id) => {
        try {
            const { error } = await supabase
                .from('coversong_blocked_videos')
                .update({
                    is_active: false,
                    unblocked_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) {
                alert('차단 해제에 실패했습니다: ' + error.message);
            } else {
                alert('차단이 해제되었습니다.');
                queryClient.invalidateQueries(['blockedVideos']);
            }
        } catch (error) {
            alert('차단 해제 중 오류가 발생했습니다.');
        }
    };

    const blockSelectedVideos = async () => {
        if (selectedVideosForBlock.length === 0) {
            alert('차단할 영상을 선택해주세요.');
            return;
        }

        const confirmed = window.confirm(
            `선택한 ${selectedVideosForBlock.length}개 영상을 차단하시겠습니까?`
        );
        if (!confirmed) return;

        try {
            const blockPromises = selectedVideosForBlock.map(video =>
                supabase
                    .from('coversong_blocked_videos')
                    .insert({
                        youtube_id: video.youtube_id,
                        reason: `${video.title} - 관리자에 의해 일괄 차단됨`,
                        blocked_by: user?.id
                    })
            );

            const results = await Promise.allSettled(blockPromises);
            const successCount = results.filter(r => r.status === 'fulfilled').length;
            const failCount = results.filter(r => r.status === 'rejected').length;

            alert(`차단 완료: ${successCount}개 성공${failCount > 0 ? `, ${failCount}개 실패` : ''}`);

            queryClient.invalidateQueries(['blockedVideos']);
            setSearchResults([]);
            setSelectedVideosForBlock([]);
            setVideoSearchQuery('');
        } catch (error) {
            alert('일괄 차단 중 오류가 발생했습니다.');
        }
    };

    const toggleVideoSelection = (video) => {
        setSelectedVideosForBlock(prev => {
            const isSelected = prev.some(v => v.id === video.id);
            if (isSelected) {
                return prev.filter(v => v.id !== video.id);
            } else {
                return [...prev, video];
            }
        });
    };

    const blockChannel = async () => {
        if (!channelToBlock.trim() && !channelIdToBlock.trim()) {
            alert('차단할 채널명 또는 채널 ID를 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('/api/blocked-channels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    channel_name: channelToBlock.trim() || null,
                    channel_id: channelIdToBlock.trim() || null,
                    reason: blockReason.trim() || `채널 차단 - 관리자에 의해 차단됨`,
                    user_id: user?.id
                })
            });

            const result = await response.json();

            if (response.ok) {
                const blockedName = channelToBlock || channelIdToBlock;
                alert(`채널 "${blockedName}"이(가) 차단되었습니다.`);
                setChannelToBlock('');
                setChannelIdToBlock('');
                setBlockReason('');
                queryClient.invalidateQueries(['blockedChannels']);
            } else {
                console.error('Channel block error:', result);
                const errorMsg = result.details
                    ? `채널 차단 실패: ${result.details}`
                    : (result.error || '채널 차단에 실패했습니다.');
                alert(errorMsg);
            }
        } catch (error) {
            console.error('채널 차단 오류:', error);
            alert('채널 차단 중 오류가 발생했습니다.');
        }
    };

    const unblockChannel = async (channelIdentifier) => {
        try {
            const isChannelId = channelIdentifier && channelIdentifier.startsWith('UC');

            const response = await fetch('/api/blocked-channels', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    isChannelId
                        ? { channel_id: channelIdentifier }
                        : { channel_name: channelIdentifier }
                )
            });

            if (response.ok) {
                alert(`채널 "${channelIdentifier}"의 차단이 해제되었습니다.`);
                queryClient.invalidateQueries(['blockedChannels']);
            } else {
                alert('채널 차단 해제에 실패했습니다.');
            }
        } catch (error) {
            console.error('채널 차단 해제 오류:', error);
            alert('차단 해제 중 오류가 발생했습니다.');
        }
    };

    const toggleSelectAll = () => {
        if (selectedVideosForBlock.length === searchResults.length) {
            setSelectedVideosForBlock([]);
        } else {
            setSelectedVideosForBlock(searchResults);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">🚫 차단 관리</h2>

            <div className="flex space-x-4 mb-6 border-b border-white/10 pb-2">
                <button
                    onClick={() => setBlockTab('videos')}
                    className={`px-4 py-2 font-bold transition ${blockTab === 'videos'
                            ? 'text-white border-b-2 border-red-500'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    영상 차단
                </button>
                <button
                    onClick={() => setBlockTab('channels')}
                    className={`px-4 py-2 font-bold transition ${blockTab === 'channels'
                            ? 'text-white border-b-2 border-red-500'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    채널 차단
                </button>
            </div>

            {blockTab === 'videos' ? (
                <div className="space-y-6">
                    {/* 영상 검색 및 차단 */}
                    <div className="bg-black/20 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-200 mb-4">영상 검색 및 차단</h3>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={videoSearchQuery}
                                onChange={(e) => setVideoSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && searchVideos()}
                                placeholder="제목, 채널명 또는 YouTube ID로 검색..."
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded text-white"
                            />
                            <button
                                onClick={searchVideos}
                                disabled={isSearching}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {isSearching ? '검색 중...' : '검색'}
                            </button>
                        </div>

                        {/* 검색 결과 */}
                        {searchResults.length > 0 && (
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-300">검색 결과: {searchResults.length}개</span>
                                    <div className="space-x-2">
                                        <button
                                            onClick={toggleSelectAll}
                                            className="text-sm text-blue-400 hover:text-blue-300"
                                        >
                                            {selectedVideosForBlock.length === searchResults.length ? '전체 해제' : '전체 선택'}
                                        </button>
                                        {selectedVideosForBlock.length > 0 && (
                                            <button
                                                onClick={blockSelectedVideos}
                                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                            >
                                                선택 차단 ({selectedVideosForBlock.length})
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                                    {searchResults.map(video => (
                                        <div key={video.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded">
                                            <input
                                                type="checkbox"
                                                checked={selectedVideosForBlock.some(v => v.id === video.id)}
                                                onChange={() => toggleVideoSelection(video)}
                                                className="rounded border-gray-600 bg-gray-700 text-red-600"
                                            />
                                            <img src={video.thumbnail} alt="" className="w-16 h-9 object-cover rounded" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-white truncate text-sm">{video.title}</div>
                                                <div className="text-gray-400 text-xs">{video.channel}</div>
                                            </div>
                                            <button
                                                onClick={() => blockVideo(video.youtube_id, video.title)}
                                                className="px-3 py-1 bg-red-600/50 hover:bg-red-600 text-white text-xs rounded"
                                            >
                                                차단
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 차단된 영상 목록 */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-200 mb-4">차단된 영상 목록 ({blockedVideos.length})</h3>
                        <div className="max-h-96 overflow-y-auto">
                            {blockedVideos.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="text-red-400">🚫</div>
                                        <div>
                                            <div className="text-gray-300 text-sm">ID: {item.youtube_id}</div>
                                            <div className="text-gray-500 text-xs">사유: {item.reason}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => unblockVideo(item.id)}
                                        className="text-sm text-gray-400 hover:text-white underline"
                                    >
                                        해제
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* 채널 차단 입력 */}
                    <div className="bg-black/20 p-4 rounded-lg space-y-4">
                        <h3 className="text-lg font-bold text-gray-200">채널 차단 추가</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={channelToBlock}
                                onChange={(e) => setChannelToBlock(e.target.value)}
                                placeholder="채널명 (예: Q WER)"
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded text-white"
                            />
                            <input
                                type="text"
                                value={channelIdToBlock}
                                onChange={(e) => setChannelIdToBlock(e.target.value)}
                                placeholder="채널 ID (예: UC...)"
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded text-white"
                            />
                        </div>
                        <input
                            type="text"
                            value={blockReason}
                            onChange={(e) => setBlockReason(e.target.value)}
                            placeholder="차단 사유 (선택)"
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white"
                        />
                        <button
                            onClick={blockChannel}
                            className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
                        >
                            채널 차단하기
                        </button>
                        <p className="text-xs text-gray-400 mt-2">
                            * 채널명이나 ID 중 하나만 입력해도 됩니다.<br />
                            * 채널 차단 시 해당 채널의 모든 영상이 검색 및 수집에서 제외됩니다.
                        </p>
                    </div>

                    {/* 차단된 채널 목록 */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-200 mb-4">차단된 채널 목록 ({blockedChannels.length})</h3>
                        <div className="max-h-96 overflow-y-auto">
                            {blockedChannels.map((channel, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 hover:bg-white/5 rounded border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="text-red-400">📺</div>
                                        <div>
                                            <div className="text-white font-bold">{channel.channel_name || '(이름 없음)'}</div>
                                            <div className="text-gray-400 text-xs">ID: {channel.channel_id || '(ID 없음)'}</div>
                                            <div className="text-gray-500 text-xs">사유: {channel.reason}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => unblockChannel(channel.channel_id || channel.channel_name)}
                                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white"
                                    >
                                        해제
                                    </button>
                                </div>
                            ))}
                            {blockedChannels.length === 0 && (
                                <div className="text-center text-gray-500 py-4">차단된 채널이 없습니다.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
