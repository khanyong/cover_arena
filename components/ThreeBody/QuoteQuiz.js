import { useState } from 'react'
import styles from './styles/QuoteQuiz.module.css'

const quotes = [
  {
    text: "나는 세계를 파괴하려는 것이 아니라 세계를 변화시키려는 것이다.",
    character: "예원제",
    book: "1부 삼체",
    options: ["예원제", "뤄지", "정청신", "마이크 에반스"]
  },
  {
    text: "우주는 암흑의 숲이고, 모든 문명은 총을 든 사냥꾼이다.",
    character: "뤄지",
    book: "2부 암흑의 숲",
    options: ["뤄지", "장베이하이", "빌 하인즈", "관이판"]
  },
  {
    text: "나약함과 무지는 생존의 장애가 아니다. 오만함이 장애다.",
    character: "뤄지",
    book: "2부 암흑의 숲",
    options: ["뤄지", "정청신", "예원제", "딩이"]
  },
  {
    text: "죽음은 인간이라는 존재가 경험할 수 없는 유일한 과정이다.",
    character: "예원제",
    book: "1부 삼체",
    options: ["예원제", "왕먀오", "양둥", "소창"]
  },
  {
    text: "인류는 이제 더 이상 어린아이가 아니다.",
    character: "장베이하이",
    book: "2부 암흑의 숲",
    options: ["장베이하이", "창웨이스", "뤄지", "정청신"]
  },
  {
    text: "우리의 방어는 두려움에서 시작된다.",
    character: "정청신",
    book: "3부 사신의 영생",
    options: ["정청신", "뤄지", "관이판", "토마스 웨이드"]
  },
  {
    text: "물리학은 존재하지 않는다.",
    character: "양둥",
    book: "1부 삼체",
    options: ["양둥", "딩이", "왕먀오", "예원제"]
  },
  {
    text: "생존을 위해서라면, 무엇을 포기할 수 있는가?",
    character: "토마스 웨이드",
    book: "3부 사신의 영생",
    options: ["토마스 웨이드", "정청신", "뤄지", "장베이하이"]
  },
  {
    text: "사랑은 우주에서 가장 강력한 힘이다.",
    character: "윈톈밍",
    book: "3부 사신의 영생",
    options: ["윈톈밍", "정청신", "관이판", "뤄지"]
  },
  {
    text: "답하지 마라. 답하지 마라. 답하지 마라!",
    character: "삼체 평화주의자",
    book: "1부 삼체",
    options: ["삼체 평화주의자", "예원제", "지자", "마이크 에반스"]
  }
]

export default function QuoteQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)

    if (answer === quotes[currentQuestion].character) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < quotes.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setQuizCompleted(true)
      }
    }, 1500)

    setShowResult(true)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizCompleted(false)
  }

  if (quizCompleted) {
    const percentage = Math.round((score / quotes.length) * 100)
    let message = ""

    if (percentage === 100) {
      message = "완벽합니다! 당신은 진정한 삼체 마스터!"
    } else if (percentage >= 80) {
      message = "훌륭해요! 삼체에 대한 이해가 깊으시네요!"
    } else if (percentage >= 60) {
      message = "잘했어요! 조금만 더 읽어보세요."
    } else if (percentage >= 40) {
      message = "괜찮아요. 다시 한번 도전해보세요!"
    } else {
      message = "삼체를 다시 읽어보시는 건 어떨까요?"
    }

    return (
      <div className={styles.quizContainer}>
        <div className={styles.resultCard}>
          <h2 className={styles.resultTitle}>퀴즈 완료!</h2>
          <div className={styles.scoreDisplay}>
            <div className={styles.scoreNumber}>{score}</div>
            <div className={styles.scoreTotal}>/ {quotes.length}</div>
          </div>
          <div className={styles.percentage}>{percentage}%</div>
          <p className={styles.resultMessage}>{message}</p>
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
        <div className={styles.scoreBox}>
          점수: {score}
        </div>
      </div>

      <div className={styles.quoteCard}>
        <div className={styles.quoteIcon}>"</div>
        <p className={styles.quoteText}>{quote.text}</p>
        <div className={styles.bookTag}>{quote.book}</div>
      </div>

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

      {showResult && (
        <div className={`${styles.feedback} ${
          selectedAnswer === quote.character ? styles.feedbackCorrect : styles.feedbackIncorrect
        }`}>
          {selectedAnswer === quote.character ? (
            <span>정답입니다! ✓</span>
          ) : (
            <span>아쉽습니다. 정답은 "{quote.character}"입니다.</span>
          )}
        </div>
      )}
    </div>
  )
}
