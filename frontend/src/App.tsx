import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SwipeCards from './components/swipe/swiping'

import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <div className="flex flex-col items-center justify-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Routes>
          <Route path="/" element={<SwipeCards />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
