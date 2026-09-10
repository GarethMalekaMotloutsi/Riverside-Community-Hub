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
    <main>
      <section>
        <h1>Riverside Community Hub</h1>

        <h2>{isLogin ? 'Welcome back' : 'Create an account'}</h2>

        <p>
          {isLogin
            ? 'Sign in to manage your membership and bookings.'
            : 'Create an account to become a Riverside member.'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit">
            {isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {message && <p>{message}</p>}
        {error && <p>{error}</p>}

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin)
            setMessage('')
            setError('')
          }}
        >
          {isLogin
            ? 'Need an account? Sign up'
            : 'Already have an account? Sign in'}
        </button>
      </section>
    </main>
  )
}

export default Auth