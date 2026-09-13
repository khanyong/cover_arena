import { preNdaSlides } from '../../lib/temsco/pre-nda-content'
import styles from './PreNdaSlide.module.css'

type Slide = (typeof preNdaSlides)[number]

function TechnicalMotif() {
  return <svg viewBox="0 0 410 370" className={styles.motif} aria-hidden="true" fill="none">
    <path d="M20 288 192 368 402 250M8 191 192 282 402 171M8 99 192 186 402 79" stroke="currentColor" opacity=".2" />
    {[0, 1, 2].map(i => <g key={i} transform={`translate(0 ${i * 63})`}>
      <path d="m35 80 163-65 178 75-166 77Z" fill={i === 1 ? '#2563eb' : '#fff'} fillOpacity={i === 1 ? '.18' : '.03'} stroke="currentColor" strokeWidth="1.4" />
      <path d="m88 80 111-41 123 50-113 53Z" stroke="currentColor" strokeWidth="1.2" opacity=".65" />
      <path d="m120 68 122 61M163 51l123 58M127 119l110-41M167 137l114-43" stroke="currentColor" opacity=".2" />
    </g>)}
    <path d="M35 80v125m163-190v125M376 90v125M210 167v125" stroke="currentColor" strokeDasharray="4 5" opacity=".4" />
    <circle cx="35" cy="205" r="4" fill="#60a5fa" /><circle cx="376" cy="215" r="4" fill="#60a5fa" />
  </svg>
}

function BulletList({ bullets }: { bullets: string[] }) {
  return <ul>{bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
}

export default function PreNdaSlide({ slide, page, total }: { slide: Slide; page: number; total: number }) {
  const dark = slide.kind === 'cover' || slide.kind === 'closing'
  return <article className={`pre-nda-slide ${styles.slide} ${dark ? styles.dark : ''}`} data-slide-id={slide.id} data-page={page}>
    <div className={styles.topline}><span>TEMSCO <b>INVESTOR RELATIONS</b></span><span>NDA 이전 투자 검토용</span></div>
    <div className={styles.watermark} aria-hidden="true">PRE-NDA</div>
    <div className={styles.content}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>{slide.section}</p>
        <h1>{slide.title}</h1>
        <p className={styles.subtitle}>{slide.subtitle}</p>
      </div>
      {(slide.kind === 'cover' || slide.kind === 'closing') ? <>
        <TechnicalMotif />
        <div className={styles.coverItems}>{slide.items.map((item, i) => <div key={item.label}>
          <span className={styles.ordinal}>{String(i + 1).padStart(2, '0')}</span>
          <div><p className={styles.label}>{item.label}</p><h2>{item.heading}</h2><BulletList bullets={item.bullets} /></div>
        </div>)}</div>
      </> : slide.kind === 'flow' ? <div className={styles.flow}>
        <div className={styles.flowLine} aria-hidden="true">→<span>→</span></div>
        {slide.items.map((item, i) => <section key={item.label}>
          <div className={styles.entity}><span>{String(i + 1).padStart(2, '0')}</span><p>{item.label}</p><h2>{item.heading}</h2></div>
          <BulletList bullets={item.bullets} />
        </section>)}
      </div> : slide.kind === 'roadmap' ? <div className={styles.roadmap}>
        {slide.items.map((item, i) => <section key={item.label}>
          <span className={styles.milestone}>{String(i + 1).padStart(2, '0')}</span><p className={styles.label}>{item.label}</p>
          <h2>{item.heading}</h2><BulletList bullets={item.bullets} />
        </section>)}
      </div> : (slide.kind === 'comparison' || slide.kind === 'risks') ? <div className={`${styles.rows} ${slide.kind === 'risks' ? styles.risks : ''}`}>
        <div className={styles.rowHeader}><span>검토 영역</span><span>주요 내용</span><span>검토 관점</span></div>
        {slide.items.map((item, i) => <section key={item.label}><p className={styles.rowLabel}><span>{String(i + 1).padStart(2, '0')}</span>{item.label}</p><h2>{item.heading}</h2><BulletList bullets={item.bullets} /></section>)}
      </div> : slide.kind === 'framework' ? <div className={styles.framework}>
        <div className={styles.spine} aria-hidden="true" />
        {slide.items.map((item, i) => <section key={item.label}>
          <span className={styles.step}>{String(i + 1).padStart(2, '0')}</span><div><p className={styles.label}>{item.label}</p><h2>{item.heading}</h2></div><BulletList bullets={item.bullets} />
        </section>)}
      </div> : <div className={styles.overview}>
        {slide.items.map((item, i) => <section key={item.label}>
          <div className={styles.overviewNumber}>{String(i + 1).padStart(2, '0')}</div><p className={styles.label}>{item.label}</p><h2>{item.heading}</h2><BulletList bullets={item.bullets} />
        </section>)}
      </div>}
    </div>
    <div className={styles.footer}><span>PRE-NDA INVESTOR COPY · 사전 동의 없는 재배포 제한</span><span>TEMSCO · {String(page).padStart(2, '0')} / {String(total).padStart(2, '0')}</span></div>
  </article>
}
