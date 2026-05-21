
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from "./pages/HomePage"
import TickerPage from "./pages/TickerPage"
import SignInPage from "./pages/SignInPage"
import RegisterPage from "./pages/RegisterPage"
import TickersListPage from './pages/TickersListPage'
import SettingsPage from './pages/SettingsPage'
import ContactPage from './pages/ContactPage'
import WatchlistPage from './pages/WatchlistPage'
import AlertsPage from './pages/AlertsPage'
import Navbar from './components/Navbar'
import { Toaster } from 'sonner';

import PrivacyPage from './pages/PrivacyPage'
import DataDeletionPage from './pages/DataDeletionPage'

function App() {

  return (
    <>
      <BrowserRouter >
        <Navbar />
        <Toaster position="bottom-right" richColors theme='system' className='font-mono' />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:stockTicker" element={<TickerPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/tickerslist" element={<TickersListPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/data-deletion" element={<DataDeletionPage />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
