import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useAccount } from '../../context/AccountContext';
import { useTour } from '../../context/TourContext';
import { navSections as defaultNavSections } from '../../data/navigation';
import './Sidebar.css';

const NAV_SECTIONS_ORDER_KEY = 'crbntyp-nav-sections-order';

// Helper to reorder nav sections based on saved order
const getOrderedNavSections = () => {
  const savedOrder = localStorage.getItem(NAV_SECTIONS_ORDER_KEY);
  if (savedOrder) {
    try {
      const order = JSON.parse(savedOrder);
      const ordered = [];
      order.forEach(title => {
        const section = defaultNavSections.find(s => s.title === title);
        if (section) ordered.push(section);
      });
      // Add any new sections not in saved order
      defaultNavSections.forEach(section => {
        if (!ordered.find(s => s.title === section.title)) {
          ordered.push(section);
        }
      });
      return ordered;
    } catch (e) {
      return [...defaultNavSections];
    }
  }
  return [...defaultNavSections];
};

// Icon components
const Icons = {
  home: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  grid: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  wrench: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  alert: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  file: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="15" x2="15" y2="15"/>
    </svg>
  ),
  monitor: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  globe: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  shield: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  database: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
  cog: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  agent: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <circle cx="12" cy="11" r="3"/>
      <path d="M8 17v-1a4 4 0 0 1 8 0v1"/>
    </svg>
  ),
  server: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/>
      <line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  ),
  settings: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  docs: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  external: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  chevronDown: () => (
    <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  chevronRight: () => (
    <svg className="nav-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  user: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  device: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  dragHandle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="5" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="5" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="9" cy="12" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="9" cy="19" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="19" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
};

// Rapid7 Logo
const Rapid7Logo = ({ color = 'currentColor', mini = false }) => {
  if (mini) {
    // Just the orange "7" part
    return (
      <svg className="logo-svg mini" width="28" height="28" viewBox="0 0 60 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#E95F26" d="M38.98 0H2.72c.55.56 1.1 1.14 1.6 1.75 4.06 4.92 6.2 11.1 6.2 17.9 0 10.5-4.42 19.97-11.52 26.35h22.2l10.55-26.22h-13.2l2.2-10.17h26.22L33.2 46h5.4c12.57.08 21.07-10.36 21.07-23.04S51.57 0 38.97 0"/>
      </svg>
    );
  }

  return (
    <svg className="logo-svg" width="100" height="17" viewBox="0 0 272 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill={color} d="M28.25 20.57H17.08L19.5 9.62h10.33c3.4 0 5.4 1.83 5.4 4.5 0 3.52-2.58 6.45-6.98 6.45m18.43-7.53C46.68 5.52 40.88 0 30.74 0H10.1L0 46h11.5l3.48-15.8h6.73L28.4 46h11.47l-7.13-16.56c8.55-1.34 13.94-8.2 13.94-16.4"/>
      <path fill={color} d="M66.52 28.78l9.86-16.96 3.73 16.96H66.53zM71.72 0L45 46h11.47l4.47-7.63h21.28L83.9 46h11.47L85.3 0H71.72zM128.3 20.57h-10.2l2.4-10.95h8.88c3.5 0 5.65 1.67 5.65 4.5 0 3.52-2.65 6.45-6.72 6.45M130.55 0H111.1L101 46h11.48l3.5-15.82h12.82c10.96 0 17.6-8.26 17.6-16.97 0-7.76-6.05-13.2-15.86-13.2"/>
      <path fill={color} d="M168.62 0h-11.5L147 46h11.5z"/>
      <path fill="#E95F26" d="M250.98 0h-36.26c.55.56 1.1 1.14 1.6 1.75 4.06 4.92 6.2 11.1 6.2 17.9 0 10.5-4.42 19.97-11.52 26.35h22.2l10.55-26.22h-13.2l2.2-10.17h26.22L245.2 46h5.4c12.57.08 21.07-10.36 21.07-23.04S263.57 0 250.97 0"/>
      <path fill={color} d="M186.96 36.4h-6.35l5.9-26.78h6c6.58 0 10.27 4.93 10.27 11.1 0 8.3-5.92 15.68-15.8 15.68M210 7.5C206.06 2.7 199.55 0 191.87 0h-14.74L167 46h18.55c7.2 0 12.74-1.6 16.97-4.15 8.6-5.22 11.65-14.4 11.65-22.2 0-4.86-1.52-8.98-4.16-12.15"/>
    </svg>
  );
};

// Back arrow icon
const BackArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

// NavItem Component - now triggers slide instead of dropdown
function NavItem({ item, onSelect, isSelected, onMouseEnter, onMouseLeave, dataTour }) {
  const location = useLocation();
  const Icon = Icons[item.icon];

  // Check if any sub-item matches the current URL
  const hasActiveChild = item.subItems?.some(sub => {
    if (sub.type === 'section') {
      return sub.items?.some(sectionItem => location.pathname === sectionItem.path);
    }
    return location.pathname === sub.path;
  });

  const isActive = isSelected || hasActiveChild;

  return (
    <li className={`nav-item-parent ${isActive ? 'has-active-child' : ''}`}>
      <button
        className={`nav-item nav-item-toggle ${isActive ? 'active' : ''}`}
        onClick={() => onSelect(item)}
        onMouseEnter={(e) => onMouseEnter?.(e, item.label)}
        onMouseLeave={onMouseLeave}
        data-tooltip={item.label}
        data-tour={dataTour}
      >
        {Icon && <Icon />}
        <span>{item.label}</span>
        <Icons.chevronRight />
      </button>
    </li>
  );
}

// SubNav Panel Component
function SubNavPanel({ item, onBack, isVisible, isAnimating }) {
  const location = useLocation();
  const Icon = Icons[item?.icon];
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (label) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  // Find which section contains the active path
  const findActiveSectionLabel = () => {
    if (!item?.subItems) return null;
    for (const sub of item.subItems) {
      if (sub.type === 'section') {
        for (const sectionItem of sub.items || []) {
          if (sectionItem.path === location.pathname) {
            return sub.label;
          }
        }
      }
    }
    return null;
  };

  // Reset open sections when item changes - open all sections by default
  useEffect(() => {
    if (item) {
      const initialOpen = {};
      item.subItems?.forEach(sub => {
        if (sub.type === 'section') {
          // Open all sections by default
          initialOpen[sub.label] = true;
        }
      });
      setOpenSections(initialOpen);
    }
  }, [item?.id]);

  return (
    <div className={`sub-nav-panel ${isVisible ? 'visible' : ''} ${isAnimating ? 'animating' : ''}`} data-tour="sub-nav-panel">
      <div className="sub-nav-header">
        {item && Icon && <Icon />}
        <span className="sub-nav-title">{item?.label}</span>
        <button className="sub-nav-back" onClick={onBack} aria-label="Back to main navigation">
          <BackArrow />
        </button>
      </div>
      <div className="sub-nav-list">
        {item?.subItems?.map((sub, idx) => {
          // Collapsible section
          if (sub.type === 'section') {
            const isOpen = openSections[sub.label];
            return (
              <div key={idx} className={`sub-nav-section ${isOpen ? 'open' : ''}`}>
                <button
                  className="sub-nav-section-toggle"
                  onClick={() => toggleSection(sub.label)}
                  aria-expanded={isOpen}
                >
                  <span>{sub.label}</span>
                  <Icons.chevronDown />
                </button>
                <div className="sub-nav-section-items">
                  <div className="sub-nav-section-items-inner">
                    {sub.items?.map((sectionItem, sIdx) => (
                      <NavLink
                        key={sIdx}
                        to={sectionItem.path}
                        end
                        className={({ isActive }) => `sub-nav-item ${isActive ? 'active' : ''}`}
                      >
                        {sectionItem.label}
                        {sectionItem.badge && (
                          <span className={`nav-badge nav-badge-${sectionItem.badge.type}`}>
                            {sectionItem.badge.count}
                          </span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          // Regular item
          return (
            <NavLink
              key={idx}
              to={sub.path}
              end
              className={({ isActive }) => `sub-nav-item ${isActive ? 'active' : ''}`}
            >
              {sub.label}
              {sub.badge && (
                <span className={`nav-badge nav-badge-${sub.badge.type}`}>
                  {sub.badge.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to find nav item containing a path
function findNavItemByPath(path) {
  for (const section of defaultNavSections) {
    for (const item of section.items) {
      // Check direct subItems
      for (const sub of item.subItems || []) {
        if (sub.type === 'section') {
          // Check items within sections
          for (const sectionItem of sub.items || []) {
            if (sectionItem.path === path) {
              return { item, section: sub.label };
            }
          }
        } else if (sub.path === path) {
          return { item, section: null };
        }
      }
    }
  }
  return null;
}

// Minimize/Expand icons
const MinimizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11 19l-7-7 7-7"/>
    <path d="M18 19l-7-7 7-7"/>
  </svg>
);

const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 5l7 7-7 7"/>
    <path d="M6 5l7 7-7 7"/>
  </svg>
);

// Detach icon
const DetachIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2"/>
    <path d="M15 3v6h6"/>
    <path d="M14 10l7-7"/>
  </svg>
);

// Main Sidebar Component
export default function Sidebar() {
  const location = useLocation();
  const { isOpen: isMobileOpen, openSidebar, closeSidebar } = useSidebar();
  const { activeAccountIndex, setActiveAccount, currentAccount, personalAccount, mdrAccounts } = useAccount();
  const { registerTourActions } = useTour();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navSections, setNavSections] = useState(getOrderedNavSections);
  const [draggedSection, setDraggedSection] = useState(null);
  const [dragOverSection, setDragOverSection] = useState(null);
  const [activeSubNav, setActiveSubNav] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mainNavVisible, setMainNavVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [savedSubNav, setSavedSubNav] = useState(null);
  const [isDetached, setIsDetached] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 20, y: 100 });
  const [showDropZone, setShowDropZone] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, text: '', top: 0 });
  const [dropdownPosition, setDropdownPosition] = useState({ bottom: 0, left: 0 });
  const dropdownRef = useRef(null);
  const profileBtnRef = useRef(null);
  const sidebarRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const ANIMATION_DURATION = 300; // ms
  const DROP_ZONE_THRESHOLD = 100; // pixels from left edge to show drop zone

  // Tooltip handlers for minimized sidebar
  const showTooltip = (e, text) => {
    if (!isMinimized || isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      text,
      top: rect.top + rect.height / 2,
      left: rect.right + 12, // Position to the right of the element
    });
  };

  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  // Handle dropdown toggle with position calculation for minimized state
  const handleDropdownToggle = () => {
    if (!dropdownOpen && isMinimized && sidebarRef.current) {
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      // Position dropdown to the right, with bottom aligned to sidebar bottom
      setDropdownPosition({
        bottom: window.innerHeight - sidebarRect.bottom,
        left: sidebarRect.right + 12,
      });
    }
    setDropdownOpen(!dropdownOpen);
  };

  // Detach handlers
  const handleDetachStart = (e) => {
    e.preventDefault();
    hideTooltip(); // Hide any visible tooltip when dragging
    const rect = sidebarRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    setIsDragging(true);

    // Detach and minimize
    if (!isDetached) {
      if (activeSubNav) {
        setSavedSubNav(activeSubNav);
        setActiveSubNav(null);
        setMainNavVisible(true);
      }
      setIsMinimized(true);
      setIsDetached(true);
      setDragPosition({ x: e.clientX - 30, y: e.clientY - 30 });
    }
  };

  const handleDrag = (e) => {
    if (!isDragging || !isDetached) return;

    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    setDragPosition({ x: newX, y: newY });

    // Check if near drop zone (left edge)
    setShowDropZone(e.clientX < DROP_ZONE_THRESHOLD);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // If in drop zone, reattach
    if (showDropZone) {
      setIsDetached(false);
      setShowDropZone(false);
    }
  };

  // Global mouse move/up listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handleDrag(e);
      const handleMouseUp = () => handleDragEnd();

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, showDropZone]);

  // No auto-opening of sub-nav on load - start at main nav level
  // The nav will remember position after user interaction

  // Handle selecting a nav item to show sub-nav
  const handleNavSelect = (item) => {
    // If minimized, expand first
    if (isMinimized) {
      setIsMinimized(false);
    }

    if (!item.subItems?.length || isAnimating) return;

    setIsAnimating(true);
    setMainNavVisible(false);
    setSavedSubNav(item); // Save selection for minimize/expand

    // After main nav slides out, slide sub-nav in
    setTimeout(() => {
      setActiveSubNav(item);
      setTimeout(() => {
        setIsAnimating(false);
      }, ANIMATION_DURATION);
    }, ANIMATION_DURATION);
  };

  // Toggle minimize state
  const toggleMinimize = () => {
    if (isMinimized) {
      setIsMinimized(false);
      // Restore saved nav state when expanding (only if not detached)
      if (savedSubNav && !isDetached) {
        setTimeout(() => {
          setMainNavVisible(false);
          setTimeout(() => {
            setActiveSubNav(savedSubNav);
          }, ANIMATION_DURATION);
        }, 100);
      }
    } else {
      // Save current nav state before minimizing
      if (activeSubNav) {
        setSavedSubNav(activeSubNav);
        setActiveSubNav(null);
        setMainNavVisible(true);
      }
      setIsMinimized(true);
      setDropdownOpen(false);
    }
  };

  // Handle going back to main nav
  const handleBack = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSavedSubNav(null); // Clear saved state when manually going back

    // Slide sub-nav out first
    setTimeout(() => {
      setActiveSubNav(null);
      setMainNavVisible(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, ANIMATION_DURATION);
    }, ANIMATION_DURATION);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking on tour elements
      if (e.target.closest('.tour-tooltip') || e.target.closest('.tour-container')) {
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          profileBtnRef.current && !profileBtnRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close dropdown on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && dropdownOpen) {
        setDropdownOpen(false);
        profileBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [dropdownOpen]);

  // Register tour actions
  useEffect(() => {
    registerTourActions({
      openSubNav: () => {
        // Open a nav item (first section, first item with subItems)
        const firstItemWithSubNav = navSections[0]?.items?.find(item => item.subItems?.length);
        if (firstItemWithSubNav) {
          setMainNavVisible(false);
          setTimeout(() => {
            setActiveSubNav(firstItemWithSubNav);
            setSavedSubNav(firstItemWithSubNav);
          }, ANIMATION_DURATION);
        }
      },
      goBackToMainNav: () => {
        if (activeSubNav) {
          setActiveSubNav(null);
          setMainNavVisible(true);
        }
      },
      openProfileDropdown: () => {
        setDropdownOpen(true);
      },
      closeProfileDropdown: () => {
        setDropdownOpen(false);
      },
      selectFirstMdrAccount: () => {
        if (mdrAccounts.length > 0) {
          setActiveAccount(0);
        }
      },
      resetSidebarForTour: () => {
        // Reset to main nav, not minimized, not detached
        setActiveSubNav(null);
        setMainNavVisible(true);
        setIsMinimized(false);
        setIsDetached(false);
        setDropdownOpen(false);
        // Open sidebar on mobile
        openSidebar();
      },
      cleanupAfterTour: () => {
        // Optional cleanup after tour ends
        setDropdownOpen(false);
        closeSidebar();
      },
    });
  }, [registerTourActions, navSections, activeSubNav, mdrAccounts, setActiveAccount, openSidebar, closeSidebar]);

  const handleAccountSwitch = (index) => {
    setActiveAccount(index);
    setTimeout(() => setDropdownOpen(false), 200);
  };

  // Section drag handlers
  const handleSectionDragStart = (e, sectionIdx) => {
    setDraggedSection(sectionIdx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionIdx.toString());
    // Add dragging class after a tick to avoid flash
    setTimeout(() => {
      e.target.closest('.nav-section')?.classList.add('dragging');
    }, 0);
  };

  const handleSectionDragEnd = (e) => {
    setDraggedSection(null);
    setDragOverSection(null);
    document.querySelectorAll('.nav-section').forEach(el => {
      el.classList.remove('dragging', 'drag-over', 'drag-over-top', 'drag-over-bottom');
    });
  };

  const handleSectionDragOver = (e, sectionIdx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedSection === null || draggedSection === sectionIdx) return;

    const sectionEl = e.target.closest('.nav-section');
    if (!sectionEl) return;

    const rect = sectionEl.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const isAbove = e.clientY < midY;

    // Remove previous indicators
    document.querySelectorAll('.nav-section').forEach(el => {
      if (el !== sectionEl) {
        el.classList.remove('drag-over', 'drag-over-top', 'drag-over-bottom');
      }
    });

    sectionEl.classList.add('drag-over');
    sectionEl.classList.toggle('drag-over-top', isAbove);
    sectionEl.classList.toggle('drag-over-bottom', !isAbove);

    setDragOverSection(sectionIdx);
  };

  const handleSectionDrop = (e, targetIdx) => {
    e.preventDefault();

    if (draggedSection === null || draggedSection === targetIdx) return;

    const sectionEl = e.target.closest('.nav-section');
    const rect = sectionEl?.getBoundingClientRect();
    const isAbove = rect ? e.clientY < rect.top + rect.height / 2 : false;

    const newSections = [...navSections];
    const [draggedItem] = newSections.splice(draggedSection, 1);

    // Calculate new index
    let newIdx = targetIdx;
    if (draggedSection < targetIdx) {
      newIdx = isAbove ? targetIdx - 1 : targetIdx;
    } else {
      newIdx = isAbove ? targetIdx : targetIdx + 1;
    }

    newSections.splice(newIdx, 0, draggedItem);
    setNavSections(newSections);

    // Save order to localStorage
    const order = newSections.map(s => s.title);
    localStorage.setItem(NAV_SECTIONS_ORDER_KEY, JSON.stringify(order));

    setDraggedSection(null);
    setDragOverSection(null);
  };

  const sidebarClasses = [
    'sidebar',
    isMinimized ? 'minimized' : '',
    isDetached ? 'detached' : '',
    isDragging ? 'dragging' : '',
    isMobileOpen ? 'open' : '',
  ].filter(Boolean).join(' ');

  const sidebarStyle = isDetached ? {
    left: `${dragPosition.x}px`,
    top: `${dragPosition.y}px`,
  } : {};

  // Close sidebar when navigating on mobile (skip initial mount)
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      closeSidebar();
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, closeSidebar]);

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Drop zone indicator */}
      <div className={`sidebar-drop-zone ${showDropZone ? 'visible' : ''}`} />

      <aside
        ref={sidebarRef}
        className={sidebarClasses}
        style={sidebarStyle}
      >
        <div className="sidebar-content">
          {/* Header */}
          <header
            className="sidebar-header"
            onMouseDown={isDetached ? handleDetachStart : undefined}
            style={isDetached ? { cursor: 'grab' } : undefined}
          >
            <div className="logo">
              {isMinimized ? <Rapid7Logo mini /> : <Rapid7Logo />}
            </div>
            {!isMinimized && (
              <div className="sidebar-header-actions">
                {!isDetached && (
                  <button
                    className="sidebar-toggle"
                    onMouseDown={handleDetachStart}
                    title="Drag to detach sidebar"
                    data-tour="detach-btn"
                  >
                    <DetachIcon />
                  </button>
                )}
                <button
                  className="sidebar-toggle"
                  onClick={toggleMinimize}
                  onMouseDown={(e) => e.stopPropagation()}
                  title={isMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
                  data-tour="minimize-btn"
                >
                  {isMinimized ? <ExpandIcon /> : <MinimizeIcon />}
                </button>
              </div>
            )}
          </header>

        {/* Navigation Container */}
        <div className="nav-container">
          {/* Sidebar Controls - shown when minimized */}
          {isMinimized && (
            <div className="sidebar-controls">
              {!isDetached && (
                <button
                  className="sidebar-toggle"
                  onMouseDown={handleDetachStart}
                  title="Drag to detach sidebar"
                  data-tooltip="Detach"
                >
                  <DetachIcon />
                </button>
              )}
              <button
                className="sidebar-toggle"
                onClick={toggleMinimize}
                onMouseDown={(e) => e.stopPropagation()}
                title="Expand sidebar"
                data-tooltip="Expand"
              >
                <ExpandIcon />
              </button>
            </div>
          )}

          {/* Main Navigation */}
          <nav className={`sidebar-nav main-nav ${mainNavVisible ? 'visible' : 'hidden'} ${isAnimating ? 'animating' : ''}`}>
            {navSections.map((section, sectionIdx) => (
              <div
                key={section.title}
                className={`nav-section ${draggedSection === sectionIdx ? 'dragging' : ''} ${dragOverSection === sectionIdx ? 'drag-over' : ''}`}
                draggable
                onDragStart={(e) => handleSectionDragStart(e, sectionIdx)}
                onDragEnd={handleSectionDragEnd}
                onDragOver={(e) => handleSectionDragOver(e, sectionIdx)}
                onDrop={(e) => handleSectionDrop(e, sectionIdx)}
              >
                <div className="nav-section-header">
                  <span
                    className="nav-section-drag-handle"
                    title="Drag to reorder"
                    data-tour={sectionIdx === 0 ? 'drag-handle' : undefined}
                  >
                    <Icons.dragHandle />
                  </span>
                  <span className="nav-section-title">{section.title}</span>
                </div>
                <ul className="nav-list">
                  {section.items.map((item, itemIdx) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      onSelect={handleNavSelect}
                      isSelected={activeSubNav?.id === item.id || savedSubNav?.id === item.id}
                      onMouseEnter={showTooltip}
                      onMouseLeave={hideTooltip}
                      dataTour={sectionIdx === 0 && itemIdx === 0 ? 'nav-item' : undefined}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Sub Navigation Panel */}
          <SubNavPanel
            item={activeSubNav}
            onBack={handleBack}
            isVisible={!!activeSubNav}
            isAnimating={isAnimating}
          />
        </div>

        {/* Footer Links */}
        <div className="sidebar-footer-links">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            data-tooltip="Platform Home"
            onMouseEnter={(e) => showTooltip(e, 'Platform Home')}
            onMouseLeave={hideTooltip}
          >
            <Icons.home />
            <span>Platform Home</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            data-tooltip="Settings"
            onMouseEnter={(e) => showTooltip(e, 'Settings')}
            onMouseLeave={hideTooltip}
          >
            <Icons.settings />
            <span>Settings</span>
          </NavLink>
          <NavLink
            to="/docs"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            data-tooltip="API documentation"
            onMouseEnter={(e) => showTooltip(e, 'API documentation')}
            onMouseLeave={hideTooltip}
          >
            <Icons.docs />
            <span>API documentation</span>
          </NavLink>
        </div>

        {/* User Profile */}
        <div className="sidebar-footer">
          <button
            ref={profileBtnRef}
            className="user-profile"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            onClick={handleDropdownToggle}
            onMouseEnter={(e) => showTooltip(e, currentAccount.name)}
            onMouseLeave={hideTooltip}
            data-tooltip={currentAccount.name}
            data-tour="profile-btn"
          >
            <div className={`user-avatar ${currentAccount.isPersonal ? '' : 'company-logo'}`}>
              {currentAccount.isPersonal ? (
                <img src="https://i.pravatar.cc/150?u=jpyper" alt={currentAccount.name} />
              ) : (
                <img src={currentAccount.logo} alt={currentAccount.name} />
              )}
              <span className="online-indicator"></span>
            </div>
            <div className="user-info">
              <span className="user-name">{currentAccount.name}</span>
              <span className="user-email">{currentAccount.isPersonal ? currentAccount.email : 'Jonny Pyper'}</span>
            </div>
            <Icons.chevronDown />
          </button>

          {/* Dropdown */}
          <div
            ref={dropdownRef}
            className={`user-dropdown ${dropdownOpen ? 'open' : ''}`}
            style={isMinimized ? { bottom: dropdownPosition.bottom, left: dropdownPosition.left, top: 'auto' } : undefined}
          >
            {/* Personal Account */}
            <div className="dropdown-section">
              <span className="dropdown-section-title">My Account</span>
              <button
                className={`dropdown-user ${activeAccountIndex === null ? 'active' : ''}`}
                onClick={() => handleAccountSwitch(null)}
              >
                <div className="user-avatar small">
                  <img src="https://i.pravatar.cc/150?u=jpyper" alt={personalAccount.name} />
                </div>
                <div className="dropdown-user-info">
                  <span className="dropdown-user-name">{personalAccount.name}</span>
                  <span className="dropdown-user-email">{personalAccount.email}</span>
                </div>
                <span className="check-icon">
                  <Icons.check />
                </span>
              </button>
            </div>
            <div className="dropdown-divider"></div>
            {/* MDR Accounts */}
            <div className="dropdown-section dropdown-section-scrollable" data-tour="mdr-accounts-section">
              <span className="dropdown-section-title">MDR Accounts</span>
              <div className="dropdown-section-scroll">
                {mdrAccounts.map((account, idx) => (
                  <button
                    key={idx}
                    className={`dropdown-user ${activeAccountIndex === idx ? 'active' : ''}`}
                    onClick={() => handleAccountSwitch(idx)}
                    data-tour={idx === 0 ? 'mdr-account' : undefined}
                  >
                    <div className="user-avatar small company-logo">
                      <img src={account.logo} alt={account.name} />
                    </div>
                    <div className="dropdown-user-info">
                      <span className="dropdown-user-name">{account.name}</span>
                      <span className="dropdown-user-email">Jonny Pyper</span>
                    </div>
                    <span className="check-icon">
                      <Icons.check />
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-section">
              <a href="#" className="dropdown-item">
                <Icons.user />
                <span>My profile</span>
                <span className="dropdown-item-meta">jpyper@rapid7.com</span>
              </a>
              <a href="#" className="dropdown-item">
                <Icons.settings />
                <span>Account settings</span>
              </a>
              <a href="#" className="dropdown-item">
                <Icons.device />
                <span>Device management</span>
              </a>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-section">
              <a href="#" className="dropdown-item">
                <Icons.logout />
                <span>Sign out</span>
              </a>
            </div>
            <div className="dropdown-footer">
              <div className="dropdown-brand">
                <Rapid7Logo color="#a1a1aa" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip for minimized sidebar */}
      {tooltip.visible && (
        <div className="sidebar-tooltip" style={{ top: tooltip.top, left: tooltip.left }}>
          {tooltip.text}
        </div>
      )}
    </aside>
    </>
  );
}
