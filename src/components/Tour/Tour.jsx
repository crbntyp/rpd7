import { useState, useEffect, useCallback } from 'react';
import { useTour } from '../../context/TourContext';
import './Tour.css';

// Calculate tooltip position relative to target element
function getTooltipPosition(targetRect, position, tooltipWidth = 320, tooltipHeight = 200) {
  const padding = 16;
  const arrowSize = 12;

  let top, left;
  let arrowPosition = 'left';

  switch (position) {
    case 'right':
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      left = targetRect.right + padding + arrowSize;
      arrowPosition = 'left';
      break;
    case 'left':
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      left = targetRect.left - tooltipWidth - padding - arrowSize;
      arrowPosition = 'right';
      break;
    case 'bottom':
      top = targetRect.bottom + padding + arrowSize;
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      arrowPosition = 'top';
      break;
    case 'bottom-end':
      top = targetRect.bottom + padding + arrowSize;
      left = targetRect.right - tooltipWidth;
      arrowPosition = 'top-end';
      break;
    case 'top':
      top = targetRect.top - tooltipHeight - padding - arrowSize;
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      arrowPosition = 'bottom';
      break;
    default:
      top = targetRect.bottom + padding;
      left = targetRect.left;
      arrowPosition = 'top';
  }

  // Keep tooltip on screen
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (left < padding) left = padding;
  if (left + tooltipWidth > viewportWidth - padding) {
    left = viewportWidth - tooltipWidth - padding;
  }
  if (top < padding) top = padding;
  if (top + tooltipHeight > viewportHeight - padding) {
    top = viewportHeight - tooltipHeight - padding;
  }

  return { top, left, arrowPosition };
}

export default function Tour() {
  const {
    isTourActive,
    currentStep,
    currentStepData,
    totalSteps,
    tourSteps,
    nextStep,
    prevStep,
    endTour,
  } = useTour();

  const [targetRect, setTargetRect] = useState(null);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [arrowPosition, setArrowPosition] = useState('left');

  // Add body class when tour is active
  useEffect(() => {
    if (isTourActive) {
      document.body.classList.add('tour-active');
    } else {
      document.body.classList.remove('tour-active');
    }
    return () => document.body.classList.remove('tour-active');
  }, [isTourActive]);

  // Find and measure target element
  const updateTargetPosition = useCallback(() => {
    if (!currentStepData) return;

    const targetElement = document.querySelector(currentStepData.target);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setTargetRect(rect);

      // Calculate tooltip position
      const { top, left, arrowPosition: arrow } = getTooltipPosition(
        rect,
        currentStepData.position
      );
      setTooltipStyle({ top, left });
      setArrowPosition(arrow);

      // Scroll element into view if needed
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStepData]);

  // Update position when step changes or window resizes
  useEffect(() => {
    if (!isTourActive) return;

    // Small delay to allow DOM updates from auto-progress actions
    const timer = setTimeout(updateTargetPosition, 100);

    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition, true);
    };
  }, [isTourActive, currentStep, updateTargetPosition]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isTourActive) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          endTour();
          break;
        case 'ArrowRight':
        case 'Enter':
          nextStep();
          break;
        case 'ArrowLeft':
          prevStep();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isTourActive, nextStep, prevStep, endTour]);

  if (!isTourActive || !currentStepData || !targetRect) {
    return null;
  }

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="tour-container">
      {/* Overlay with spotlight cutout */}
      <div className="tour-overlay" onClick={endTour} />

      {/* Spotlight highlight */}
      <div
        className="tour-spotlight"
        style={{
          top: targetRect.top - 8,
          left: targetRect.left - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
        }}
      />

      {/* Tooltip */}
      <div
        className={`tour-tooltip tour-arrow-${arrowPosition}${currentStepData.mobilePosition ? ` tour-mobile-${currentStepData.mobilePosition}` : ''}`}
        style={tooltipStyle}
      >
        {/* Progress indicator */}
        <div className="tour-progress">
          <div className="tour-dots">
            {tourSteps.map((_, index) => (
              <span
                key={index}
                className={`tour-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>
          <span className="tour-step-count">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>

        {/* Content */}
        <div className="tour-content">
          <h3 className="tour-title">{currentStepData.title}</h3>
          <p className="tour-description">{currentStepData.description}</p>
        </div>

        {/* Actions */}
        <div className="tour-actions">
          <button className="tour-btn tour-btn-skip" onClick={endTour}>
            Skip
          </button>
          <div className="tour-nav">
            {!isFirstStep && (
              <button className="tour-btn tour-btn-back" onClick={prevStep}>
                Back
              </button>
            )}
            <button className="tour-btn tour-btn-next" onClick={nextStep}>
              {isLastStep ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
