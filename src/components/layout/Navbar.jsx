import React, { useState, useEffect } from 'react'
import { FiDatabase, FiMenu, FiX } from 'react-icons/fi'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-lg' 
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-2 animate-slideInLeft">
            <FiDatabase className="text-primary text-2xl" />
            <span className="text-xl font-bold text-gray-900">
              CSV Processor
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 animate-slideInRight">
            <a 
              href="#" 
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </a>
            <a 
              href="#features" 
              className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a 
              href="#upload" 
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Upload CSV
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a 
              href="#" 
              className="block text-gray-700 hover:text-primary hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#features" 
              className="block text-gray-500 hover:text-primary hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#upload" 
              className="block bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-md text-base font-bold text-center transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Upload CSV
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
