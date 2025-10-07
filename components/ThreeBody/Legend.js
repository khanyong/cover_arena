import styles from './styles/CharacterNetwork.module.css'

export default function Legend({ groupColors, selectedGroup, onGroupClick }) {
  return (
    <div className={styles.legend}>
      <h3>그룹별 필터 (클릭하여 필터링)</h3>
      <div className={styles.legendGrid}>
        {Object.entries(groupColors).map(([group, color]) => (
          <div
            key={group}
            className={`${styles.legendItem} ${selectedGroup === group ? styles.selected : ''}`}
            onClick={() => onGroupClick(group)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.legendColor} style={{ backgroundColor: color }}></div>
            <span>{group}</span>
          </div>
        ))}
      </div>
      <div className={styles.resetButton} onClick={() => onGroupClick(null)}>
        전체 보기
      </div>
    </div>
  )
}
