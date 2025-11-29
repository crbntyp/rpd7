// Navigation data structure - shared between Sidebar and ComponentHeader
export const navSections = [
  {
    title: 'Overview',
    items: [
      {
        id: 'command-home',
        label: 'Command Home',
        icon: 'home',
        path: '/dashboard/overview',
        subItems: [
          {
            type: 'section',
            label: 'Dashboards',
            items: [
              { label: 'Overview', path: '/dashboard/overview' },
              { label: 'Security Posture', path: '/dashboard/posture' },
              { label: 'Executive Summary', path: '/dashboard/executive' },
            ],
          },
          {
            type: 'section',
            label: 'Analytics',
            items: [
              { label: 'Security Score', path: '/analytics/score' },
              { label: 'Trend Analysis', path: '/analytics/trends' },
              { label: 'Risk Metrics', path: '/analytics/risk' },
            ],
          },
          { label: 'Quick Actions', path: '/quick-actions' },
          { label: 'Getting Started', path: '/getting-started' },
        ],
      },
      {
        id: 'reports',
        label: 'Reports & Dashboards',
        icon: 'grid',
        subItems: [
          {
            type: 'section',
            label: 'Reports',
            items: [
              { label: 'Custom Reports', path: '/reports/custom' },
              { label: 'Scheduled Reports', path: '/reports/scheduled' },
              { label: 'Report Templates', path: '/reports/templates' },
              { label: 'Report History', path: '/reports/history' },
            ],
          },
          {
            type: 'section',
            label: 'Dashboards',
            items: [
              { label: 'My Dashboards', path: '/dashboards/my' },
              { label: 'Shared Dashboards', path: '/dashboards/shared' },
              { label: 'Dashboard Templates', path: '/dashboards/templates' },
            ],
          },
          { label: 'Widgets Library', path: '/widgets' },
        ],
      },
    ],
  },
  {
    title: 'Detection & Response',
    items: [
      {
        id: 'response',
        label: 'Response & Remediation',
        icon: 'wrench',
        subItems: [
          {
            type: 'section',
            label: 'Incidents',
            items: [
              { label: 'Active Incidents', path: '/response/incidents/active' },
              { label: 'Pending Review', path: '/response/incidents/pending' },
              { label: 'Resolved', path: '/response/incidents/resolved' },
              { label: 'Incident Timeline', path: '/response/incidents/timeline' },
            ],
          },
          {
            type: 'section',
            label: 'Actions',
            items: [
              { label: 'Containment', path: '/response/containment' },
              { label: 'Remediation Tasks', path: '/response/tasks' },
              { label: 'Response Playbooks', path: '/response/playbooks' },
            ],
          },
          { label: 'Case Management', path: '/response/cases' },
        ],
      },
      {
        id: 'alerts',
        label: 'Alerts',
        icon: 'alert',
        subItems: [
          {
            type: 'section',
            label: 'Alert Queue',
            items: [
              { label: 'Active Alerts', path: '/alerts/active', badge: { count: 12, type: 'warning' } },
              { label: 'Triaged', path: '/alerts/triaged', badge: { count: 8, type: 'info' } },
              { label: 'Escalated', path: '/alerts/escalated', badge: { count: 3, type: 'critical' } },
              { label: 'Dismissed', path: '/alerts/dismissed', badge: { count: 24, type: 'muted' } },
            ],
          },
          {
            type: 'section',
            label: 'Configuration',
            items: [
              { label: 'Alert Rules', path: '/alerts/rules' },
              { label: 'Notification Channels', path: '/alerts/notifications' },
              { label: 'Suppression Rules', path: '/alerts/suppression' },
            ],
          },
        ],
      },
      {
        id: 'findings',
        label: 'Findings',
        icon: 'file',
        subItems: [
          {
            type: 'section',
            label: 'By Severity',
            items: [
              { label: 'Critical', path: '/findings/critical' },
              { label: 'High', path: '/findings/high' },
              { label: 'Medium', path: '/findings/medium' },
              { label: 'Low', path: '/findings/low' },
            ],
          },
          {
            type: 'section',
            label: 'By Status',
            items: [
              { label: 'Open', path: '/findings/open' },
              { label: 'In Progress', path: '/findings/in-progress' },
              { label: 'Resolved', path: '/findings/resolved' },
            ],
          },
          { label: 'All Findings', path: '/findings' },
        ],
      },
    ],
  },
  {
    title: 'Assets & Intelligence',
    items: [
      {
        id: 'assets',
        label: 'Assets & Identities',
        icon: 'monitor',
        subItems: [
          {
            type: 'section',
            label: 'Attack Surface Management',
            items: [
              { label: 'Assets (Internal)', path: '/assets/internal' },
              { label: 'Identities', path: '/assets/identities' },
              { label: 'Network Services (External)', path: '/assets/network-services' },
              { label: 'Certificates (External)', path: '/assets/certificates' },
              { label: 'Domains (External)', path: '/assets/domains' },
              { label: 'IP Addresses (External)', path: '/assets/ip-addresses' },
              { label: 'Discovery Seeds', path: '/assets/discovery-seeds' },
            ],
          },
          { label: 'Workspace', path: '/assets/workspace' },
          { label: 'Queries', path: '/assets/queries' },
          { label: 'Reference Lists', path: '/assets/reference-lists' },
          {
            type: 'section',
            label: 'Cloud Security',
            items: [
              { label: 'Resources', path: '/assets/cloud/resources' },
              { label: 'Resource Groups', path: '/assets/cloud/groups' },
            ],
          },
          { label: 'Access Explorer', path: '/assets/access-explorer' },
          { label: 'Applications', path: '/assets/applications' },
          { label: 'Data Groups', path: '/assets/data-groups' },
        ],
      },
      {
        id: 'intelligence',
        label: 'Intelligence',
        icon: 'globe',
        subItems: [
          {
            type: 'section',
            label: 'Threat Intelligence',
            items: [
              { label: 'Threat Feeds', path: '/intelligence/feeds' },
              { label: 'IOCs', path: '/intelligence/iocs' },
              { label: 'Attack Patterns', path: '/intelligence/patterns' },
              { label: 'Threat Actors', path: '/intelligence/actors' },
            ],
          },
          {
            type: 'section',
            label: 'Research',
            items: [
              { label: 'Investigations', path: '/intelligence/investigations' },
              { label: 'Hunting Queries', path: '/intelligence/hunting' },
              { label: 'Saved Searches', path: '/intelligence/saved' },
            ],
          },
          { label: 'Intelligence Reports', path: '/intelligence/reports' },
        ],
      },
    ],
  },
  {
    title: 'Compliance & Data',
    items: [
      {
        id: 'compliance',
        label: 'Controls & Compliance',
        icon: 'shield',
        subItems: [
          {
            type: 'section',
            label: 'Frameworks',
            items: [
              { label: 'All Frameworks', path: '/compliance/frameworks' },
              { label: 'NIST CSF', path: '/compliance/frameworks/nist' },
              { label: 'ISO 27001', path: '/compliance/frameworks/iso27001' },
              { label: 'SOC 2', path: '/compliance/frameworks/soc2' },
              { label: 'CIS Controls', path: '/compliance/frameworks/cis' },
            ],
          },
          {
            type: 'section',
            label: 'Governance',
            items: [
              { label: 'Policies', path: '/compliance/policies' },
              { label: 'Assessments', path: '/compliance/assessments' },
              { label: 'Evidence', path: '/compliance/evidence' },
            ],
          },
          { label: 'Compliance Reports', path: '/compliance/reports' },
        ],
      },
      {
        id: 'connectors',
        label: 'Data Connectors',
        icon: 'database',
        subItems: [
          {
            type: 'section',
            label: 'Event Sources',
            items: [
              { label: 'All Sources', path: '/connectors/sources' },
              { label: 'Cloud Providers', path: '/connectors/sources/cloud' },
              { label: 'Security Tools', path: '/connectors/sources/security' },
              { label: 'Infrastructure', path: '/connectors/sources/infra' },
            ],
          },
          {
            type: 'section',
            label: 'Data Management',
            items: [
              { label: 'Log Management', path: '/connectors/logs' },
              { label: 'Data Retention', path: '/connectors/retention' },
              { label: 'Data Quality', path: '/connectors/quality' },
            ],
          },
          { label: 'Integrations', path: '/connectors/integrations' },
          { label: 'API Keys', path: '/connectors/api-keys' },
        ],
      },
      {
        id: 'automation',
        label: 'Automation',
        icon: 'cog',
        subItems: [
          {
            type: 'section',
            label: 'Workflows',
            items: [
              { label: 'All Workflows', path: '/automation/workflows' },
              { label: 'Active', path: '/automation/workflows/active' },
              { label: 'Draft', path: '/automation/workflows/draft' },
              { label: 'Templates', path: '/automation/workflows/templates' },
            ],
          },
          {
            type: 'section',
            label: 'Playbooks',
            items: [
              { label: 'All Playbooks', path: '/automation/playbooks' },
              { label: 'Response Playbooks', path: '/automation/playbooks/response' },
              { label: 'Enrichment Playbooks', path: '/automation/playbooks/enrichment' },
            ],
          },
          { label: 'Scheduled Tasks', path: '/automation/scheduled' },
          { label: 'Execution History', path: '/automation/history' },
        ],
      },
    ],
  },
  {
    title: 'Agent Management',
    items: [
      {
        id: 'agents',
        label: 'Agents',
        icon: 'agent',
        subItems: [
          {
            type: 'section',
            label: 'Overview',
            items: [
              { label: 'All Agents', path: '/agents/all' },
              { label: 'Agent Health', path: '/agents/health' },
              { label: 'Agent Groups', path: '/agents/groups' },
              { label: 'Offline Agents', path: '/agents/offline', badge: { count: 5, type: 'warning' } },
            ],
          },
          {
            type: 'section',
            label: 'Deployment',
            items: [
              { label: 'Deploy New Agent', path: '/agents/deploy' },
              { label: 'Installation Packages', path: '/agents/packages' },
              { label: 'Deployment Scripts', path: '/agents/scripts' },
            ],
          },
          {
            type: 'section',
            label: 'Configuration',
            items: [
              { label: 'Agent Policies', path: '/agents/policies' },
              { label: 'Collection Settings', path: '/agents/collection' },
              { label: 'Update Settings', path: '/agents/updates' },
            ],
          },
          { label: 'Agent Logs', path: '/agents/logs' },
        ],
      },
      {
        id: 'collectors',
        label: 'Collectors',
        icon: 'server',
        subItems: [
          {
            type: 'section',
            label: 'Collector Management',
            items: [
              { label: 'All Collectors', path: '/collectors/all' },
              { label: 'Collector Health', path: '/collectors/health' },
              { label: 'Data Sources', path: '/collectors/sources' },
            ],
          },
          {
            type: 'section',
            label: 'Configuration',
            items: [
              { label: 'Collector Policies', path: '/collectors/policies' },
              { label: 'Event Forwarding', path: '/collectors/forwarding' },
              { label: 'Parsing Rules', path: '/collectors/parsing' },
            ],
          },
        ],
      },
    ],
  },
];

// Find parent section and item for a given path
export function findNavContext(pathname) {
  // Special cases for footer links
  if (pathname === '/' || pathname === '/home') {
    return { section: 'Platform', item: null, pageTitle: 'Platform Home' };
  }
  if (pathname === '/settings') {
    return { section: 'Settings', item: null, pageTitle: 'Settings' };
  }
  if (pathname === '/docs') {
    return { section: 'Documentation', item: null, pageTitle: 'API Documentation' };
  }

  for (const section of navSections) {
    for (const item of section.items) {
      // Check direct item path
      if (item.path === pathname) {
        return { section: section.title, item: item.label, pageTitle: item.label };
      }

      // Check subItems
      for (const sub of item.subItems || []) {
        if (sub.type === 'section') {
          for (const sectionItem of sub.items || []) {
            if (sectionItem.path === pathname) {
              return { section: section.title, item: item.label, pageTitle: sectionItem.label };
            }
          }
        } else if (sub.path === pathname) {
          return { section: section.title, item: item.label, pageTitle: sub.label };
        }
      }
    }
  }

  return { section: 'Rapid7', item: null, pageTitle: null };
}
