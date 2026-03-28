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

  // Character name to network mapping
  const navigateToCharacter = (characterName) => {
    navigateTo('network', characterName)
  }

  // Event name to timeline mapping
  const navigateToEvent = (eventName) => {
    navigateTo('timeline', eventName)
  }

  // Species name mapping
  const navigateToSpecies = (speciesName) => {
    navigateTo('species', speciesName)
  }

  return (
    <CrossReferenceContext.Provider
      value={{
        navigateTo,
        navigateToCharacter,
        navigateToEvent,
        navigateToSpecies,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </CrossReferenceContext.Provider>
  )
}
