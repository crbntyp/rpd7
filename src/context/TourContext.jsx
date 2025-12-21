import { createContext, useContext, useState, useCallback, useRef, useMemo, useEffect } from 'react';

const TourContext = createContext();

const MOBILE_BREAKPOINT = 1024;

// Tour step definitions - desktopOnly steps are skipped on mobile
const ALL_TOUR_STEPS = [
  {
    id: 'nav-item',
    target: '[data-tour="nav-item"]',
    title: 'Navigate Sections',
    description: 'Click any section to see nested navigation options.',
    position: 'right',
  },
  {
    id: 'sub-nav-panel',
    target: '[data-tour="sub-nav-panel"] .sub-nav-list',
    title: 'Sub-Navigation Panel',
    description: 'Browse nested items within each section and navigate to pages.',
    position: 'right',
  },
  {
    id: 'drag-handle',
    target: '[data-tour="drag-handle"]',
    title: 'Reorder Sections',
    description: 'Drag sections to customize your navigation order.',
    position: 'right',
  },
  {
    id: 'minimize-btn',
    target: '[data-tour="minimize-btn"]',
    title: 'Minimize Sidebar',
    description: 'Collapse the sidebar to icons for more screen space.',
    position: 'right',
    desktopOnly: true,
  },
  {
    id: 'detach-btn',
    target: '[data-tour="detach-btn"]',
    title: 'Detach Sidebar',
    description: 'Drag to detach the sidebar and position it anywhere on screen.',
    position: 'right',
    desktopOnly: true,
  },
  {
    id: 'profile-btn',
    target: '[data-tour="profile-btn"]',
    title: 'Account Switcher',
    description: 'Click to switch between your personal and company accounts.',
    position: 'right',
    mobilePosition: 'top', // Show tooltip at top on mobile since target is at bottom
  },
  {
    id: 'mdr-account',
    target: '[data-tour="mdr-accounts-section"]',
    title: 'MDR Accounts',
    description: 'Select a company account to view their security data.',
    position: 'right',
    mobilePosition: 'top',
  },
  {
    id: 'header-account',
    target: '[data-tour="header-account"]',
    title: 'Active Account',
    description: 'Your currently selected account is displayed here.',
    position: 'bottom',
  },
  {
    id: 'theme-selector',
    target: '[data-tour="theme-selector"]',
    title: 'Theme Selector',
    description: 'Customize your visual theme preference.',
    position: 'bottom-end',
  },
];

// Export filtered steps for external use
export const TOUR_STEPS = ALL_TOUR_STEPS;

export function TourProvider({ children }) {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);
  const actionsRef = useRef({});

  // Track window resize to update mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter steps based on device - skip desktopOnly steps on mobile
  const tourSteps = useMemo(() => {
    if (isMobile) {
      return ALL_TOUR_STEPS.filter(step => !step.desktopOnly);
    }
    return ALL_TOUR_STEPS;
  }, [isMobile]);

  // Register actions that can be triggered by the tour
  const registerTourActions = useCallback((actions) => {
    actionsRef.current = { ...actionsRef.current, ...actions };
  }, []);

  // Execute a registered action
  const executeAction = useCallback((actionName, ...args) => {
    const action = actionsRef.current[actionName];
    if (action && typeof action === 'function') {
      return action(...args);
    }
  }, []);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsTourActive(true);
    // Reset sidebar state for tour
    executeAction('resetSidebarForTour');
  }, [executeAction]);

  const endTour = useCallback(() => {
    setIsTourActive(false);
    setCurrentStep(0);
    // Clean up any tour-specific state
    executeAction('cleanupAfterTour');
  }, [executeAction]);

  const nextStep = useCallback(() => {
    const nextIndex = currentStep + 1;
    if (nextIndex >= tourSteps.length) {
      endTour();
      return;
    }

    // Execute before-step action for the next step
    const nextStepId = tourSteps[nextIndex].id;

    // Auto-progress actions
    switch (nextStepId) {
      case 'sub-nav-panel':
        executeAction('openSubNav');
        // Delay step change to allow sub-nav to animate in
        setTimeout(() => setCurrentStep(nextIndex), 400);
        return; // Early return - step will be set by timeout
      case 'drag-handle':
        executeAction('goBackToMainNav');
        // Delay for main nav to animate back
        setTimeout(() => setCurrentStep(nextIndex), 400);
        return;
      case 'profile-btn':
        executeAction('goBackToMainNav');
        // Scroll profile into view on mobile
        setTimeout(() => {
          const profileBtn = document.querySelector('[data-tour="profile-btn"]');
          if (profileBtn) {
            profileBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        break;
      case 'mdr-account':
        executeAction('openProfileDropdown');
        // Delay step change to allow dropdown to open
        setTimeout(() => setCurrentStep(nextIndex), 350);
        return; // Early return - step will be set by timeout
      case 'header-account':
        executeAction('selectFirstMdrAccount');
        setTimeout(() => executeAction('closeProfileDropdown'), 300);
        break;
      case 'theme-selector':
        // No action needed
        break;
      default:
        break;
    }

    setCurrentStep(nextIndex);
  }, [currentStep, tourSteps, endTour, executeAction]);

  const prevStep = useCallback(() => {
    const prevIndex = currentStep - 1;
    if (prevIndex < 0) return;

    // Handle reverse navigation
    const currentStepId = tourSteps[currentStep].id;
    const prevStepId = tourSteps[prevIndex].id;

    switch (currentStepId) {
      case 'sub-nav-panel':
        executeAction('goBackToMainNav');
        break;
      case 'mdr-account':
      case 'header-account':
        if (prevStepId === 'profile-btn') {
          executeAction('closeProfileDropdown');
        }
        break;
      default:
        break;
    }

    setCurrentStep(prevIndex);
  }, [currentStep, tourSteps, executeAction]);

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < tourSteps.length) {
      setCurrentStep(stepIndex);
    }
  }, [tourSteps]);

  const currentStepData = tourSteps[currentStep];

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentStep,
        currentStepData,
        totalSteps: tourSteps.length,
        tourSteps,
        startTour,
        endTour,
        nextStep,
        prevStep,
        goToStep,
        registerTourActions,
        executeAction,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
