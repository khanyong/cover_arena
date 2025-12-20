import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { useSuggestedTopics, useMainTitle } from '../../../shared/hooks/useCoverArena';
import { useQueryClient } from '@tanstack/react-query';

export default function TopicManager({ user, selectedTopics, setSelectedTopics }) {
    const queryClient = useQueryClient();
    const { data: suggestedTopics = [] } = useSuggestedTopics();
    const { data: globalMainTitle } = useMainTitle();

    const [newTopic, setNewTopic] = useState('');
    const [manualTopic, setManualTopic] = useState('');

    // DB에서 메인 타이틀을 가져오면 로컬 state 초기화
    useEffect(() => {
        if (globalMainTitle) {
            setManualTopic(globalMainTitle);
        }
    }, [globalMainTitle]);

    const handleManualTopicSave = async () => {
        try {
            const response = await fetch('/api/update-main-title', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, mainTitle: manualTopic })
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || '저장 실패');
            }
            alert('메인 타이틀이 저장되었습니다!');
            queryClient.invalidateQueries(['mainTitle']); // 캐시 갱신
        } catch (error) {
            alert('저장 실패: ' + error.message);
            console.error(error);
        }
    };

    const handleAddTopic = async (e) => {
        e.preventDefault();
        if (newTopic.trim()) {
            try {
                const { data, error } = await supabase
                    .from('coversong_topics')
                    .insert([{
                        topic: newTopic.trim(),
                        votes_count: 0
                    }])
                    .select();

                if (error) {
                    alert('주제 추가에 실패했습니다: ' + error.message);
                } else {
                    setNewTopic('');
                    queryClient.invalidateQueries(['suggestedTopics']);
                }
            } catch (error) {
                alert('주제 추가 중 오류가 발생했습니다.');
            }
        }
    };

    const handleDeleteTopic = async (id) => {
        try {
            const { error } = await supabase
                .from('coversong_topics')
                .delete()
                .eq('id', id);

            if (error) {
                alert('주제 삭제에 실패했습니다: ' + error.message);
            } else {
                queryClient.invalidateQueries(['suggestedTopics']);
            }
        } catch (error) {
            alert('주제 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleVoteChange = async (id, newVotes) => {
        try {
            const { error } = await supabase
                .from('coversong_topics')
                .update({ votes_count: Math.max(0, newVotes) })
                .eq('id', id);

            if (error) {
                alert('투표 수 변경에 실패했습니다: ' + error.message);
            } else {
                queryClient.invalidateQueries(['suggestedTopics']);
            }
        } catch (error) {
            alert('투표 수 변경 중 오류가 발생했습니다.');
        }
    };

    const toggleTopicSelection = (topic) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter(t => t !== topic));
        } else {
            setSelectedTopics([...selectedTopics, topic]);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">🎵 주제 관리</h2>

            <div className="mb-6 bg-black/20 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-200 mb-2">현재 메인 타이틀 (수동 설정)</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={manualTopic}
                        onChange={(e) => setManualTopic(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        placeholder="직접 입력하거나 아래에서 선택..."
                    />
                    <button
                        onClick={handleManualTopicSave}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        저장
                    </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                    * '실행' 버튼을 누르면 자동으로 선택된 주제로 덮어씌워집니다.<br />
                    * 여기서 저장하면 스크랩 없이 타이틀만 즉시 변경됩니다.
                </p>
            </div>

            <form onSubmit={handleAddTopic} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="새로운 주제 추가..."
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:border-blue-500"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    추가
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="w-full text-white">
                    <thead className="bg-white/10">
                        <tr>
                            <th className="px-4 py-2 text-left">선택</th>
                            <th className="px-4 py-2 text-left">주제</th>
                            <th className="px-4 py-2 text-left">투표수</th>
                            <th className="px-4 py-2 text-left">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {suggestedTopics.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5">
                                <td className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedTopics.includes(item.topic)}
                                        onChange={() => toggleTopicSelection(item.topic)}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="px-4 py-2">{item.topic}</td>
                                <td className="px-4 py-2">
                                    <div className="flex items-center gap-2">
                                        <span>{item.votes_count}</span>
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() => handleVoteChange(item.id, item.votes_count + 1)}
                                                className="text-xs text-green-400 hover:text-green-300"
                                            >
                                                ▲
                                            </button>
                                            <button
                                                onClick={() => handleVoteChange(item.id, item.votes_count - 1)}
                                                className="text-xs text-red-400 hover:text-red-300"
                                            >
                                                ▼
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDeleteTopic(item.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
