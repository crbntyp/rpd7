import { useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useAccount } from '../../context/AccountContext';
import { findNavContext } from '../../data/navigation';
import ThemeSelector from '../ThemeSelector';
import { TourButton } from '../Tour';
import './ComponentHeader.css';

// Burger menu icon
const BurgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

function ComponentHeader({ actions = [], showThemeSelector = true }) {
  const location = useLocation();
  const { toggleSidebar } = useSidebar();
  const { currentAccount } = useAccount();

  // Get parent section from current path
  const navContext = findNavContext(location.pathname);
  const parentTitle = navContext.section;

  return (
    <header className="component-header">
      <div className="component-header-left">
        <button
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
        >
          <BurgerIcon />
        </button>
        <h2 className="component-header-title">{parentTitle}</h2>
        {!currentAccount.isPersonal && (
          <>
            <span className="component-header-divider">|</span>
            <div className="component-header-account" data-tour="header-account">
              <img
                src={currentAccount.logo}
                alt={currentAccount.name}
                className="component-header-account-logo"
              />
              <span className="component-header-account-name">{currentAccount.name}</span>
            </div>
          </>
        )}
      </div>

      <div className="component-header-actions">
        {actions.map((action) => (
          <button
            key={action.id}
            className="component-header-action"
            onClick={action.onClick}
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
        <TourButton />
        {showThemeSelector && (
          <div data-tour="theme-selector">
            <ThemeSelector />
          </div>
        )}
      </div>
    </header>
  );
}

export default ComponentHeader;
