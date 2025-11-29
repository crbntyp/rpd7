import { useState, useRef, useEffect } from 'react';
import './PageHeader.css';

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

function Dropdown({ label, icon, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="header-dropdown" ref={dropdownRef}>
      <button
        className={`btn btn-secondary dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon}
        {label}
        <ChevronDownIcon />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {items.map((item, idx) => (
            <button
              key={idx}
              className="dropdown-item"
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PageHeader({ title, description, actions, dropdown }) {
  return (
    <header className="page-header">
      <div className="page-header-content">
        <div className="page-header-title">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        <div className="page-header-actions">
          {dropdown && (
            <Dropdown
              label={dropdown.label}
              icon={dropdown.icon}
              items={dropdown.items}
            />
          )}
          {actions && actions.map((action, idx) => (
            <button
              key={idx}
              className={`btn ${action.variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={action.onClick}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
