import { useState, useEffect } from 'react'
import { wallfacerPlans } from '../../lib/supabaseThreeBody'
import { auth } from '../../lib/supabase'
import styles from './styles/WallfacerPlans.module.css'

export default function WallfacerPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [sortBy, setSortBy] = useState('created_at')
  const [selectedPlan, setSelectedPlan] = useState(null)

  // 새 계획 폼 상태
  const [newPlan, setNewPlan] = useState({
    title: '',
    strategy_type: '기술',
    description: '',
    detailed_plan: '',
    success_probability: 50
  })

  useEffect(() => {
    loadPlans()
    loadUser()
  }, [sortBy])

  const loadUser = async () => {
    const currentUser = await auth.getCurrentUser()
    setUser(currentUser)
  }

  const loadPlans = async () => {
    setLoading(true)
    const { data, error } = await wallfacerPlans.getPlans(sortBy)
    if (!error && data) {
      setPlans(data)
    }
    setLoading(false)
  }

  const handleCreatePlan = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    const { data, error } = await wallfacerPlans.createPlan(newPlan)

    if (error) {
      alert('계획 생성 실패: ' + error.message)
      return
    }

    // 초기화
    setNewPlan({
      title: '',
      strategy_type: '기술',
      description: '',
      detailed_plan: '',
      success_probability: 50
    })
    setShowCreateForm(false)
    loadPlans()
  }

  const handleLike = async (planId) => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    const { error } = await wallfacerPlans.likePlan(planId)
    if (!error) {
      loadPlans()
    }
  }

  const strategyTypes = ['기술', '외교', '군사', '심리', '기타']
  const strategyIcons = {
    '기술': '⚙️',
    '외교': '🤝',
    '군사': '⚔️',
    '심리': '🧠',
    '기타': '💡'
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>면벽 계획 (Wallfacer Plans)</h1>
        <p className={styles.subtitle}>
          당신이 면벽자라면? 삼체 침공에 대항할 나만의 전략을 공유하세요.
        </p>
      </header>

      <div className={styles.controls}>
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
            className={`${styles.sortButton} ${sortBy === 'views_count' ? styles.active : ''}`}
            onClick={() => setSortBy('views_count')}
          >
            조회순
          </button>
        </div>

        <button
          className={styles.createButton}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '취소' : '+ 새 계획 작성'}
        </button>
      </div>

      {/* 계획 작성 폼 */}
      {showCreateForm && (
        <div className={styles.createForm}>
          <h2 className={styles.formTitle}>나만의 면벽 계획 작성</h2>
          <form onSubmit={handleCreatePlan}>
            <div className={styles.formGroup}>
              <label>계획 제목</label>
              <input
                type="text"
                value={newPlan.title}
                onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                placeholder="예: 양자 통신 네트워크 구축"
                required
                maxLength={100}
              />
            </div>

            <div className={styles.formGroup}>
              <label>전략 유형</label>
              <div className={styles.strategyTypeGrid}>
                {strategyTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`${styles.typeButton} ${newPlan.strategy_type === type ? styles.selected : ''}`}
                    onClick={() => setNewPlan({ ...newPlan, strategy_type: type })}
                  >
                    {strategyIcons[type]} {type}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>간단 설명</label>
              <textarea
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                placeholder="계획의 핵심 아이디어를 2-3줄로 요약하세요."
                required
                maxLength={300}
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label>상세 계획</label>
              <textarea
                value={newPlan.detailed_plan}
                onChange={(e) => setNewPlan({ ...newPlan, detailed_plan: e.target.value })}
                placeholder="구체적인 실행 단계, 필요한 자원, 예상되는 결과 등을 상세히 작성하세요."
                required
                rows={8}
              />
            </div>

            <div className={styles.formGroup}>
              <label>성공 확률 예측: {newPlan.success_probability}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={newPlan.success_probability}
                onChange={(e) => setNewPlan({ ...newPlan, success_probability: parseInt(e.target.value) })}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              계획 제출하기
            </button>
          </form>
        </div>
      )}

      {/* 계획 목록 */}
      <div className={styles.plansList}>
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : plans.length === 0 ? (
          <div className={styles.empty}>
            아직 작성된 계획이 없습니다. 첫 번째 면벽자가 되어보세요!
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.planCard} ${selectedPlan?.id === plan.id ? styles.expanded : ''}`}
              onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
            >
              <div className={styles.planHeader}>
                <div className={styles.planTitleRow}>
                  <span className={styles.strategyIcon}>{strategyIcons[plan.strategy_type]}</span>
                  <h3 className={styles.planTitle}>{plan.title}</h3>
                </div>
                <span className={styles.strategyType}>{plan.strategy_type}</span>
              </div>

              <div className={styles.planMeta}>
                <span className={styles.author}>면벽자: {plan.username}</span>
                <span className={styles.date}>{new Date(plan.created_at).toLocaleDateString('ko-KR')}</span>
              </div>

              <p className={styles.planDescription}>{plan.description}</p>

              <div className={styles.planStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>성공 확률</span>
                  <div className={styles.probabilityBar}>
                    <div
                      className={styles.probabilityFill}
                      style={{ width: `${plan.success_probability}%` }}
                    />
                    <span className={styles.probabilityText}>{plan.success_probability}%</span>
                  </div>
                </div>
              </div>

              {selectedPlan?.id === plan.id && (
                <div className={styles.planDetails}>
                  <h4 className={styles.detailsTitle}>상세 계획</h4>
                  <p className={styles.detailedPlan}>{plan.detailed_plan}</p>
                </div>
              )}

              <div className={styles.planActions}>
                <button
                  className={styles.likeButton}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLike(plan.id)
                  }}
                >
                  ❤️ {plan.likes_count}
                </button>
                <span className={styles.views}>👁️ {plan.views_count}</span>
              </div>

              <div className={styles.expandHint}>
                {selectedPlan?.id === plan.id ? '클릭하여 접기 ▲' : '클릭하여 상세보기 ▼'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
