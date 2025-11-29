import ComponentHeader from '../components/ComponentHeader';
import PageHeader from '../components/PageHeader/PageHeader';

export default function AgentsPage() {
  return (
    <>
      <ComponentHeader />
      <div className="page-container">
        <PageHeader
          title="Agents"
          description="Monitor and manage endpoint agents across your organization."
        />
        <div className="page-content">
          {/* Content will go here */}
        </div>
      </div>
    </>
  );
}
