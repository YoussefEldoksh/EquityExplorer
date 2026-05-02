
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from "./pages/HomePage"
import TickerPage from "./pages/TickerPage"
import SignInPage from "./pages/SignInPage"

function App() {

  return (
    <>
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/:stockTicker" element={<TickerPage/>} />
          <Route path="/signin" element={<SignInPage/>} />
        </Routes>
        </BrowserRouter>

      </>
      )
}

      export default App
