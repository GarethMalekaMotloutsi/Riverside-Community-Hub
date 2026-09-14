import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Dashboard() {
  const [name, setName] = useState('')

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setName(user.user_metadata?.full_name || user.email || 'Member')
      }
    }

    getProfile()
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Riverside Community Hub
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Welcome, {name}
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Manage your bookings, support community programmes and stay connected
          with Riverside Community Hub.
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <Link
          to="/bookings"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Book a Facility
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            View available rooms and equipment and manage your bookings.
          </p>

          <span className="mt-5 inline-block text-sm font-semibold text-blue-600">
            View bookings →
          </span>
        </Link>

        <Link
          to="/donations"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Support Riverside
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Contribute to the Food Parcel Donation Drive and support local
            families.
          </p>

          <span className="mt-5 inline-block text-sm font-semibold text-blue-600">
            Make a donation →
          </span>
        </Link>
      </section>

      <section className="mt-8 rounded-xl bg-blue-50 p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Community Programmes
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Riverside Community Hub provides youth programmes, community
          activities and shared facilities for local residents.
        </p>
      </section>
    </main>
  )
}

export default Dashboard