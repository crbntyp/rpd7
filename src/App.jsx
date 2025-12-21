import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { Tour } from './components/Tour';
import HomePage from './pages/HomePage';
import CommandHome from './pages/CommandHome';
import AgentsPage from './pages/AgentsPage';
import PlaceholderPage from './pages/PlaceholderPage';
import './styles/global.css';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
      <Tour />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/rpd7">
      <AppLayout>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Command Home / Dashboard */}
          <Route path="/dashboard/overview" element={<CommandHome />} />
          <Route path="/security-score" element={<PlaceholderPage title="Security Score" />} />
          <Route path="/quick-actions" element={<PlaceholderPage title="Quick Actions" />} />

          {/* Reports */}
          <Route path="/reports/custom" element={<PlaceholderPage title="Custom Reports" />} />
          <Route path="/reports/scheduled" element={<PlaceholderPage title="Scheduled Reports" />} />
          <Route path="/reports/templates" element={<PlaceholderPage title="Report Templates" />} />

          {/* Response & Remediation */}
          <Route path="/response/incidents/active" element={<PlaceholderPage title="Active Incidents" />} />
          <Route path="/response/incidents/pending" element={<PlaceholderPage title="Pending Review" />} />
          <Route path="/response/incidents/resolved" element={<PlaceholderPage title="Resolved Incidents" />} />
          <Route path="/response/incidents/timeline" element={<PlaceholderPage title="Incident Timeline" />} />
          <Route path="/response/containment" element={<PlaceholderPage title="Containment" />} />
          <Route path="/response/tasks" element={<PlaceholderPage title="Remediation Tasks" />} />
          <Route path="/response/playbooks" element={<PlaceholderPage title="Response Playbooks" />} />
          <Route path="/response/cases" element={<PlaceholderPage title="Case Management" />} />

          {/* Alerts */}
          <Route path="/alerts/active" element={<PlaceholderPage title="Active Alerts" />} />
          <Route path="/alerts/rules" element={<PlaceholderPage title="Alert Rules" />} />
          <Route path="/alerts/notifications" element={<PlaceholderPage title="Notifications" />} />

          {/* Findings */}
          <Route path="/findings" element={<PlaceholderPage title="All Findings" />} />
          <Route path="/findings/critical" element={<PlaceholderPage title="Critical Findings" />} />
          <Route path="/findings/resolved" element={<PlaceholderPage title="Resolved Findings" />} />

          {/* Assets */}
          <Route path="/assets" element={<PlaceholderPage title="All Assets" />} />
          <Route path="/assets/endpoints" element={<PlaceholderPage title="Endpoints" />} />
          <Route path="/assets/users" element={<PlaceholderPage title="Users & Groups" />} />
          <Route path="/assets/cloud" element={<PlaceholderPage title="Cloud Resources" />} />

          {/* Intelligence */}
          <Route path="/intelligence/feeds" element={<PlaceholderPage title="Threat Feeds" />} />
          <Route path="/intelligence/iocs" element={<PlaceholderPage title="IOCs" />} />
          <Route path="/intelligence/patterns" element={<PlaceholderPage title="Attack Patterns" />} />

          {/* Compliance */}
          <Route path="/compliance/frameworks" element={<PlaceholderPage title="Frameworks" />} />
          <Route path="/compliance/assessments" element={<PlaceholderPage title="Assessments" />} />
          <Route path="/compliance/policies" element={<PlaceholderPage title="Policies" />} />

          {/* Data Connectors */}
          <Route path="/connectors/sources" element={<PlaceholderPage title="Event Sources" />} />
          <Route path="/connectors/integrations" element={<PlaceholderPage title="Integrations" />} />
          <Route path="/connectors/logs" element={<PlaceholderPage title="Log Management" />} />

          {/* Automation */}
          <Route path="/automation/workflows" element={<PlaceholderPage title="Workflows" />} />
          <Route path="/automation/playbooks" element={<PlaceholderPage title="Playbooks" />} />
          <Route path="/automation/scheduled" element={<PlaceholderPage title="Scheduled Tasks" />} />

          {/* Agents */}
          <Route path="/agents/all" element={<AgentsPage />} />
          <Route path="/agents/health" element={<PlaceholderPage title="Agent Health" />} />
          <Route path="/agents/groups" element={<PlaceholderPage title="Agent Groups" />} />
          <Route path="/agents/offline" element={<PlaceholderPage title="Offline Agents" />} />
          <Route path="/agents/deploy" element={<PlaceholderPage title="Deploy New Agent" />} />
          <Route path="/agents/packages" element={<PlaceholderPage title="Installation Packages" />} />
          <Route path="/agents/scripts" element={<PlaceholderPage title="Deployment Scripts" />} />
          <Route path="/agents/policies" element={<PlaceholderPage title="Agent Policies" />} />
          <Route path="/agents/collection" element={<PlaceholderPage title="Collection Settings" />} />
          <Route path="/agents/updates" element={<PlaceholderPage title="Update Settings" />} />
          <Route path="/agents/logs" element={<PlaceholderPage title="Agent Logs" />} />
          <Route path="/agents/:agentId" element={<PlaceholderPage title="Agent Details" />} />

          {/* Collectors */}
          <Route path="/collectors/all" element={<PlaceholderPage title="All Collectors" />} />
          <Route path="/collectors/health" element={<PlaceholderPage title="Collector Health" />} />
          <Route path="/collectors/sources" element={<PlaceholderPage title="Data Sources" />} />
          <Route path="/collectors/policies" element={<PlaceholderPage title="Collector Policies" />} />
          <Route path="/collectors/forwarding" element={<PlaceholderPage title="Event Forwarding" />} />
          <Route path="/collectors/parsing" element={<PlaceholderPage title="Parsing Rules" />} />

          {/* Footer Links */}
          <Route path="/velociraptor" element={<PlaceholderPage title="Hosted Velociraptor" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="/docs" element={<PlaceholderPage title="API Documentation" />} />

          {/* Catch all */}
          <Route path="*" element={<PlaceholderPage title="Not Found" />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
