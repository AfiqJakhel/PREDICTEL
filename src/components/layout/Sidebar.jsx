import React, { useState } from "react";
import {
  FiHome,
  FiUpload,
  FiCpu,
  FiFileText,
  FiBarChart2,
  FiInfo,
  FiMenu,
  FiX,
  FiDatabase,
  FiChevronRight,
  FiSettings,
} from "react-icons/fi";

function Sidebar({ currentPage, onNavigate, onCollapsedChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onCollapsedChange) {
      onCollapsedChange(false);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onCollapsedChange) {
      onCollapsedChange(true);
    }
  };

  const menuItems = [
    { id: "home", icon: FiHome, label: "Home" },
    { id: "input", icon: FiUpload, label: "Input Data" },
    { id: "processing", icon: FiCpu, label: "Processing Data" },
    { id: "test", icon: FiFileText, label: "Test Data" },
    { id: "visualization", icon: FiBarChart2, label: "Data Visualization" },
    { id: "about", icon: FiInfo, label: "About Us" },
  ];

  const handleMenuClick = (menuId) => {
    if (onNavigate) {
      onNavigate(menuId);
    }
    // Close mobile menu after navigation
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-110"
      >
        {isMobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`modern-sidebar ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isHovered ? "lg:w-72" : "lg:w-20"}`}
      >
        {/* Brand Logo */}
        <div
          className={`p-6 border-b border-white/10 backdrop-blur-sm transition-all duration-300 ${
            isHovered ? "" : "lg:flex lg:justify-center"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative group flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <FiDatabase className="text-white text-xl" />
              </div>
            </div>
            <div
              className={`flex-1 overflow-hidden transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-x-0 max-w-full"
                  : "lg:opacity-0 lg:-translate-x-4 lg:max-w-0"
              }`}
            >
              <h1 className="text-lg font-bold leading-tight whitespace-nowrap">
                PREDICTEL
              </h1>
              <p className="text-xs text-cyan-300 whitespace-nowrap">
                Data Analytics
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="py-6 px-3 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <li key={item.id} className="relative group">
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`modern-menu-item ${isActive ? "active" : ""} ${
                      isHovered ? "" : "lg:justify-center"
                    }`}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full"></div>
                    )}

                    {/* Icon Container */}
                    <div
                      className={`relative ${isActive ? "icon-active" : ""}`}
                    >
                      <Icon
                        className={`text-xl z-10 relative transition-all duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-cyan-300 group-hover:text-white"
                        }`}
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg blur-sm opacity-50"></div>
                      )}
                    </div>

                    {/* Label with transition */}
                    <span
                      className={`menu-label ${
                        isHovered
                          ? "opacity-100 translate-x-0 w-auto"
                          : "lg:opacity-0 lg:-translate-x-2 lg:w-0"
                      } ${
                        isActive ? "text-white font-semibold" : "text-gray-200"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Hover Arrow */}
                    {!isActive && isHovered && (
                      <FiChevronRight className="ml-auto text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Info */}
        <div
          className={`p-4 border-t border-white/10 transition-all duration-300 ${
            isHovered ? "" : "lg:flex lg:justify-center"
          }`}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-all duration-300 overflow-hidden">
            {/* Expanded State */}
            <div
              className={`transition-all duration-300 ${
                isHovered ? "opacity-100 p-3" : "lg:opacity-0 lg:h-0 lg:p-0"
              }`}
            >
              <p className="text-xs text-cyan-200 mb-1 whitespace-nowrap">
                Version 1.0
              </p>
              <p className="text-xs text-gray-300 whitespace-nowrap">
                © 2025 Predictel
              </p>
            </div>

            {/* Collapsed State */}
            <div
              className={`lg:flex justify-center items-center transition-all duration-300 ${
                isHovered ? "lg:hidden" : "lg:flex p-3"
              }`}
            >
              <div className="relative">
                <FiSettings className="text-cyan-300 text-lg animate-spin-slow" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse border border-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 animate-fadeIn"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
