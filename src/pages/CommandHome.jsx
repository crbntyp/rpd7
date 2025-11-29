import ComponentHeader from '../components/ComponentHeader';
import PageHeader from '../components/PageHeader/PageHeader';

export default function CommandHome() {
  return (
    <>
      <ComponentHeader />
      <div className="page-container">
        <PageHeader
          title="Command Home"
          description="Your security operations command center."
        />
        <div className="page-content">
          {/* Content will go here */}
        </div>
      </div>
    </>
  );
}
