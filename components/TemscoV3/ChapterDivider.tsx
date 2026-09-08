import { chapters } from './outline'
import s from './deck.module.css'

type Props = {
  chapter: typeof chapters[number]
  scale: number
  hidden: boolean
}

export function ChapterDivider({ chapter, scale, hidden }: Props) {
  const page = chapter.start + 1
  return <div id={`slide-${page}`} className={`${s.frame} ${hidden ? s.hidden : ''}`} style={{ width: 1123 * scale, height: 794 * scale }}>
    <section className={`${s.slide} ${s.divider} temsco-slide`} style={{ transform: `scale(${scale})` }} data-chapter-divider={chapter.numeral} aria-labelledby={`chapter-${chapter.numeral}`}>
      <div className={s.slideHead}><strong>TEMSCO</strong><span>INVESTMENT PROPOSAL</span><span>제3안 · 검토용 초안</span></div>
      <div className={s.dividerBody}>
        <div>
        <p className={s.dividerNumber}>SECTION {chapter.numeral}</p>
        <h2 id={`chapter-${chapter.numeral}`} className={s.dividerTitle}>{chapter.lines.map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h2>
        <div className={s.dividerRule} />
        <p className={s.dividerRange}>{String(page + 1).padStart(2, '0')}{page !== chapter.end && <> — {String(chapter.end + 1).padStart(2, '0')}</>}</p>
        </div>
        <div className={s.dividerAgenda}><p>CHAPTER OUTLINE</p><ul className={s.dividerTopics}>{chapter.topics.map((topic, index) => <li key={topic}><span>{String(index + 1).padStart(2, '0')}</span>{topic}</li>)}</ul></div>
      </div>
      <footer className={s.foot}><span>템스코 · 위폼스 / 분석 기준일 2026.09.08</span><b>{String(page).padStart(2, '0')}</b></footer>
    </section>
  </div>
}
