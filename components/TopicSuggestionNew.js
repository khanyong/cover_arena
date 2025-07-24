import { useState, useEffect } from 'react'
import { topics, auth, supabase } from '../lib/supabase'
import dynamic from 'next/dynamic';
const ReactWordcloud = dynamic(() => import('react-wordcloud'), { ssr: false });

export default function TopicSuggestionNew() {
  const [newTopic, setNewTopic] = useState('')
  const [suggestedTopics, setSuggestedTopics] = useState([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // 현재 사용자 가져오기
    const getCurrentUser = async () => {
      const currentUser = await auth.getCurrentUser()
      setUser(currentUser)
    }
    getCurrentUser()

    // 주제 목록 로드
    loadTopics()
  }, [])

  const loadTopics = async () => {
    try {
      const { data, error } = await topics.getTopics()
      if (error) {
        console.error('주제 로드 오류:', error)
        // 오류 시 기본 데이터 표시
        setSuggestedTopics([
          { id: 1, title: 'Taylor Swift - Cruel Summer', votes_count: 45 },
          { id: 2, title: 'BTS - Butter', votes_count: 38 },
          { id: 3, title: 'Olivia Rodrigo - Vampire', votes_count: 32 }
        ])
      } else {
        setSuggestedTopics(data || [])
      }
    } catch (error) {
      console.error('주제 로드 오류:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('user:', user, 'newTopic:', newTopic);
    if (!newTopic.trim() || !user) {
      alert('로그인 후 제안이 가능합니다.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await topics.addTopic(newTopic.trim(), '', user.id);
      if (error) {
        alert('주제 제안에 실패했습니다: ' + error.message);
      } else {
        setNewTopic('');
        loadTopics();
        alert('주제가 제안되었습니다!');
      }
    } catch (error) {
      alert('주제 제안 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (topicId) => {
    if (!user) {
      alert('투표하려면 로그인이 필요합니다.')
      return
    }

    try {
      // 중복 투표 방지를 위해 coversong_topic_votes 테이블에 기록
      const { error: voteError } = await supabase
        .from('coversong_topic_votes')
        .insert([{ user_id: user.id, topic_id: topicId }])
      
      if (voteError && voteError.code !== '23505') { // 23505는 중복 키 오류
        alert('투표에 실패했습니다: ' + voteError.message)
        return
      }
      
      // 주제 투표 수 증가
      const { error } = await supabase
        .from('coversong_topics')
        .update({ votes_count: supabase.rpc('coversong_increment') })
        .eq('id', topicId)
      
      if (error) {
        alert('투표에 실패했습니다: ' + error.message)
      } else {
        loadTopics() // 목록 새로고침
      }
    } catch (error) {
      alert('투표 중 오류가 발생했습니다.')
    }
  }

  // 워드 클라우드 클릭 핸들러
  const handleWordClick = (word) => {
    const topic = suggestedTopics.find(
      t => (t.title || t.topic) === word.text
    );
    if (topic) {
      handleVote(topic.id);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center select-none">
        🗳️ 다음 Competition 주제 제안
      </h3>
      {/* 아래 전체 내용 항상 보이도록 */}
      
      {/* 새 주제 제안 폼 */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="새로운 주제를 입력하세요 (예: Taylor Swift - Cruel Summer)"
            disabled={!user || loading}
            className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!user || loading || !newTopic.trim()}
            className={`px-6 py-2 rounded-lg transition-colors ${
              !user || loading || !newTopic.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? '제안 중...' : '제안하기'}
          </button>
        </div>
        {!user && (
          <p className="text-sm text-gray-300 mt-2">
            💡 주제 제안을 하려면 <a href="/auth" className="text-blue-400 hover:underline">로그인</a>이 필요합니다.
          </p>
        )}
      </form>

          {/* 상위 3개 인기 주제 강조 */}
          {/* (상위 3개 인기 주제 강조 박스 완전 삭제) */}

          {/* 워드 클라우드 항상 표시 */}
          <div className="bg-white bg-opacity-10 rounded-lg p-6 mt-6">
            <h4 className="text-white font-semibold mb-3">모든 제안 주제 워드 클라우드</h4>
            <ReactWordcloud
              words={suggestedTopics.map(t => ({
                text: t.title || t.topic,
                value: t.votes_count || 1
              }))}
              options={{
                fontFamily: 'Noto Sans KR, Nanum Gothic, Malgun Gothic, Apple SD Gothic Neo, sans-serif',
                fontSizes: [16, 60],
              }}
              callbacks={{
                onWordClick: handleWordClick,
              }}
            />
            <div className="text-sm text-gray-300 mt-2">
              원하는 주제를 클릭하면 투표가 가능합니다!
            </div>
          </div>

          {/* 주제 목록: 인기 순위 + 투표 버튼이 한 박스에서 함께 보이도록, votes_count 내림차순 정렬 */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold mb-3">인기 주제 순위</h4>
        {suggestedTopics.length === 0 ? (
          <div className="text-center text-gray-300 py-8">
            아직 제안된 주제가 없습니다.
          </div>
        ) : (
              suggestedTopics
                .slice() // 복사본 생성
                .sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0))
                .slice(0, 3)
                .map((topic, index) => (
            <div 
              key={topic.id}
              className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-yellow-400 w-6">
                  {index + 1}
                </span>
                <div>
                        <span className="text-white">{topic.title || topic.topic}</span>
                  {topic.description && (
                    <p className="text-sm text-gray-300">{topic.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-300 text-sm">
                  {topic.votes_count}표
                </span>
                <button
                  onClick={() => handleVote(topic.id)}
                  disabled={!user}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    user
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {user ? '투표' : '🔒 투표'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 안내 메시지 */}
      <div className="mt-4 text-sm text-gray-300">
        💡 가장 많은 투표를 받은 주제가 다음 Competition 주제로 선정됩니다!
      </div>
    </div>
  )
} 