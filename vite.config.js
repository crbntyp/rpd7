import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// MOS (the design system) is a sibling folder, built from source: the nav
// is imported from it with @mos. dedupe makes MOS's own imports of react,
// react-dom and react-router-dom resolve to rpd7's copies, so MOS's React 18
// in mos/node_modules never loads into this app.
const mos = fileURLToPath(new URL('../mos/src', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/rpd7/',
  resolve: {
    alias: { '@mos': mos },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    fs: { allow: [searchForWorkspaceRoot(fileURLToPath(new URL('.', import.meta.url))), mos] },
  },
})
