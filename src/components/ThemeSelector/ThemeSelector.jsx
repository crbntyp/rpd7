import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext';
import './ThemeSelector.css';

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SoftMoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    <circle cx="12" cy="12" r="3" strokeDasharray="2 2" opacity="0.5"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

const R7Icon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" stroke="none">R7</text>
  </svg>
);

const CrowdStrikeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"/>
    <path d="M12 8v4l3 2" strokeLinecap="round"/>
  </svg>
);

const BruinsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9"/>
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" stroke="none">B</text>
  </svg>
);

const XmasIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l3 6h-6l3-6z"/>
    <path d="M12 8l4 7H8l4-7z"/>
    <path d="M12 15l5 7H7l5-7z"/>
    <rect x="10" y="22" width="4" height="2" fill="currentColor" stroke="none"/>
  </svg>
);

const HalloweenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="13" r="8"/>
    <path d="M8 11v2"/>
    <path d="M16 11v2"/>
    <path d="M9 16c1 1 2 1.5 3 1.5s2-.5 3-1.5"/>
    <path d="M12 5V2"/>
    <path d="M10 3h4"/>
  </svg>
);

const PeachIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="14" r="7"/>
    <path d="M12 7V4"/>
    <path d="M14 5c2-1 3 0 3 2"/>
  </svg>
);

const AutumnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3c-4 4-6 8-6 12 0 3 2.5 5 6 5s6-2 6-5c0-4-2-8-6-12z"/>
    <path d="M12 22v-9"/>
    <path d="M9 16l3-3 3 3"/>
  </svg>
);

const TwilightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="9" cy="12" r="5"/>
    <circle cx="15" cy="12" r="5"/>
    <path d="M12 7c0-2-1-4-3-4"/>
  </svg>
);

const TropicalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22V8"/>
    <path d="M12 8c-4-4-8-2-8 2"/>
    <path d="M12 8c4-4 8-2 8 2"/>
    <path d="M12 12c-3-2-6 0-6 3"/>
    <path d="M12 12c3-2 6 0 6 3"/>
  </svg>
);

const SageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22c0-4 3-8 7-10-4-2-7-6-7-10 0 4-3 8-7 10 4 2 7 6 7 10z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const themes = [
  { id: 'dark', label: 'Dark', icon: MoonIcon },
  { id: 'soft', label: 'Soft', icon: SoftMoonIcon },
  { id: 'github', label: 'GitHub', icon: GithubIcon },
  { id: 'crowdstrike', label: 'CrowdStrike', icon: CrowdStrikeIcon },
  { id: 'bruins', label: 'Bruins', icon: BruinsIcon },
  { id: 'xmas', label: 'Christmas', icon: XmasIcon },
  { id: 'halloween', label: 'Halloween', icon: HalloweenIcon },
  { id: 'peach', label: 'Peach', icon: PeachIcon },
  { id: 'autumn', label: 'Autumn', icon: AutumnIcon },
  { id: 'twilight', label: 'Twilight', icon: TwilightIcon },
  { id: 'tropical', label: 'Tropical', icon: TropicalIcon },
  { id: 'sage', label: 'Sage', icon: SageIcon },
  { id: 'light', label: 'Light', icon: SunIcon },
  { id: 'r7', label: 'R7', icon: R7Icon },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const currentTheme = themes.find(t => t.id === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both trigger and dropdown
      const isOutsideTrigger = triggerRef.current && !triggerRef.current.contains(event.target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
      if (isOutsideTrigger && isOutsideDropdown) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (themeId) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="theme-selector">
      <button
        ref={triggerRef}
        className={`theme-selector-trigger ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
        title="Select theme"
      >
        <CurrentIcon />
        <span className="theme-selector-label">{currentTheme.label}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="theme-selector-dropdown"
          style={{ top: dropdownPosition.top, right: dropdownPosition.right }}
        >
          {themes.map((t) => {
            const Icon = t.icon;
            const isActive = t.id === theme;
            return (
              <button
                key={t.id}
                className={`theme-option ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(t.id)}
              >
                <Icon />
                <span>{t.label}</span>
                {isActive && <CheckIcon />}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}
