import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import { SidebarProvider } from './context/SidebarContext'
import { AccountProvider } from './context/AccountContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AccountProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </AccountProvider>
    </ThemeProvider>
  </StrictMode>,
)
