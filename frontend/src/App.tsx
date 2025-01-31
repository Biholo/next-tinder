import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch } from './hooks/useAppDispatch'
import 'react-toastify/dist/ReactToastify.css'
 
import SwipeCards from '@/pages/SwipeCards'
import Chat from '@/pages/Chat'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { useEffect } from 'react'
import { autoLogin } from '@/redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useAppSelector } from './hooks/useAppSelector'
import Loader from '@/components/loader/Loader'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  // const isAuthenticated = true
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  return children
}

function App() {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  useEffect(() => {
    dispatch(autoLogin());

    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div className="flex w-full">
        {isAuthenticated && <AppSidebar />}
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={
                <PrivateRoute>
                  <SwipeCards />
                </PrivateRoute>
              } />
              <Route path="/chat/:matchId" element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </div>
      <ToastContainer />
    </>

  )
}

export default App