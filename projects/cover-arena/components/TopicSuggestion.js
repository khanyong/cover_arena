import { useState } from 'react'

export default function TopicSuggestion({ onTopicChange }) {
  const [newTopic, setNewTopic] = useState('')
  const [suggestedTopics, setSuggestedTopics] = useState([
    { id: 1, topic: 'Taylor Swift - Cruel Summer', votes: 45 },
    { id: 2, topic: 'BTS - Butter', votes: 38 },
    { id: 3, topic: 'Olivia Rodrigo - Vampire', votes: 32 },
    { id: 4, topic: 'NewJeans - Super Shy', votes: 28 },
    { id: 5, topic: 'The Weeknd - Blinding Lights', votes: 25 }
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTopic.trim()) {
      const newSuggestion = {
        id: Date.now(),
        topic: newTopic.trim(),
        votes: 1
      }
      setSuggestedTopics([newSuggestion, ...suggestedTopics])
      setNewTopic('')
    }
  }

  const handleVote = (id) => {
    setSuggestedTopics(prev => 
      prev.map(topic => 
        topic.id === id 
          ? { ...topic, votes: topic.votes + 1 }
          : topic
      ).sort((a, b) => b.votes - a.votes)
    )
  }

  const handleTopicSelect = (topic) => {
    if (onTopicChange) {
      onTopicChange(topic)
    }
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-4">
        🗳️ 다음 Competition 주제 제안
      </h3>
      
      {/* 새 주제 제안 폼 */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="새로운 주제를 입력하세요 (예: Taylor Swift - Cruel Summer)"
            className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            제안하기
          </button>
        </div>
      </form>

      {/* 주제 목록 */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold mb-3">인기 주제 순위</h4>
        {suggestedTopics.map((topic, index) => (
          <div 
            key={topic.id}
            className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold text-yellow-400 w-6">
                {index + 1}
              </span>
              <span className="text-white">{topic.topic}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-300 text-sm">
                {topic.votes}표
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVote(topic.id)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 transition-colors"
                >
                  투표
                </button>
                <button
                  onClick={() => handleTopicSelect(topic.topic)}
                  disabled={true}
                  className="px-3 py-1 bg-gray-600 text-gray-400 text-sm rounded-full cursor-not-allowed"
                  title="Admin 페이지에서만 주제 변경 가능"
                >
                  🔒 선택
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 안내 메시지 */}
      <div className="mt-4 text-sm text-gray-300">
        💡 가장 많은 투표를 받은 주제가 다음 Competition 주제로 선정됩니다!
      </div>
    </div>
  )
} 