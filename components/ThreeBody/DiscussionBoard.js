import { useState, useEffect } from 'react'
import { discussions, comments } from '../../lib/supabaseThreeBody'
import { auth } from '../../lib/supabase'
import styles from './styles/DiscussionBoard.module.css'

export default function DiscussionBoard() {
  const [discussionList, setDiscussionList] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedDiscussion, setSelectedDiscussion] = useState(null)
  const [discussionComments, setDiscussionComments] = useState([])
  const [sortBy, setSortBy] = useState('created_at')
  const [categoryFilter, setCategoryFilter] = useState('전체')

  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    category: '일반 토론',
    content: ''
  })

  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)

  const categories = ['전체', '일반 토론', '인물 분석', '전략 토론', '과학 토론', '팬 이론', '만약에...']

  useEffect(() => {
    loadDiscussions()
    loadUser()
  }, [sortBy, categoryFilter])

  const loadUser = async () => {
    const currentUser = await auth.getCurrentUser()
    setUser(currentUser)
  }

  const loadDiscussions = async () => {
    setLoading(true)
    const { data, error } = await discussions.getDiscussions(sortBy, categoryFilter === '전체' ? null : categoryFilter)
    if (!error && data) {
      setDiscussionList(data)
    }
    setLoading(false)
  }

  const handleCreateDiscussion = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    const { data, error } = await discussions.createDiscussion(newDiscussion)

    if (error) {
      alert('토론 생성 실패: ' + error.message)
      return
    }

    setNewDiscussion({
      title: '',
      category: '일반 토론',
      content: ''
    })
    setShowCreateForm(false)
    loadDiscussions()
  }

  const handleSelectDiscussion = async (discussion) => {
    if (selectedDiscussion?.id === discussion.id) {
      setSelectedDiscussion(null)
      setDiscussionComments([])
      return
    }

    setSelectedDiscussion(discussion)

    // 조회수 증가
    await discussions.incrementViews(discussion.id)

    // 댓글 불러오기
    const { data, error } = await comments.getComments(discussion.id)
    if (!error && data) {
      setDiscussionComments(data)
    }

    // 목록 새로고침 (조회수 반영)
    loadDiscussions()
  }

  const handleLikeDiscussion = async (discussionId) => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    const { error } = await discussions.likeDiscussion(discussionId)
    if (!error) {
      loadDiscussions()
      if (selectedDiscussion?.id === discussionId) {
        const updated = discussionList.find(d => d.id === discussionId)
        if (updated) setSelectedDiscussion(updated)
      }
    }
  }

  const handleCreateComment = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!selectedDiscussion) return

    const { data, error } = await comments.createComment({
      discussion_id: selectedDiscussion.id,
      content: newComment,
      parent_id: replyTo?.id || null
    })

    if (error) {
      alert('댓글 작성 실패: ' + error.message)
      return
    }

    setNewComment('')
    setReplyTo(null)

    // 댓글 목록 새로고침
    const { data: updatedComments } = await comments.getComments(selectedDiscussion.id)
    if (updatedComments) {
      setDiscussionComments(updatedComments)
    }

    // 토론 목록 새로고침 (댓글 수 반영)
    loadDiscussions()
  }

  const handleLikeComment = async (commentId) => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    const { error } = await comments.likeComment(commentId)
    if (!error) {
      const { data: updatedComments } = await comments.getComments(selectedDiscussion.id)
      if (updatedComments) {
        setDiscussionComments(updatedComments)
      }
    }
  }

  const renderComments = (parentId = null, level = 0) => {
    const filtered = discussionComments.filter(c => c.parent_id === parentId)

    return filtered.map(comment => (
      <div key={comment.id} className={styles.commentItem} style={{ marginLeft: `${level * 30}px` }}>
        <div className={styles.commentHeader}>
          <span className={styles.commentAuthor}>{comment.username}</span>
          <span className={styles.commentDate}>
            {new Date(comment.created_at).toLocaleString('ko-KR')}
          </span>
        </div>
        <p className={styles.commentContent}>{comment.content}</p>
        <div className={styles.commentActions}>
          <button
            className={styles.likeCommentButton}
            onClick={() => handleLikeComment(comment.id)}
          >
            ❤️ {comment.likes_count}
          </button>
          <button
            className={styles.replyButton}
            onClick={() => setReplyTo(comment)}
          >
            💬 답글
          </button>
        </div>
        {renderComments(comment.id, level + 1)}
      </div>
    ))
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>삼체 토론 게시판</h1>
        <p className={styles.subtitle}>
          삼체 세계관에 대한 다양한 의견을 나누고, 팬 이론을 공유하세요.
        </p>
      </header>

      <div className={styles.controls}>
        <div className={styles.filterSection}>
          <div className={styles.categoryFilters}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.categoryButton} ${categoryFilter === cat ? styles.active : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.sortButtons}>
            <button
              className={`${styles.sortButton} ${sortBy === 'created_at' ? styles.active : ''}`}
              onClick={() => setSortBy('created_at')}
            >
              최신순
            </button>
            <button
              className={`${styles.sortButton} ${sortBy === 'likes_count' ? styles.active : ''}`}
              onClick={() => setSortBy('likes_count')}
            >
              인기순
            </button>
            <button
              className={`${styles.sortButton} ${sortBy === 'comments_count' ? styles.active : ''}`}
              onClick={() => setSortBy('comments_count')}
            >
              댓글순
            </button>
          </div>
        </div>

        <button
          className={styles.createButton}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '취소' : '+ 새 토론 시작'}
        </button>
      </div>

      {showCreateForm && (
        <div className={styles.createForm}>
          <h2 className={styles.formTitle}>새 토론 주제 만들기</h2>
          <form onSubmit={handleCreateDiscussion}>
            <div className={styles.formGroup}>
              <label>제목</label>
              <input
                type="text"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                placeholder="토론 주제를 입력하세요"
                required
                maxLength={200}
              />
            </div>

            <div className={styles.formGroup}>
              <label>카테고리</label>
              <div className={styles.categoryGrid}>
                {categories.filter(c => c !== '전체').map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.categorySelectButton} ${newDiscussion.category === cat ? styles.selected : ''}`}
                    onClick={() => setNewDiscussion({ ...newDiscussion, category: cat })}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>내용</label>
              <textarea
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                placeholder="토론 내용을 작성하세요. 여러분의 의견, 이론, 질문을 자유롭게 공유해주세요."
                required
                rows={10}
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              토론 시작하기
            </button>
          </form>
        </div>
      )}

      <div className={styles.discussionsList}>
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : discussionList.length === 0 ? (
          <div className={styles.empty}>
            아직 토론이 없습니다. 첫 번째 토론을 시작해보세요!
          </div>
        ) : (
          discussionList.map((discussion) => (
            <div key={discussion.id} className={styles.discussionCard}>
              <div
                className={styles.discussionMain}
                onClick={() => handleSelectDiscussion(discussion)}
              >
                <div className={styles.discussionHeader}>
                  <div className={styles.discussionTitleRow}>
                    <span className={styles.categoryBadge}>{discussion.category}</span>
                    <h3 className={styles.discussionTitle}>{discussion.title}</h3>
                  </div>
                  <div className={styles.discussionMeta}>
                    <span className={styles.author}>작성자: {discussion.username}</span>
                    <span className={styles.date}>{new Date(discussion.created_at).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>

                <p className={styles.discussionPreview}>
                  {discussion.content.substring(0, 200)}
                  {discussion.content.length > 200 && '...'}
                </p>

                <div className={styles.discussionStats}>
                  <button
                    className={styles.likeButton}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLikeDiscussion(discussion.id)
                    }}
                  >
                    ❤️ {discussion.likes_count}
                  </button>
                  <span className={styles.stat}>💬 {discussion.comments_count}</span>
                  <span className={styles.stat}>👁️ {discussion.views_count}</span>
                </div>

                <div className={styles.expandHint}>
                  {selectedDiscussion?.id === discussion.id ? '클릭하여 접기 ▲' : '클릭하여 전체보기 ▼'}
                </div>
              </div>

              {selectedDiscussion?.id === discussion.id && (
                <div className={styles.discussionDetail}>
                  <div className={styles.fullContent}>
                    <h4 className={styles.contentTitle}>전체 내용</h4>
                    <p className={styles.content}>{discussion.content}</p>
                  </div>

                  <div className={styles.commentsSection}>
                    <h4 className={styles.commentsTitle}>
                      댓글 ({discussionComments.length})
                    </h4>

                    {user && (
                      <form onSubmit={handleCreateComment} className={styles.commentForm}>
                        {replyTo && (
                          <div className={styles.replyInfo}>
                            <span>↳ {replyTo.username}님에게 답글</span>
                            <button
                              type="button"
                              onClick={() => setReplyTo(null)}
                              className={styles.cancelReply}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder={replyTo ? '답글을 작성하세요...' : '댓글을 작성하세요...'}
                          required
                          rows={3}
                          className={styles.commentInput}
                        />
                        <button type="submit" className={styles.commentSubmitButton}>
                          {replyTo ? '답글 달기' : '댓글 달기'}
                        </button>
                      </form>
                    )}

                    {!user && (
                      <div className={styles.loginPrompt}>
                        댓글을 작성하려면 로그인이 필요합니다.
                      </div>
                    )}

                    <div className={styles.commentsList}>
                      {discussionComments.length === 0 ? (
                        <div className={styles.noComments}>
                          아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
                        </div>
                      ) : (
                        renderComments()
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
