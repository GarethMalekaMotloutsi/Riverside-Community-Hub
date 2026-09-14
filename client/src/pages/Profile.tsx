import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type ProfileData = {
  full_name: string
  membership_tier: string
  joined_at: string
}

function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    setEmail(user.email || '')

    const { data } = await supabase
      .from('profiles')
      .select('full_name, membership_tier, joined_at')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile(data)
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Member Area
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-2 text-gray-600">
          View your Riverside Community Hub membership information.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="mt-1 font-medium text-gray-900">
              {profile?.full_name || 'Not provided'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="mt-1 font-medium text-gray-900">
              {email || 'Not provided'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Membership Tier</p>
            <p className="mt-1 font-medium text-gray-900">
              {profile?.membership_tier || 'Free'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Join Date</p>
            <p className="mt-1 font-medium text-gray-900">
              {profile?.joined_at
                ? new Date(profile.joined_at).toLocaleDateString()
                : 'Not available'}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Profile