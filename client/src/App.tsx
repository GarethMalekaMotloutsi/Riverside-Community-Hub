import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import AdminDashboard from './pages/AdminDashboard'
import Donations from './pages/Donations'

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
      <div className="min-h-screen bg-gray-50">

        <nav className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">

            <Link
              to="/"
              className="text-lg font-bold text-gray-900"
            >
              Riverside Community Hub
            </Link>

            <div className="flex items-center gap-4">

              <Link
                to="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>

              <Link
                to="/bookings"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Bookings
              </Link>

              <Link to="/donations" className="text-sm font-medium text-gray-600 hover:text-gray-900">
  Donations
</Link>

              {(role === 'staff' || role === 'admin') && (
                <Link
                  to="/admin"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Admin
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
        <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App