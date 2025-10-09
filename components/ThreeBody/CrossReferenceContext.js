import { createContext, useContext, useState } from 'react'

const CrossReferenceContext = createContext()

export function useCrossReference() {
  const context = useContext(CrossReferenceContext)
  if (!context) {
    throw new Error('useCrossReference must be used within CrossReferenceProvider')
  }
  return context
}

export function CrossReferenceProvider({ children, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('')

  // Navigate to a specific tab and optionally search for an item
  const navigateTo = (tab, itemName = null) => {
    if (onNavigate) {
      onNavigate(tab, itemName)
    }
  }

  // Character name to profile mapping
  const navigateToCharacter = (characterName) => {
    navigateTo('profiles', characterName)
  }

  // Event name to timeline mapping
  const navigateToEvent = (eventName) => {
    navigateTo('timeline', eventName)
  }

  // Concept name to concepts page mapping
  const navigateToConcept = (conceptName) => {
    navigateTo('concepts', conceptName)
  }

  // Ship/tech name to ships page mapping
  const navigateToShip = (shipName) => {
    navigateTo('ships', shipName)
  }

  // Faction name to factions page mapping
  const navigateToFaction = (factionName) => {
    navigateTo('factions', factionName)
  }

  return (
    <CrossReferenceContext.Provider
      value={{
        navigateTo,
        navigateToCharacter,
        navigateToEvent,
        navigateToConcept,
        navigateToShip,
        navigateToFaction,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </CrossReferenceContext.Provider>
  )
}
