import styles from './styles/CharacterNetwork.module.css'

export default function DetailPanel({ character, characterInfo, onClose }) {
  if (!character || !characterInfo) return null

  return (
    <div className={styles.detailPanel} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeButton} onClick={onClose}>✕</button>
      <h2 className={styles.detailTitle}>{character}</h2>
      <div className={styles.detailRole}>{characterInfo.role}</div>

      <div className={styles.detailSection}>
        <h3>{characterInfo.ideology ? '파벌 설명' : '인물 소개'}</h3>
        <p>{characterInfo.description}</p>
      </div>

      {characterInfo.ideology && (
        <div className={styles.detailSection}>
          <h3>사상 및 이념</h3>
          <p className={styles.detailIdeology}>{characterInfo.ideology}</p>
        </div>
      )}

      {characterInfo.beliefs && characterInfo.beliefs.length > 0 && (
        <div className={styles.detailSection}>
          <h3>핵심 신념</h3>
          <ul className={styles.detailList}>
            {characterInfo.beliefs.map((belief, i) => (
              <li key={i}>{belief}</li>
            ))}
          </ul>
        </div>
      )}

      {characterInfo.keyMembers && characterInfo.keyMembers.length > 0 && (
        <div className={styles.detailSection}>
          <h3>주요 인물</h3>
          <ul className={styles.detailList}>
            {characterInfo.keyMembers.map((member, i) => (
              <li key={i}>{member}</li>
            ))}
          </ul>
        </div>
      )}

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
          <h3>{characterInfo.ideology ? '관련 조직' : '인물 관계'}</h3>
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

      {characterInfo.faction && (
        <div className={styles.detailSection}>
          <h3>소속 파벌</h3>
          <p className={styles.detailFaction}>{characterInfo.faction}</p>
        </div>
      )}
    </div>
  )
}
