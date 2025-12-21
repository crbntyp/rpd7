import { useTour } from '../../context/TourContext';
import './TourButton.css';

// Tour icon (play/guide icon)
const TourIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
  </svg>
);

export default function TourButton() {
  const { startTour, isTourActive } = useTour();

  return (
    <button
      className={`tour-trigger ${isTourActive ? 'active' : ''}`}
      onClick={startTour}
      disabled={isTourActive}
      title="Start product tour"
    >
      <TourIcon />
      <span className="tour-trigger-label">Tour</span>
    </button>
  );
}
