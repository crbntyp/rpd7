import { useState, useRef, useEffect } from 'react';
import { cascade, EASE, gsap, reducedMotion, SplitText, useGSAP } from '../../lib/motion';
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
  /*
   * Where the navigation lands you. The title's words rise out of their line,
   * the description and actions follow — the same page arriving each time you
   * pick something from the rail (lib/motion).
   *
   * Placeholder routes all render this same component, so moving between them
   * changes the title without remounting anything; the effect keys on the
   * title, and so does the h1 (below).
   */
  const headerRef = useRef(null);
  useGSAP(() => {
    if (reducedMotion()) return;
    const h1 = headerRef.current?.querySelector('h1');
    if (!h1) return;
    const split = SplitText.create(h1, { type: 'words,lines', mask: 'lines' });
    const tl = gsap.timeline({ defaults: { ease: EASE }, onComplete: () => split.revert() });
    tl.from(split.words, { yPercent: 115, duration: 0.9, stagger: 0.045 }, 0);
    const rest = cascade(headerRef.current.querySelectorAll('.page-header-title p, .page-header-actions > *'), { y: 10, stagger: 0.05, duration: 0.7 });
    if (rest) tl.add(rest, 0.15);
  }, { scope: headerRef, dependencies: [title], revertOnUpdate: true });

  return (
    <header className="page-header" ref={headerRef}>
      <div className="page-header-content">
        <div className="page-header-title">
          {/* Keyed by the title: the split rewrites this node's text, and
              React would otherwise keep updating a text node that has been
              replaced, leaving the old title on screen. */}
          <h1 key={title}>{title}</h1>
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
