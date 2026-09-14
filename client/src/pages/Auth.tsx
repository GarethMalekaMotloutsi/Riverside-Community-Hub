import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      setMessage('You are now signed in.')
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      setMessage('Check your email to confirm your account.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <section className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Riverside Community Hub
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                {isLogin ? 'Welcome back' : 'Join the community'}
              </h1>

              <p className="mt-3 text-base leading-7 text-slate-600">
                {isLogin
                  ? 'Sign in to manage your membership, bookings and community activities.'
                  : 'Create an account to access Riverside Community Hub services.'}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              {!isLogin && (
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              )}

              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {isLogin ? 'Sign in' : 'Create account'}
              </button>

              {message && (
                <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {message}
                </p>
              )}

              {error && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setMessage('')
                  setError('')
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {isLogin
                  ? 'Need an account? Create one'
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </section>

        <section className="hidden bg-blue-700 p-12 text-white lg:flex lg:flex-col lg:justify-center">
          <div className="max-w-md">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl font-bold">
              R
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              A place to connect, participate and give back.
            </h2>

            <p className="mt-5 text-lg leading-8 text-blue-100">
              Riverside Community Hub brings local programmes, shared
              facilities, memberships and community support together in one
              place.
            </p>

            <div className="mt-8 space-y-4 text-sm text-blue-100">
              <p>✓ Manage your community membership</p>
              <p>✓ Book rooms and equipment</p>
              <p>✓ Support local food parcel initiatives</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Auth