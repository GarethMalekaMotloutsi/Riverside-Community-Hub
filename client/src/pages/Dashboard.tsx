import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Dashboard() {
  const [name, setName] = useState('Member')

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setName(user.user_metadata?.full_name || 'Member')
      }
    }

    getProfile()
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <section className="overflow-hidden rounded-2xl bg-blue-600 shadow-sm">
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
            Member Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome, {name}
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-blue-100">
            Manage your bookings, stay connected with Riverside Community Hub
            and support programmes in your community.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            What would you like to do?
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose an option below to get started.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Link
            to="/bookings"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
              B
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Book a Facility
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              View community rooms and equipment and manage your bookings.
            </p>

            <span className="mt-5 inline-block text-sm font-semibold text-blue-600 group-hover:text-blue-700">
              View bookings →
            </span>
          </Link>

          <Link
            to="/donations"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
              G
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Give Back
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Support the Food Parcel Donation Drive and help local families.
            </p>

            <span className="mt-5 inline-block text-sm font-semibold text-blue-600 group-hover:text-blue-700">
              Support Riverside →
            </span>
          </Link>

          <Link
            to="/profile"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
              P
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              My Profile
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              View your membership details and account information.
            </p>

            <span className="mt-5 inline-block text-sm font-semibold text-blue-600 group-hover:text-blue-700">
              View profile →
            </span>
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Riverside Community
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              More than a place — a community.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Riverside Community Hub provides youth programmes, shared
              facilities and community support for local residents.
            </p>
          </div>

          <Link
            to="/donations"
            className="shrink-0 rounded-lg bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Support the community
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Dashboard