import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './configs/queryClient'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import { BrowserRouter } from 'react-router-dom'
// Log l'état initial du store
console.log('Initial store state:', store.getState())

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
)