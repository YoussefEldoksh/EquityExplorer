
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from "./pages/HomePage"
import TickerPage from "./pages/TickerPage"
import SignInPage from "./pages/SignInPage"
import RegisterPage from "./pages/RegisterPage"
import TickersListPage from './pages/TickersListPage'
import SettingsPage from './pages/SettingsPage'
import ContactPage from './pages/ContactPage'
function App() {

  return (
    <>
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/:stockTicker" element={<TickerPage/>} />
          <Route path="/signin" element={<SignInPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/settings" element={<SettingsPage/>} />
          <Route path="/tickerslist" element={<TickersListPage/>} />
          <Route path="/contact" element={<ContactPage/>} />
        </Routes>
        </BrowserRouter>

      </>
      )
}

      export default App
