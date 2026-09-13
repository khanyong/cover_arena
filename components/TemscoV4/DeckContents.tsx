import { v4Chapters, v4MainChapters } from '../../lib/temsco/v4-slide-catalog'

export default function DeckContents({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-white" data-deck-contents>
      <div className="w-[310px] flex-shrink-0 bg-slate-50 border-r border-slate-200 px-12 pt-14 pb-16 flex flex-col">
        <p className="text-[12px] tracking-[0.2em] font-bold text-blue-700">TEMSCO / INVESTOR RELATIONS</p>
        <div className="w-12 h-1 bg-blue-600 mt-16 mb-8" />
        <p className="text-[12px] tracking-[0.25em] text-slate-500 font-bold mb-4">CONTENTS</p>
        <h2 className="text-[42px] font-black leading-[1.35] tracking-tight text-slate-900">투자제안서<br />목차</h2>
        <p className="text-[14px] font-medium leading-7 text-slate-500 mt-7">회사 현황에서 투자 효과까지<br />본문 {v4MainChapters.length}개 장과 평가 근거 별첨</p>
        <div className="mt-auto border-t border-slate-300 pt-6">
          <p className="text-[28px] tabular-nums font-bold text-slate-900">{String(v4MainChapters.length).padStart(2, '0')} <span className="text-[12px] tracking-widest font-medium text-slate-500">CHAPTERS</span></p>
          <p className="text-[12px] tracking-[0.12em] font-bold text-blue-700 mt-1">+ APPENDIX · 별첨</p>
        </div>
      </div>

      <div className="flex-1 px-12 pt-14 pb-16 flex flex-col">
        <div className="flex justify-between text-[11px] tracking-[0.15em] text-slate-400 border-b border-slate-300 pb-4">
          <span>CHAPTERS / APPENDIX</span>
          <span>간지 / 본문 페이지</span>
        </div>
        <nav aria-label="투자제안서 목차" className="flex-1 flex flex-col justify-center">
          {v4Chapters.map(chapter => (
            <a
              key={chapter.id}
              href={`?slide=${chapter.divider.num}`}
              onClick={event => { event.preventDefault(); onNavigate(chapter.divider.id) }}
              data-chapter-link={chapter.id}
              className={`group flex items-start gap-5 py-2 border-b border-slate-200 last:border-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 print:no-underline ${chapter.id === 'appendix' ? 'border-t-2 border-t-blue-200' : ''}`}
            >
              <span className={`min-w-[44px] leading-8 text-blue-600 font-bold tabular-nums whitespace-nowrap ${chapter.id === 'appendix' ? 'text-[21px]' : 'text-[26px]'}`}>{chapter.id === 'appendix' ? '별첨' : chapter.num}</span>
              <div className="flex-1">
                <h3 className="text-[20px] leading-8 font-bold tracking-tight text-slate-900 group-hover:text-blue-700">{chapter.title}</h3>
                <p className="text-[12px] text-slate-500 mt-1 leading-5">{chapter.desc}</p>
              </div>
              <div className="text-right tabular-nums pt-1">
                <span className="text-[18px] font-bold text-slate-800">{chapter.divider.num}</span>
                <p className="text-[11px] text-slate-500 mt-2 whitespace-nowrap">{chapter.id === 'appendix' ? '별첨' : '본문'} {chapter.pageRange}</p>
              </div>
            </a>
          ))}
        </nav>
        <p className="text-[10px] tracking-[0.12em] text-slate-400 pt-4 border-t border-slate-300">TEMSCO, LTD. / CONFIDENTIAL</p>
      </div>
    </div>
  )
}
