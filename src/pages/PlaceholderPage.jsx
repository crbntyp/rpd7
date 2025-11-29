import { useLocation } from 'react-router-dom';
import ComponentHeader from '../components/ComponentHeader';
import PageHeader from '../components/PageHeader/PageHeader';
import { findNavContext } from '../data/navigation';

export default function PlaceholderPage({ title }) {
  const location = useLocation();
  const navContext = findNavContext(location.pathname);
  const pageTitle = title || navContext.pageTitle || location.pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Page';

  return (
    <>
      <ComponentHeader />
      <div className="page-container">
        <PageHeader
          title={pageTitle}
          description="This page is under construction."
        />
        <div className="page-content">
          {/* Content will go here */}
        </div>
      </div>
    </>
  );
}
