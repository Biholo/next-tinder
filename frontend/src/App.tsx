import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch } from './hooks/useAppDispatch'
import 'react-toastify/dist/ReactToastify.css'

import SwipeCards from '@/pages/SwipeCards'
import Chat from '@/pages/Chat'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { useEffect, useState } from 'react'
import { autoLogin } from '@/redux/slices/authSlice'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAppSelector } from './hooks/useAppSelector'
import { WebSocketService } from '@/services/websocketService'
import Loader from '@/components/loader/Loader'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  if (loading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const [checkingAuth, setCheckingAuth] = useState(true)

  const wsService = new WebSocketService();

  useEffect(() => {
    wsService.connect();

    return () => {
      wsService.disconnect();
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      await dispatch(autoLogin())
      setCheckingAuth(false) // Auth check terminé
    }
    initAuth()
  }, [dispatch])

  if (checkingAuth || loading) {
    return <Loader />
  }

  return (
    <>
      <div className="flex w-full">
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
        {isAuthenticated && <AppSidebar />}
        <Routes>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Éviter la redirection vers /login si `checkingAuth` est encore en cours */}
          <Route path="*" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  )
}

export default App
