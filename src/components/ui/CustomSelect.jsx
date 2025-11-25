import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown, FiCheck } from "react-icons/fi";

function CustomSelect({ value, onChange, options, placeholder = "Pilih...", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Scroll selected option into view
      if (dropdownRef.current) {
        const selectedOption = dropdownRef.current.querySelector(
          `[data-value="${value}"]`
        );
        if (selectedOption) {
          selectedOption.scrollIntoView({ block: "nearest" });
        }
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, value]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  const selectedOption = options.find((opt) => opt.value === value);

  // Calculate dropdown position - Always open downward
  const updateDropdownPosition = useCallback(() => {
    if (isOpen && selectRef.current && dropdownRef.current) {
      const selectRect = selectRef.current.getBoundingClientRect();
      
      // Position dropdown absolutely relative to viewport
      dropdownRef.current.style.position = "fixed";
      dropdownRef.current.style.top = `${selectRect.bottom + 4}px`;
      dropdownRef.current.style.left = `${selectRect.left}px`;
      dropdownRef.current.style.width = `${selectRect.width}px`;
      dropdownRef.current.style.bottom = "auto";
      
      // If dropdown would go off screen, adjust max-height instead
      const spaceBelow = window.innerHeight - selectRect.bottom;
      const maxHeight = Math.min(256, spaceBelow - 20); // 256px default, or available space - 20px padding
      
      if (maxHeight > 100) {
        dropdownRef.current.style.maxHeight = `${maxHeight}px`;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      
      // Update position on scroll and resize
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);
      
      return () => {
        window.removeEventListener("scroll", updateDropdownPosition, true);
        window.removeEventListener("resize", updateDropdownPosition);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  return (
    <div className={`relative ${className}`}>
      {/* Select Button */}
      <button
        ref={selectRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full px-4 py-3.5 pr-12 bg-white border-2 border-cyan-300 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-500 transition-all hover:border-cyan-400 hover:shadow-lg shadow-md font-medium text-gray-700 text-left flex items-center justify-between ${
          isOpen ? "border-cyan-500 shadow-lg" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={value ? "text-gray-700" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`text-cyan-600 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu - Rendered via Portal to avoid z-index issues */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed border-2 border-cyan-400/50 rounded-xl shadow-2xl z-[9999] max-h-64 overflow-y-auto custom-scrollbar dark-scrollbar backdrop-blur-sm"
            role="listbox"
            style={{
              background:
                "linear-gradient(135deg, #0f1b3d 0%, #1e3a5f 25%, #1e40af 50%, #1e3a5f 75%, #0f1b3d 100%)",
              boxShadow:
                "0 0 0 1px rgba(6, 182, 212, 0.2), 0 10px 40px rgba(6, 182, 212, 0.3), 0 4px 12px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            {options.map((option, index) => {
              const isSelected = value === option.value;
              const isHighlighted = highlightedIndex === index;

              return (
                <div
                  key={option.value}
                  data-value={option.value}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-3 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : isHighlighted
                      ? "bg-cyan-500/20 text-cyan-200 border-l-2 border-cyan-400"
                      : "text-gray-200 hover:bg-blue-600/30 hover:text-white"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="font-medium">{option.label}</span>
                  {isSelected && (
                    <FiCheck className="text-white text-lg flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}

export default CustomSelect;

