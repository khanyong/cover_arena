import { useCrossReference } from './CrossReferenceContext'
import styles from './styles/CrossReference.module.css'

export default function CrossReferenceLink({ type, name, children }) {
  const { navigateToCharacter, navigateToEvent, navigateToConcept, navigateToShip, navigateToFaction } = useCrossReference()

  const handleClick = (e) => {
    e.stopPropagation()

    switch (type) {
      case 'character':
        navigateToCharacter(name)
        break
      case 'event':
        navigateToEvent(name)
        break
      case 'concept':
        navigateToConcept(name)
        break
      case 'ship':
        navigateToShip(name)
        break
      case 'faction':
        navigateToFaction(name)
        break
      default:
        console.warn(`Unknown cross-reference type: ${type}`)
    }
  }

  const typeIcons = {
    character: '👤',
    event: '⏰',
    concept: '💡',
    ship: '🚀',
    faction: '⚔️',
  }

  return (
    <span
      className={`${styles.crossRefLink} ${styles[type]}`}
      onClick={handleClick}
      title={`${typeIcons[type]} ${name}로 이동`}
    >
      {children || name}
    </span>
  )
}
