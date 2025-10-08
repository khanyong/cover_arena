import { useState, useEffect } from 'react'
import styles from './styles/QuoteQuiz.module.css'

const allQuotes = [
  {
    text: "나는 세계를 파괴하려는 것이 아니라 세계를 변화시키려는 것이다.",
    character: "예원제",
    book: "1부 삼체",
    difficulty: "easy",
    hint: "문화대혁명의 피해자이자 ETO 창립자",
    context: "인류에 대한 절망과 삼체 문명에 대한 기대를 표현",
    options: ["예원제", "뤄지", "정청신", "마이크 에반스"]
  },
  {
    text: "우주는 암흑의 숲이고, 모든 문명은 총을 든 사냥꾼이다.",
    character: "뤄지",
    book: "2부 암흑의 숲",
    difficulty: "easy",
    hint: "암흑의 숲 이론을 발견한 면벽자",
    context: "우주 사회학의 핵심 이론을 제시",
    options: ["뤄지", "장베이하이", "빌 하인즈", "관이판"]
  },
  {
    text: "나약함과 무지는 생존의 장애가 아니다. 오만함이 장애다.",
    character: "뤄지",
    book: "2부 암흑의 숲",
    difficulty: "medium",
    hint: "검잡이로서 62년간 지구를 지킨 인물",
    context: "인류의 오만함이 초래한 위기를 경고",
    options: ["뤄지", "정청신", "예원제", "딩이"]
  },
  {
    text: "죽음은 인간이라는 존재가 경험할 수 없는 유일한 과정이다.",
    character: "예원제",
    book: "1부 삼체",
    difficulty: "medium",
    hint: "천체물리학자이자 홍안 기지 연구원",
    context: "인간 존재의 한계에 대한 철학적 성찰",
    options: ["예원제", "왕먀오", "양둥", "스창"]
  },
  {
    text: "인류는 이제 더 이상 어린아이가 아니다.",
    character: "장베이하이",
    book: "2부 암흑의 숲",
    difficulty: "medium",
    hint: "우주군 정치위원이자 도망주의자",
    context: "인류의 성숙과 우주 시대의 도래를 의미",
    options: ["장베이하이", "창웨이스", "뤄지", "정청신"]
  },
  {
    text: "우리의 방어는 두려움에서 시작된다.",
    character: "정청신",
    book: "3부 사신의 영생",
    difficulty: "easy",
    hint: "뤄지의 뒤를 이은 두 번째 검잡이",
    context: "검잡이로서의 각오와 책임감 표현",
    options: ["정청신", "뤄지", "관이판", "토마스 웨이드"]
  },
  {
    text: "물리학은 존재하지 않는다.",
    character: "양둥",
    book: "1부 삼체",
    difficulty: "easy",
    hint: "예원제의 딸이자 물리학자",
    context: "소폰에 의한 물리학 법칙 붕괴 발견",
    options: ["양둥", "딩이", "왕먀오", "예원제"]
  },
  {
    text: "생존을 위해서라면, 무엇을 포기할 수 있는가?",
    character: "토마스 웨이드",
    book: "3부 사신의 영생",
    difficulty: "medium",
    hint: "계단 프로젝트의 강경파 리더",
    context: "생존을 위한 극단적 선택의 정당성 주장",
    options: ["토마스 웨이드", "정청신", "뤄지", "장베이하이"]
  },
  {
    text: "사랑은 우주에서 가장 강력한 힘이다.",
    character: "윈톈밍",
    book: "3부 사신의 영생",
    difficulty: "medium",
    hint: "정청신에게 별을 선물한 엔지니어",
    context: "정청신을 향한 사랑의 힘 강조",
    options: ["윈톈밍", "정청신", "관이판", "뤄지"]
  },
  {
    text: "답하지 마라. 답하지 마라. 답하지 마라!",
    character: "삼체 평화주의자",
    book: "1부 삼체",
    difficulty: "hard",
    hint: "삼체 문명의 반전 세력",
    context: "지구에게 삼체의 위협을 경고",
    options: ["삼체 평화주의자", "예원제", "지자", "마이크 에반스"]
  },
  {
    text: "전진! 전진! 전진! 우리의 목적지는 앞에 있다!",
    character: "창웨이스",
    book: "2부 암흑의 숲",
    difficulty: "medium",
    hint: "우주군 초대 사령관",
    context: "말일 전투 직전 함대에게 내린 명령",
    options: ["창웨이스", "장베이하이", "둥펑웨이", "조지 피츠로이"]
  },
  {
    text: "나는 검을 잡았지만, 결코 검을 휘두르지 않았다.",
    character: "뤄지",
    book: "3부 사신의 영생",
    difficulty: "easy",
    hint: "첫 번째 검잡이로 62년간 임무 수행",
    context: "검잡이로서의 억제력 유지 전략",
    options: ["뤄지", "정청신", "토마스 웨이드", "관이판"]
  },
  {
    text: "우주에서 가장 빠른 것은 빛이 아니라 어둠이다.",
    character: "관이판",
    book: "3부 사신의 영생",
    difficulty: "hard",
    hint: "우주 사회학자이자 뤄지의 동료",
    context: "암흑의 숲 이론의 본질 설명",
    options: ["관이판", "뤄지", "딩이", "양둥"]
  },
  {
    text: "지구는 인류의 요람이지만, 인류는 영원히 요람에 머물 수 없다.",
    character: "마이크 에반스",
    book: "1부 삼체",
    difficulty: "medium",
    hint: "ETO 수장이자 극단적 환경보호주의자",
    context: "인류의 우주 진출 필요성 역설",
    options: ["마이크 에반스", "예원제", "장베이하이", "뤄지"]
  },
  {
    text: "시간은 가장 냉혹한 차원이다.",
    character: "정청신",
    book: "3부 사신의 영생",
    difficulty: "medium",
    hint: "동면을 통해 미래로 간 항공우주 엔지니어",
    context: "시간의 흐름이 가져온 변화와 상실 표현",
    options: ["정청신", "뤄지", "윈톈밍", "관이판"]
  },
  {
    text: "우주를 향해 외치는 것은 자살 행위다.",
    character: "뤄지",
    book: "2부 암흑의 숲",
    difficulty: "easy",
    hint: "암흑의 숲 이론 발견자",
    context: "우주로 신호를 보내는 위험성 경고",
    options: ["뤄지", "양둥", "예원제", "왕먀오"]
  },
  {
    text: "인류에게는 자신을 구할 자격이 없다.",
    character: "마이크 에반스",
    book: "1부 삼체",
    difficulty: "hard",
    hint: "환경파괴에 절망한 ETO 리더",
    context: "인류의 환경 파괴에 대한 비판",
    options: ["마이크 에반스", "예원제", "양둥", "왕먀오"]
  },
  {
    text: "나는 그녀를 사랑했지만, 그녀는 별을 사랑했다.",
    character: "윈톈밍",
    book: "3부 사신의 영생",
    difficulty: "hard",
    hint: "정청신에게 별 DX3906을 선물",
    context: "정청신을 향한 일방적 사랑의 아픔",
    options: ["윈톈밍", "뤄지", "토마스 웨이드", "관이판"]
  },
  {
    text: "도망은 수치가 아니다. 생존의 전략이다.",
    character: "장베이하이",
    book: "2부 암흑의 숲",
    difficulty: "medium",
    hint: "자연선택호를 탈취한 정치위원",
    context: "도망주의를 정당화하는 논리",
    options: ["장베이하이", "우웨이", "창웨이스", "뤄지"]
  },
  {
    text: "이것은 인류에 대한 범죄가 아니라 인류에 대한 구원이다.",
    character: "예원제",
    book: "1부 삼체",
    difficulty: "hard",
    hint: "삼체에게 신호를 보낸 최초의 인물",
    context: "삼체 초대 행위의 정당화",
    options: ["예원제", "마이크 에반스", "양둥", "왕먀오"]
  }
]

export default function QuoteQuiz() {
  const [gameMode, setGameMode] = useState(null) // null, 'normal', 'hard', 'timed'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [comboStreak, setComboStreak] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [usedHints, setUsedHints] = useState(0)
  const [quotes, setQuotes] = useState([])

  // 게임 모드 선택 시 문제 섞기
  const startQuiz = (mode) => {
    setGameMode(mode)
    const shuffled = [...allQuotes].sort(() => Math.random() - 0.5)

    if (mode === 'normal') {
      setQuotes(shuffled.slice(0, 15))
    } else if (mode === 'hard') {
      const hardQuotes = allQuotes.filter(q => q.difficulty === 'hard' || q.difficulty === 'medium')
      setQuotes(hardQuotes.sort(() => Math.random() - 0.5).slice(0, 15))
    } else if (mode === 'timed') {
      setQuotes(shuffled.slice(0, 20))
      setTimeLeft(20)
    }
  }

  // 타이머 모드
  useEffect(() => {
    if (gameMode === 'timed' && !quizCompleted && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (gameMode === 'timed' && timeLeft === 0 && !showResult) {
      // 시간 초과
      handleAnswer(null)
    }
  }, [timeLeft, gameMode, quizCompleted, showResult])

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    const isCorrect = answer === quotes[currentQuestion].character

    if (isCorrect) {
      let points = 1
      // 힌트 안 쓰면 보너스
      if (!showHint) points += 0.5
      // 타이머 모드에서 빨리 답하면 보너스
      if (gameMode === 'timed' && timeLeft > 15) points += 0.5

      setScore(score + points)
      setComboStreak(comboStreak + 1)
      setMaxCombo(Math.max(maxCombo, comboStreak + 1))
    } else {
      setComboStreak(0)
    }

    setTimeout(() => {
      if (currentQuestion < quotes.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setShowHint(false)
        if (gameMode === 'timed') setTimeLeft(20)
      } else {
        setQuizCompleted(true)
      }
    }, 1500)

    setShowResult(true)
  }

  const useHint = () => {
    setShowHint(true)
    setUsedHints(usedHints + 1)
  }

  const resetQuiz = () => {
    setGameMode(null)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizCompleted(false)
    setShowHint(false)
    setComboStreak(0)
    setMaxCombo(0)
    setTimeLeft(20)
    setUsedHints(0)
    setQuotes([])
  }

  // 모드 선택 화면
  if (!gameMode) {
    return (
      <div className={styles.quizContainer}>
        <div className={styles.modeSelection}>
          <h2 className={styles.modeTitle}>명대사 퀴즈</h2>
          <p className={styles.modeSubtitle}>게임 모드를 선택하세요</p>

          <div className={styles.modeGrid}>
            <div className={styles.modeCard} onClick={() => startQuiz('normal')}>
              <div className={styles.modeIcon}>📚</div>
              <h3>일반 모드</h3>
              <p>15문제 / 난이도 혼합</p>
              <p className={styles.modeDesc}>힌트 사용 가능</p>
            </div>

            <div className={styles.modeCard} onClick={() => startQuiz('hard')}>
              <div className={styles.modeIcon}>🔥</div>
              <h3>고난이도 모드</h3>
              <p>15문제 / 어려운 문제</p>
              <p className={styles.modeDesc}>진정한 팬을 위한 도전</p>
            </div>

            <div className={styles.modeCard} onClick={() => startQuiz('timed')}>
              <div className={styles.modeIcon}>⏱️</div>
              <h3>타이머 모드</h3>
              <p>20문제 / 20초 제한</p>
              <p className={styles.modeDesc}>빠른 판단력 테스트</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    const percentage = Math.round((score / quotes.length) * 100)
    let message = ""
    let rank = ""

    if (percentage === 100) {
      message = "완벽합니다! 당신은 진정한 삼체 마스터!"
      rank = "🏆 검잡이"
    } else if (percentage >= 80) {
      message = "훌륭해요! 삼체에 대한 이해가 깊으시네요!"
      rank = "⭐ 면벽자"
    } else if (percentage >= 60) {
      message = "잘했어요! 조금만 더 읽어보세요."
      rank = "💫 우주군 사령관"
    } else if (percentage >= 40) {
      message = "괜찮아요. 다시 한번 도전해보세요!"
      rank = "🌟 PDC 요원"
    } else {
      message = "삼체를 다시 읽어보시는 건 어떨까요?"
      rank = "📖 입문자"
    }

    return (
      <div className={styles.quizContainer}>
        <div className={styles.resultCard}>
          <h2 className={styles.resultTitle}>퀴즈 완료!</h2>
          <div className={styles.rankBadge}>{rank}</div>

          <div className={styles.scoreDisplay}>
            <div className={styles.scoreNumber}>{score.toFixed(1)}</div>
            <div className={styles.scoreTotal}>/ {quotes.length}</div>
          </div>
          <div className={styles.percentage}>{percentage}%</div>
          <p className={styles.resultMessage}>{message}</p>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>최대 연속 정답</div>
              <div className={styles.statValue}>{maxCombo}연속</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>힌트 사용</div>
              <div className={styles.statValue}>{usedHints}회</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>게임 모드</div>
              <div className={styles.statValue}>
                {gameMode === 'normal' ? '일반' : gameMode === 'hard' ? '고난이도' : '타이머'}
              </div>
            </div>
          </div>

          <button className={styles.retryButton} onClick={resetQuiz}>
            다시 도전하기
          </button>
        </div>
      </div>
    )
  }

  const quote = quotes[currentQuestion]

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <div className={styles.progress}>
          질문 {currentQuestion + 1} / {quotes.length}
        </div>
        <div className={styles.headerRight}>
          {gameMode === 'timed' && (
            <div className={`${styles.timerBox} ${timeLeft <= 5 ? styles.timerWarning : ''}`}>
              ⏱️ {timeLeft}초
            </div>
          )}
          <div className={styles.scoreBox}>
            점수: {score.toFixed(1)}
          </div>
          {comboStreak > 1 && (
            <div className={styles.comboBox}>
              🔥 {comboStreak}연속!
            </div>
          )}
        </div>
      </div>

      <div className={styles.difficultyBadge}>
        {quote.difficulty === 'easy' ? '⭐ 쉬움' : quote.difficulty === 'medium' ? '⭐⭐ 보통' : '⭐⭐⭐ 어려움'}
      </div>

      <div className={styles.quoteCard}>
        <div className={styles.quoteIcon}>"</div>
        <p className={styles.quoteText}>{quote.text}</p>
        <div className={styles.bookTag}>{quote.book}</div>
      </div>

      {showHint && (
        <div className={styles.hintBox}>
          💡 힌트: {quote.hint}
        </div>
      )}

      <div className={styles.questionText}>
        이 명대사를 한 인물은 누구일까요?
      </div>

      <div className={styles.optionsGrid}>
        {quote.options.map((option, index) => (
          <button
            key={index}
            className={`${styles.optionButton} ${
              selectedAnswer === option
                ? option === quote.character
                  ? styles.correct
                  : styles.incorrect
                : ''
            } ${showResult && option === quote.character ? styles.correct : ''}`}
            onClick={() => !selectedAnswer && handleAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>

      {!showHint && !showResult && (
        <button className={styles.hintButton} onClick={useHint}>
          💡 힌트 보기 (점수 -0.5)
        </button>
      )}

      {showResult && (
        <div className={`${styles.feedback} ${
          selectedAnswer === quote.character ? styles.feedbackCorrect : styles.feedbackIncorrect
        }`}>
          {selectedAnswer === quote.character ? (
            <div>
              <span className={styles.feedbackMain}>정답입니다! ✓</span>
              <p className={styles.feedbackContext}>{quote.context}</p>
            </div>
          ) : (
            <div>
              <span className={styles.feedbackMain}>
                아쉽습니다. 정답은 "{quote.character}"입니다.
              </span>
              <p className={styles.feedbackContext}>{quote.context}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
