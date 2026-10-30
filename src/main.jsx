import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// MOS type, self-hosted: Inter for text, Space Grotesk for headings and
// figures, JetBrains Mono for IDs, versions and code. See --font/--display/--mono.
import '@fontsource-variable/inter'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/jetbrains-mono'
import { ThemeProvider } from './context/ThemeContext'
import { SidebarProvider } from './context/SidebarContext'
import { AccountProvider } from './context/AccountContext'
import { TourProvider } from './context/TourContext'
import App from './App.jsx'

// ApexCharts draws its own text and defaults to Helvetica.
window.Apex = { ...window.Apex, chart: { ...window.Apex?.chart, fontFamily: "'Inter Variable', 'Inter', sans-serif" } }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AccountProvider>
        <SidebarProvider>
          <TourProvider>
            <App />
          </TourProvider>
        </SidebarProvider>
      </AccountProvider>
    </ThemeProvider>
  </StrictMode>,
)
