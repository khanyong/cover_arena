import { v4Chapters, v4MainChapters, type V4Chapter } from '../../lib/temsco/v4-slide-catalog'

const valuationGroups = [
  { title: '기업가치 평가 체계', ids: ['valuation'] },
  { title: '별도·연결 FCFF · 무성장 잔여가치', ids: ['valuation-parent-fcff', 'valuation-consolidated-fcff', 'valuation-terminal'] },
  { title: '비교기업 · 배수 · 시나리오 · 민감도', ids: ['valuation-peers', 'valuation-methods', 'valuation-scenarios', 'valuation-sensitivity'] },
  { title: '지분가치 · 75% 보유 · 투자 효과', ids: ['valuation-equity', 'valuation-investment'] },
]

export default function ChapterDivider({ chapter, onNavigate }: {
  chapter: V4Chapter
  onNavigate: (id: string) => void
}) {
  const appendix = chapter.id === 'appendix'
  const sections = chapter.id === 'valuation' ? valuationGroups.map(group => {
    const slides = group.ids.map(id => {
      const slide = chapter.slides.find(item => item.id === id)
      if (!slide) throw new Error(`Missing TEMSCO V4 valuation section: ${id}`)
      return slide
    })
    const first = slides[0], last = slides[slides.length - 1]
    return { ...first, title: group.title, pages: first.num === last.num ? first.num : `${first.num}–${last.num}` }
  }) : chapter.slides.map(slide => ({ ...slide, pages: slide.num }))
  return (
    <div className="h-full bg-slate-900 text-white relative px-16 pt-14 pb-16 flex flex-col" data-chapter-divider={chapter.id}>
      <div className="flex justify-between items-center border-b border-slate-700 pb-5">
        <p className="text-[13px] tracking-[0.2em] font-bold text-blue-300">TEMSCO INVESTMENT PROPOSAL</p>
        <p className="text-[11px] tracking-[0.16em] text-slate-400">4TH EDITION / CONFIDENTIAL</p>
      </div>

      <div className="flex flex-1 gap-14 pt-12">
        <div className="flex-1 flex flex-col">
          <p className="text-[12px] tracking-[0.22em] font-bold text-blue-300">{appendix ? `별첨 / ${chapter.english}` : chapter.english}</p>
          <div className="w-14 h-1 bg-blue-500 mt-8 mb-7" />
          <h2 className="max-w-[600px] text-[46px] font-black leading-[1.35] tracking-tight break-keep">{chapter.title}</h2>
          <p className="text-[15px] leading-7 text-slate-400 mt-5">{chapter.desc}</p>

          <div className="mt-auto mb-7">
            <p className="text-[10px] tracking-[0.2em] text-blue-300 font-bold mb-4">{appendix ? 'IN THIS APPENDIX · 별첨 구성' : 'IN THIS CHAPTER'}</p>
            <nav aria-label={`${chapter.title} 세부 목차`}>
              {sections.map((slide, index) => (
                <a
                  key={slide.id}
                  href={`?slide=${slide.num}`}
                  onClick={event => { event.preventDefault(); onNavigate(slide.id) }}
                  className="flex gap-4 items-center border-t border-slate-700 py-3.5 text-[14px] leading-6 hover:text-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 print:no-underline"
                  data-section-content-link={slide.id}
                >
                  <span className="text-slate-500 tabular-nums text-[11px] whitespace-nowrap">{appendix ? `별첨 ${index + 1}` : `${chapter.num}.${index + 1}`}</span>
                  <span className="flex-1">{slide.title}</span>
                  <span className="text-blue-300 tabular-nums font-bold">{slide.pages}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="w-[245px] flex-shrink-0 border-l border-slate-700 pl-8 flex flex-col">
          <p aria-hidden="true" className="text-[160px] leading-none font-black tracking-[-0.08em] text-blue-500 tabular-nums -mt-1">{chapter.num}</p>
          <p className="text-[11px] tracking-[0.22em] text-slate-500 mt-3">{appendix ? 'APPENDIX · 별첨' : `CHAPTER ${chapter.num} / ${String(v4MainChapters.length).padStart(2, '0')}`}</p>
          <div className="mt-auto mb-7 space-y-3" aria-label="본문 장 및 별첨 구성">
            {v4Chapters.map(item => (
              <div key={item.id} className={`flex items-center gap-3 text-[12px] leading-5 ${item.id === chapter.id ? 'text-white font-bold' : 'text-slate-500'}`}>
                <span className={`w-1 h-4 ${item.id === chapter.id ? 'bg-blue-500' : 'bg-transparent'}`} />
                <span className="tabular-nums whitespace-nowrap">{item.id === 'appendix' ? '별첨' : item.num}</span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-5 flex items-center justify-between text-[11px] text-slate-400 pr-8">
        <span>주식회사 템스코 / TEMSCO, LTD.</span>
        <span>{appendix ? '별첨' : '본문'} {chapter.pageRange} 페이지</span>
      </div>
    </div>
  )
}
