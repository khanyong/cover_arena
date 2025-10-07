import styles from './styles/CharacterNetwork.module.css'

export default function DetailPanel({ character, characterInfo, onClose }) {
  if (!character || !characterInfo) return null

  return (
    <div className={styles.detailPanel} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeButton} onClick={onClose}>✕</button>
      <h2 className={styles.detailTitle}>{character}</h2>
      <div className={styles.detailRole}>{characterInfo.role}</div>

      <div className={styles.detailSection}>
        <h3>인물 소개</h3>
        <p>{characterInfo.description}</p>
      </div>

      {characterInfo.actions && characterInfo.actions.length > 0 && (
        <div className={styles.detailSection}>
          <h3>주요 활동</h3>
          <ul className={styles.detailList}>
            {characterInfo.actions.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ul>
        </div>
      )}

      {characterInfo.relations && characterInfo.relations.length > 0 && (
        <div className={styles.detailSection}>
          <h3>인물 관계</h3>
          <ul className={styles.detailList}>
            {characterInfo.relations.map((relation, i) => (
              <li key={i}>{relation}</li>
            ))}
          </ul>
        </div>
      )}

      {characterInfo.fate && (
        <div className={styles.detailSection}>
          <h3>최후</h3>
          <p className={styles.detailFate}>{characterInfo.fate}</p>
        </div>
      )}
    </div>
  )
}
