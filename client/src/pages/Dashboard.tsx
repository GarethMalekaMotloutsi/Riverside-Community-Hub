import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function Dashboard() {
  const [name, setName] = useState('')

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setName(user.user_metadata?.full_name || user.email || 'Member')
      }
    }

    getProfile()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <main>
      <section>
        <h1>Riverside Community Hub</h1>
        <h2>Welcome, {name}</h2>

        <p>
          Manage your membership, bookings and community activities.
        </p>

        <button onClick={handleSignOut}>
          Sign out
        </button>
      </section>
    </main>
  )
}

export default Dashboard