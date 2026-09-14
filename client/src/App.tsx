import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import AdminDashboard from './pages/AdminDashboard'
import Donations from './pages/Donations'
import Profile from './pages/Profile'

function App() {
  const [session, setSession] = useState<any>(null)
  const [role, setRole] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)

      if (session?.user) {
        loadRole(session.user.id)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)

      if (session?.user) {
        loadRole(session.user.id)
      } else {
        setRole('')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadRole = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    setRole(data?.role || 'member')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (!session) {
    return <Auth />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <nav className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                R
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Riverside
                </p>
                <p className="text-xs text-slate-500">
                  Community Hub
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Dashboard
              </Link>

              <Link
                to="/bookings"
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Bookings
              </Link>

              <Link
                to="/donations"
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Donations
              </Link>

              <Link
                to="/profile"
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Profile
              </Link>

              {(role === 'staff' || role === 'admin') && (
                <Link
                  to="/admin"
                  className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Admin
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Sign out
              </button>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App