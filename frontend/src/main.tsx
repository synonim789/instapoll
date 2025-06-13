import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { AuthProvider } from './auth/AuthContext.tsx'
import GuestRoute from './auth/GuestRoute.tsx'
import PrivateRoute from './auth/PrivateRoute.tsx'
import Login from './components/Login.tsx'
import SignUp from './components/SignUp.tsx'
import './index.css'
import CreatePoll from './pages/CreatePoll.tsx'
import Home from './pages/Home.tsx'
import PollPage from './pages/PollPage.tsx'
import Polls from './pages/Polls.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <GuestRoute>
        <Home />,
      </GuestRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/polls',
    element: (
      <PrivateRoute>
        <Polls />
      </PrivateRoute>
    ),
  },
  {
    path: '/poll/:id',
    element: <PollPage />,
  },
  {
    path: '/create',
    element: (
      <PrivateRoute>
        <CreatePoll />
      </PrivateRoute>
    ),
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
