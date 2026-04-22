import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { hydrateFromServer } from './lib/storage'

async function bootstrap() {
  // Trek server-data binnen in localStorage vóór we renderen, zodat alle
  // hooks direct met de juiste waarden initialiseren (geen flash van lege data).
  // Op static hosts zonder backend (GH Pages) is dit een silent no-op.
  await hydrateFromServer()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap()
