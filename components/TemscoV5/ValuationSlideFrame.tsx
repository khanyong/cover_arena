import type { ReactNode } from 'react'
import corporate from './CorporateSlideFrame.module.css'
import styles from './AccountingValuationSlides.module.css'

type Props = {
  title: string
  section?: string
  subtitle?: string
  unit?: string
  bodyClassName?: string
  children: ReactNode
  notes: ReactNode
}

/** V5's shared visual language around the accounting table structure. */
export default function ValuationSlideFrame({ title, section = '06 / VALUATION & INVESTMENT', subtitle, unit, bodyClassName = '', children, notes }: Props) {
  return <div className={`${corporate.frame} ${styles.frame}`} data-valuation-panel data-accounting-valuation>
    <div className={corporate.heading} data-valuation-heading>
      <div className={styles.eyebrowRow}>
        <p className={corporate.section}>{section}</p>
        {unit && <span className={styles.headerUnit}>{unit}</span>}
      </div>
      <h2 className={corporate.title}>{title}</h2>
      <p className={corporate.subtitle}>{subtitle}</p>
    </div>
    <div className={`${corporate.body} ${bodyClassName}`} data-valuation-body>{children}</div>
    {notes && <div className={`${corporate.note} ${styles.notes}`} data-valuation-notes>{notes}</div>}
  </div>
}
