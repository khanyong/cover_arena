import type { ReactNode } from 'react'
import styles from './CorporateSlideFrame.module.css'

type CorporateSlideFrameProps = {
  title: string
  section: string
  subtitle: string
  note: ReactNode
  children: ReactNode
}

export default function CorporateSlideFrame({ title, section, subtitle, note, children }: CorporateSlideFrameProps) {
  return <article className={styles.frame} data-corporate-slide>
    <div className={styles.heading}>
      <p className={styles.section}>{section}</p>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
    <div className={styles.body} data-corporate-body>{children}</div>
    <div className={styles.note} data-corporate-note>{note}</div>
  </article>
}
