import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Campaign = {
  id: string
  title: string
  goal_amount: number
  current_amount: number
  active: boolean
}

function Donations() {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [amount, setAmount] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCampaign()
  }, [])

  const loadCampaign = async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .eq('active', true)
      .limit(1)
      .maybeSingle()

    if (data) {
      setCampaign(data)
    }
  }

  const handleDonation = async (event: React.FormEvent) => {
    event.preventDefault()

    setMessage('')
    setError('')

    const donationAmount = Number(amount)

    if (!donationAmount || donationAmount <= 0) {
      setError('Please enter a valid donation amount.')
      return
    }

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error: donationError } = await supabase
      .from('donations')
      .insert({
        donor_id: user?.id || null,
        amount: donationAmount,
        campaign: campaign?.title || 'Riverside Community Hub Donation Drive',
      })

    if (donationError) {
      setError(donationError.message)
      setLoading(false)
      return
    }

    setMessage(
      recurring
        ? 'Your recurring donation pledge has been recorded.'
        : 'Thank you. Your donation has been recorded.'
    )

    setAmount('')
    setRecurring(false)
    setLoading(false)
  }

  const progress = campaign
    ? Math.min(
        (Number(campaign.current_amount) / Number(campaign.goal_amount)) * 100,
        100
      )
    : 0

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            Support Riverside
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Make a Difference
          </h1>

          <p className="mt-3 text-gray-600">
            Your contribution helps Riverside Community Hub support local
            programmes, families and community activities.
          </p>
        </div>

        {campaign && (
          <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {campaign.title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  R{Number(campaign.current_amount).toFixed(2)} raised of R
                  {Number(campaign.goal_amount).toFixed(2)} goal
                </p>
              </div>

              <span className="text-sm font-semibold text-gray-700">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Donate to Riverside
          </h2>

          <form onSubmit={handleDonation} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Donation amount
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  R
                </span>

                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="100.00"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-8 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(event) => setRecurring(event.target.checked)}
                className="h-4 w-4"
              />

              <span>
                <span className="block text-sm font-medium text-gray-900">
                  Recurring pledge
                </span>

                <span className="block text-sm text-gray-500">
                  Record this as a recurring donation pledge.
                </span>
              </span>
            </label>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Donate'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

export default Donations