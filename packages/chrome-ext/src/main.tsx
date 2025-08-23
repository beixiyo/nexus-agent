import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'virtual:uno.css'
import '@/styles/css/index.css'

createRoot(document.getElementById('root')!).render(
  <App />,
)
