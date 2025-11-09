import { supabase } from './supabase'

/**
 * Interview Questions and Answers Service
 * Handles CRUD operations for user's customized interview questions and answers
 */

// ==================== Questions ====================

/**
 * Get all user's customized questions
 * @param {string} userId - User ID
 * @param {string} questionType - Optional filter by type ("essential" or "category")
 * @returns {Promise<{data, error}>}
 */
export async function getUserQuestions(userId, questionType = null) {
  let query = supabase
    .from('univ_user_interview_questions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (questionType) {
    query = query.eq('question_type', questionType)
  }

  const { data, error } = await query
  return { data, error }
}

/**
 * Get a specific user question by original question ID
 * @param {string} userId - User ID
 * @param {string} originalQuestionId - Original question ID
 * @returns {Promise<{data, error}>}
 */
export async function getUserQuestion(userId, originalQuestionId) {
  const { data, error } = await supabase
    .from('univ_user_interview_questions')
    .select('*')
    .eq('user_id', userId)
    .eq('original_question_id', originalQuestionId)
    .single()

  return { data, error }
}

/**
 * Get any question by original question ID (regardless of user)
 * Used when logged in users can view all questions
 * @param {string} originalQuestionId - Original question ID
 * @returns {Promise<{data, error}>}
 */
export async function getAnyQuestionByQuestionId(originalQuestionId) {
  const { data, error } = await supabase
    .from('univ_user_interview_questions')
    .select('*')
    .eq('original_question_id', originalQuestionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return { data, error }
}

/**
 * Save user's customized question (always creates new row, keeps history)
 * @param {Object} questionData - Question data
 * @param {string} questionData.userId - User ID
 * @param {string} questionData.originalQuestionId - Original question ID
 * @param {string} questionData.questionType - Question type ("essential" or "category")
 * @param {string} questionData.category - Category name (for category questions)
 * @param {string} questionData.customQuestion - User's customized question
 * @param {string} questionData.originalQuestion - Original question text
 * @returns {Promise<{data, error}>}
 */
export async function saveUserQuestion(questionData) {
  const { data, error } = await supabase
    .from('univ_user_interview_questions')
    .insert({
      user_id: questionData.userId,
      original_question_id: questionData.originalQuestionId,
      question_type: questionData.questionType,
      category: questionData.category || null,
      custom_question: questionData.customQuestion,
      original_question: questionData.originalQuestion,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()

  return { data, error }
}

/**
 * Delete a user's customized question
 * @param {string} userId - User ID
 * @param {string} originalQuestionId - Original question ID
 * @returns {Promise<{data, error}>}
 */
export async function deleteUserQuestion(userId, originalQuestionId) {
  const { data, error } = await supabase
    .from('univ_user_interview_questions')
    .delete()
    .eq('user_id', userId)
    .eq('original_question_id', originalQuestionId)

  return { data, error }
}

// ==================== Answers ====================

/**
 * Get all user's answers
 * @param {string} userId - User ID
 * @param {boolean} completedOnly - Filter only completed answers
 * @returns {Promise<{data, error}>}
 */
export async function getUserAnswers(userId, completedOnly = false) {
  let query = supabase
    .from('univ_user_interview_answers')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (completedOnly) {
    query = query.eq('is_completed', true)
  }

  const { data, error } = await query
  return { data, error }
}

/**
 * Get a specific user answer by question ID
 * @param {string} userId - User ID
 * @param {string} questionId - Question ID
 * @returns {Promise<{data, error}>}
 */
export async function getUserAnswer(userId, questionId) {
  const { data, error } = await supabase
    .from('univ_user_interview_answers')
    .select('*')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .single()

  return { data, error }
}

/**
 * Get any answer by question ID (regardless of user)
 * Used when logged in users can view all answers
 * @param {string} questionId - Question ID
 * @returns {Promise<{data, error}>}
 */
export async function getAnyAnswerByQuestionId(questionId) {
  const { data, error } = await supabase
    .from('univ_user_interview_answers')
    .select('*')
    .eq('question_id', questionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return { data, error }
}

/**
 * Get latest 3 answers by question ID (regardless of user)
 * Returns up to 3 most recent versions
 * @param {string} questionId - Question ID
 * @returns {Promise<{data, error}>}
 */
export async function getLatestAnswersByQuestionId(questionId) {
  const { data, error } = await supabase
    .from('univ_user_interview_answers')
    .select('*')
    .eq('question_id', questionId)
    .order('created_at', { ascending: false })
    .limit(3)

  return { data, error }
}

/**
 * Save user's answer (always creates new row, keeps history)
 * @param {Object} answerData - Answer data
 * @param {string} answerData.userId - User ID
 * @param {string} answerData.questionId - Question ID
 * @param {string} answerData.answer - User's answer text
 * @param {string[]} answerData.keywords - Extracted keywords
 * @param {number} answerData.timeSpent - Time spent in seconds
 * @param {boolean} answerData.isCompleted - Whether answer is completed
 * @returns {Promise<{data, error}>}
 */
export async function saveUserAnswer(answerData) {
  const { data, error } = await supabase
    .from('univ_user_interview_answers')
    .insert({
      user_id: answerData.userId,
      question_id: answerData.questionId,
      answer: answerData.answer,
      keywords: answerData.keywords || [],
      time_spent: answerData.timeSpent || 0,
      is_completed: answerData.isCompleted || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()

  return { data, error }
}

/**
 * Delete a user's answer
 * @param {string} userId - User ID
 * @param {string} questionId - Question ID
 * @returns {Promise<{data, error}>}
 */
export async function deleteUserAnswer(userId, questionId) {
  const { data, error } = await supabase
    .from('univ_user_interview_answers')
    .delete()
    .eq('user_id', userId)
    .eq('question_id', questionId)

  return { data, error }
}

/**
 * Mark answer as completed
 * @param {string} userId - User ID
 * @param {string} questionId - Question ID
 * @returns {Promise<{data, error}>}
 */
export async function markAnswerCompleted(userId, questionId) {
  const { data, error } = await supabase
    .from('univ_user_interview_answers')
    .update({
      is_completed: true,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .select()

  return { data, error }
}

// ==================== Batch Operations ====================

/**
 * Get all questions and answers for a user (joined data)
 * @param {string} userId - User ID
 * @returns {Promise<{data, error}>}
 */
export async function getUserQuestionsWithAnswers(userId) {
  // Get questions
  const { data: questions, error: questionsError } = await getUserQuestions(userId)

  if (questionsError) {
    return { data: null, error: questionsError }
  }

  // Get answers
  const { data: answers, error: answersError } = await getUserAnswers(userId)

  if (answersError) {
    return { data: null, error: answersError }
  }

  // Combine data
  const combined = questions.map(question => {
    const answer = answers.find(a => a.question_id === question.original_question_id)
    return {
      ...question,
      answer: answer || null
    }
  })

  return { data: combined, error: null }
}

/**
 * Get statistics for user's interview preparation
 * @param {string} userId - User ID
 * @returns {Promise<{data, error}>}
 */
export async function getUserInterviewStats(userId) {
  // Get all answers
  const { data: answers, error } = await getUserAnswers(userId)

  if (error) {
    return { data: null, error }
  }

  const stats = {
    totalQuestions: answers.length,
    completedAnswers: answers.filter(a => a.is_completed).length,
    totalTimeSpent: answers.reduce((sum, a) => sum + (a.time_spent || 0), 0),
    averageAnswerLength: answers.length > 0
      ? Math.round(answers.reduce((sum, a) => sum + a.answer.length, 0) / answers.length)
      : 0,
    totalKeywords: answers.reduce((sum, a) => sum + (a.keywords?.length || 0), 0)
  }

  return { data: stats, error: null }
}

// ==================== Export/PDF Data ====================

/**
 * Get formatted data for PDF export
 * @param {string} userId - User ID
 * @param {string} questionType - Optional filter by type
 * @returns {Promise<{data, error}>}
 */
export async function getExportData(userId, questionType = null) {
  const { data: questionsWithAnswers, error } = await getUserQuestionsWithAnswers(userId)

  if (error) {
    return { data: null, error }
  }

  let filtered = questionsWithAnswers

  if (questionType) {
    filtered = filtered.filter(q => q.question_type === questionType)
  }

  // Group by category for category questions
  const grouped = {
    essential: filtered.filter(q => q.question_type === 'essential'),
    byCategory: {}
  }

  filtered
    .filter(q => q.question_type === 'category')
    .forEach(q => {
      if (!grouped.byCategory[q.category]) {
        grouped.byCategory[q.category] = []
      }
      grouped.byCategory[q.category].push(q)
    })

  return { data: grouped, error: null }
}
