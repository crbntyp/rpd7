import { useEffect, useRef } from 'react';
import { Sidebar as MosSidebar, sidebarMotion, useSidebar } from '@mos/components/Sidebar';
import { useAccount } from '../../context/AccountContext';
import { useTour } from '../../context/TourContext';
import { navSections as defaultNavSections } from '../../data/navigation';
import { cascade, EASE, gsap, reducedMotion } from '../../lib/motion';

/*
 * rpd7's nav is MOS's Sidebar (mos/src/components/Sidebar). This wrapper only
 * hands it rpd7's own things: the navigation data, the Rapid7 marks and
 * icons, the account switcher, the saved section order, and the motion.
 * Its styles: MOS Sidebar.css (imported in App.jsx after global.css), the
 * --sb-* skin mapped to rpd7's tokens in global.css, and the [data-theme]
 * overrides there, which still target the same class names.
 */

const NAV_SECTIONS_ORDER_KEY = 'crbntyp-nav-sections-order';
const PERSONAL_AVATAR = 'https://i.pravatar.cc/150?u=jpyper';

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
  velociraptor: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <polyline points="7 10 10 13 7 16"/>
      <line x1="13" y1="16" x2="17" y2="16"/>
    </svg>
  ),
  external: () => (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
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

const motion = sidebarMotion({ gsap, cascade, ease: EASE, reducedMotion });

const footerLinks = [
  { label: 'Platform Home', path: '/', icon: 'home', end: true },
  { label: 'Hosted Velociraptor', path: '/velociraptor', icon: 'velociraptor' },
  { label: 'Settings', path: '/settings', icon: 'settings' },
  { label: 'API documentation', path: '/docs', icon: 'docs' },
];

// data-tour targets for the walkthrough (TourContext's steps).
function tourTargets(target) {
  switch (target.part) {
    case 'navItem': return target.sectionIndex === 0 && target.itemIndex === 0 ? { 'data-tour': 'nav-item' } : undefined;
    case 'sectionHandle': return target.sectionIndex === 0 ? { 'data-tour': 'drag-handle' } : undefined;
    case 'subNavPanel': return { 'data-tour': 'sub-nav-panel' };
    case 'detachButton': return target.placement === 'header' ? { 'data-tour': 'detach-btn' } : undefined;
    case 'minimizeButton': return target.placement === 'header' ? { 'data-tour': 'minimize-btn' } : undefined;
    case 'profileTrigger': return { 'data-tour': 'profile-btn' };
    case 'menuSection': return target.sectionIndex === 1 ? { 'data-tour': 'mdr-accounts-section' } : undefined;
    case 'menuAccount': return target.sectionIndex === 1 && target.index === 0 ? { 'data-tour': 'mdr-account' } : undefined;
    default: return undefined;
  }
}

export default function Sidebar() {
  const { activeAccountIndex, setActiveAccount, currentAccount, personalAccount, mdrAccounts } = useAccount();
  const { openSidebar, closeSidebar } = useSidebar();
  const { registerTourActions } = useTour();
  const rail = useRef(null);

  // The tour drives the rail through MOS's generic handle (apiRef) and finds
  // its targets by the data-tour attributes put on the rail's parts below.
  useEffect(() => {
    registerTourActions({
      openSubNav: () => {
        // The first item with a panel, in the current (maybe reordered) order.
        const first = rail.current?.sections()[0]?.items?.find((item) => item.subItems?.length);
        if (first) rail.current.openItem(first.id);
      },
      goBackToMainNav: () => rail.current?.closeItem(),
      openProfileDropdown: () => rail.current?.openMenu(),
      closeProfileDropdown: () => rail.current?.closeMenu(),
      selectFirstMdrAccount: () => {
        if (mdrAccounts.length > 0) setActiveAccount(0);
      },
      resetSidebarForTour: () => {
        rail.current?.reset();
        // Open sidebar on mobile
        openSidebar();
      },
      closeMobileSidebar: () => closeSidebar(),
      cleanupAfterTour: () => {
        rail.current?.closeMenu();
        closeSidebar();
      },
    });
  }, [registerTourActions, mdrAccounts, setActiveAccount, openSidebar, closeSidebar]);

  const account = currentAccount.isPersonal
    ? { name: currentAccount.name, sub: currentAccount.email, avatar: PERSONAL_AVATAR }
    : { name: currentAccount.name, sub: 'Jonny Pyper', avatar: currentAccount.logo, logo: true };

  const menu = [
    {
      title: 'My Account',
      accounts: [{
        name: personalAccount.name,
        sub: personalAccount.email,
        avatar: PERSONAL_AVATAR,
        active: activeAccountIndex === null,
        onSelect: () => setActiveAccount(null),
      }],
    },
    {
      title: 'MDR Accounts',
      scrollable: true,
      accounts: mdrAccounts.map((mdr, idx) => ({
        name: mdr.name,
        sub: 'Jonny Pyper',
        avatar: mdr.logo,
        logo: true,
        active: activeAccountIndex === idx,
        onSelect: () => setActiveAccount(idx),
      })),
    },
    {
      links: [
        { label: 'My profile', icon: 'user', href: '#', meta: 'jpyper@rapid7.com' },
        { label: 'Account settings', icon: 'settings', href: '#' },
        { label: 'Device management', icon: 'device', href: '#' },
      ],
    },
    {
      links: [{ label: 'Sign out', icon: 'logout', href: '#' }],
    },
  ];

  return (
    <MosSidebar
      sections={defaultNavSections}
      footerLinks={footerLinks}
      logo={<Rapid7Logo />}
      logoMini={<Rapid7Logo mini />}
      account={account}
      menu={menu}
      menuFooter={<Rapid7Logo color="#a1a1aa" />}
      icons={Icons}
      orderStorageKey={NAV_SECTIONS_ORDER_KEY}
      motion={motion}
      /* data-lenis-prevent: the rail scrolls itself, so a wheel over it
         must reach it rather than being smoothed into a page scroll. */
      rootProps={{ 'data-lenis-prevent': true }}
      partProps={tourTargets}
      apiRef={rail}
      // Clicking the tour's own controls must not close the account menu.
      menuIgnoreOutside=".tour-tooltip, .tour-container"
    />
  );
}
