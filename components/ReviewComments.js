import { useState, useEffect } from 'react'
import { getReviewComments, createComment, updateComment, deleteComment } from '../lib/reviewApi'

export default function ReviewComments({ reviewId, currentUserId, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialComments.length === 0) {
      loadComments()
    }
  }, [reviewId])

  const loadComments = async () => {
    try {
      setLoading(true)
      const data = await getReviewComments(reviewId)
      setComments(data || [])
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !currentUserId) return

    try {
      const commentData = {
        review_id: reviewId,
        user_id: currentUserId,
        comment_text: newComment.trim(),
        parent_id: replyTo
      }

      const newCommentObj = await createComment(commentData)
      
      if (replyTo) {
        // 대댓글인 경우
        setComments(prev => prev.map(comment => {
          if (comment.id === replyTo) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newCommentObj]
            }
          }
          return comment
        }))
      } else {
        // 일반 댓글인 경우
        setComments(prev => [...prev, newCommentObj])
      }

      setNewComment('')
      setReplyTo(null)
    } catch (error) {
      console.error('Failed to submit comment:', error)
      alert('댓글 작성에 실패했습니다.')
    }
  }

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return

    try {
      await updateComment(commentId, { comment_text: editText.trim() })
      
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, comment_text: editText.trim(), is_edited: true }
        }
        // 대댓글 수정
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return { ...reply, comment_text: editText.trim(), is_edited: true }
              }
              return reply
            })
          }
        }
        return comment
      }))

      setEditingComment(null)
      setEditText('')
    } catch (error) {
      console.error('Failed to edit comment:', error)
      alert('댓글 수정에 실패했습니다.')
    }
  }

  const handleDeleteComment = async (commentId, parentId = null) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return

    try {
      await deleteComment(commentId)
      
      if (parentId) {
        // 대댓글 삭제
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== commentId)
            }
          }
          return comment
        }))
      } else {
        // 일반 댓글 삭제
        setComments(prev => prev.filter(comment => comment.id !== commentId))
      }
    } catch (error) {
      console.error('Failed to delete comment:', error)
      alert('댓글 삭제에 실패했습니다.')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60))
        return `${minutes}분 전`
      }
      return `${hours}시간 전`
    } else if (days < 7) {
      return `${days}일 전`
    } else {
      return date.toLocaleDateString('ko-KR')
    }
  }

  const CommentItem = ({ comment, isReply = false, parentId = null }) => {
    // 익명 처리 - 모든 사용자를 *** 표시
    const userName = '***'
    const avatarLetter = '?'
    const isOwner = comment.user_id === currentUserId

    return (
      <div className={`${isReply ? 'ml-12' : ''} mb-3`}>
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {avatarLetter}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-white">{userName}</span>
              <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
              {comment.is_edited && (
                <span className="text-xs text-gray-500">(수정됨)</span>
              )}
            </div>
            
            {editingComment === comment.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-3 py-1 bg-gray-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => handleEditComment(comment.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null)
                    setEditText('')
                  }}
                  className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-500"
                >
                  취소
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-300 mb-2">{comment.comment_text}</p>
                <div className="flex items-center gap-2">
                  {!isReply && (
                    <button
                      onClick={() => {
                        setReplyTo(comment.id)
                        setNewComment('')
                      }}
                      className="text-xs text-gray-500 hover:text-gray-400"
                    >
                      답글
                    </button>
                  )}
                  {isOwner && (
                    <>
                      <button
                        onClick={() => {
                          setEditingComment(comment.id)
                          setEditText(comment.comment_text)
                        }}
                        className="text-xs text-gray-500 hover:text-gray-400"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id, parentId)}
                        className="text-xs text-red-500 hover:text-red-400"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* 대댓글 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                isReply={true} 
                parentId={comment.id}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      {/* 댓글 목록 */}
      {comments.length > 0 && (
        <div className="mb-4">
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {/* 댓글 작성 폼 */}
      {currentUserId ? (
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyTo ? "답글을 작성하세요..." : "댓글을 작성하세요..."}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {replyTo && (
            <button
              type="button"
              onClick={() => {
                setReplyTo(null)
                setNewComment('')
              }}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-500"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            작성
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-500 text-sm py-2">
          댓글을 작성하려면 로그인이 필요합니다.
        </p>
      )}
    </div>
  )
}