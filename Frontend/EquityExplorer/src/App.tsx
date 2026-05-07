
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from "./pages/HomePage"
import TickerPage from "./pages/TickerPage"
import SignInPage from "./pages/SignInPage"
import RegisterPage from "./pages/RegisterPage"
import TickersListPage from './pages/TickersListPage'
function App() {

  return (
    <>
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/:stockTicker" element={<TickerPage/>} />
          <Route path="/signin" element={<SignInPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/tickerslist" element={<TickersListPage/>} />
        </Routes>
        </BrowserRouter>

      </>
      )
}

      export default App
