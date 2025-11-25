import React from 'react'
import ModernHero from '../components/sections/ModernHero'

function HomePage({ onNavigate }) {
  return (
    <div>
      <ModernHero onNavigate={onNavigate} />
    </div>
  )
}

export default HomePage

