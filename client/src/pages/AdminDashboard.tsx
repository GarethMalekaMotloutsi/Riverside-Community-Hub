import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Booking = {
  id: string
  resource_id: string
  member_id: string
  start_time: string
  end_time: string
  status: string
  resources?: {
    name: string
    type: string
  } | null
  profiles?: {
    full_name: string
  } | null
}

type Member = {
  id: string
  full_name: string
  role: string
  membership_tier: string
  joined_at: string
}

function AdminDashboard() {
  const [role, setRole] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [memberSearch, setMemberSearch] = useState('')

  const [bookingCount, setBookingCount] = useState(0)
  const [donationTotal, setDonationTotal] = useState(0)
  const [activeMembers, setActiveMembers] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAdminDashboard()
  }, [])

  const loadAdminDashboard = async () => {
    setLoading(true)
    setError('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Please sign in to access the admin dashboard.')
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    if (!profile || !['staff', 'admin'].includes(profile.role)) {
      setRole(profile?.role || 'member')
      setLoading(false)
      return
    }

    setRole(profile.role)

    const [bookingsResult, membersResult, bookingStats, donationResult, memberStats] =
      await Promise.all([
        supabase
          .from('bookings')
          .select(`
            id,
            resource_id,
            member_id,
            start_time,
            end_time,
            status,
            resources (
              name,
              type
            ),
            profiles (
              full_name
            )
          `)
          .eq('status', 'pending')
          .order('start_time', { ascending: true }),

        supabase
          .from('profiles')
          .select('id, full_name, role, membership_tier, joined_at')
          .order('joined_at', { ascending: false }),

        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .gte(
            'created_at',
            new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
          ),

        supabase
          .from('donations')
          .select('amount'),

        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'member'),
      ])

    if (bookingsResult.error) {
      setError(bookingsResult.error.message)
      setLoading(false)
      return
    }

    if (membersResult.error) {
      setError(membersResult.error.message)
      setLoading(false)
      return
    }

    if (bookingStats.error) {
      setError(bookingStats.error.message)
      setLoading(false)
      return
    }

    if (donationResult.error) {
      setError(donationResult.error.message)
      setLoading(false)
      return
    }

    if (memberStats.error) {
      setError(memberStats.error.message)
      setLoading(false)
      return
    }

    const formattedBookings = (bookingsResult.data || []).map((booking) => ({
      ...booking,
      resources: Array.isArray(booking.resources)
        ? booking.resources[0] || null
        : booking.resources,
      profiles: Array.isArray(booking.profiles)
        ? booking.profiles[0] || null
        : booking.profiles,
    }))

    const totalDonations = (donationResult.data || []).reduce(
      (total, donation) => total + Number(donation.amount || 0),
      0
    )

    setBookings(formattedBookings as Booking[])
    setMembers((membersResult.data || []) as Member[])
    setBookingCount(bookingStats.count || 0)
    setDonationTotal(totalDonations)
    setActiveMembers(memberStats.count || 0)

    setLoading(false)
  }

  const updateBookingStatus = async (
    bookingId: string,
    memberId: string,
    status: 'approved' | 'rejected'
  ) => {
    setMessage('')
    setError('')

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)

    if (updateError) {
      setError(updateError.message)
      return
    }

    const notificationMessage =
      status === 'approved'
        ? 'Your booking request has been approved.'
        : 'Your booking request has been rejected.'

    await supabase.from('notifications').insert({
      user_id: memberId,
      message: notificationMessage,
      read: false,
    })

    setMessage(
      status === 'approved'
        ? 'Booking approved successfully.'
        : 'Booking rejected.'
    )

    await loadAdminDashboard()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredMembers = members.filter((member) =>
    member.full_name
      .toLowerCase()
      .includes(memberSearch.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-gray-200" />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="h-28 rounded-2xl bg-gray-200" />
            <div className="h-28 rounded-2xl bg-gray-200" />
            <div className="h-28 rounded-2xl bg-gray-200" />
          </div>
          <div className="h-64 rounded-2xl bg-gray-200" />
        </div>
      </div>
    )
  }

  if (!['staff', 'admin'].includes(role)) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Access denied
          </h1>

          <p className="mt-3 text-gray-600">
            You do not have permission to access the staff dashboard.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">

        <div>
          <p className="text-sm font-semibold text-blue-600">
            Riverside Community Hub
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage bookings, members and community activity.
          </p>
        </div>

        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Bookings this month
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {bookingCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total donations
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              R {donationTotal.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Active members
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {activeMembers}
            </p>
          </div>

        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Pending bookings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review booking requests waiting for approval.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <p className="font-medium text-gray-900">
                No pending bookings
              </p>

              <p className="mt-1 text-sm text-gray-500">
                All booking requests have been reviewed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {booking.resources?.name || 'Resource'}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        Member:{' '}
                        {booking.profiles?.full_name || 'Unknown member'}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {formatDate(booking.start_time)} ·{' '}
                        {formatTime(booking.start_time)} –{' '}
                        {formatTime(booking.end_time)}
                      </p>

                      {booking.resources?.type && (
                        <p className="mt-1 text-xs capitalize text-gray-400">
                          {booking.resources.type}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          updateBookingStatus(
                            booking.id,
                            booking.member_id,
                            'approved'
                          )
                        }
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateBookingStatus(
                            booking.id,
                            booking.member_id,
                            'rejected'
                          )
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Reject
                      </button>

                    </div>

                  </div>
                </article>
              ))}

            </div>
          )}

        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Member Directory
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View Riverside community members.
              </p>
            </div>

            <div>
              <label
                htmlFor="memberSearch"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Search members
              </label>

              <input
                id="memberSearch"
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search by name"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 sm:w-64"
              />
            </div>

          </div>

          <div className="mt-6 overflow-x-auto">

            <table className="w-full min-w-[650px] text-left">

              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Role</th>
                  <th className="px-3 py-3 font-medium">Membership</th>
                  <th className="px-3 py-3 font-medium">Joined</th>
                </tr>
              </thead>

              <tbody>

                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-100"
                  >
                    <td className="px-3 py-4 font-medium text-gray-900">
                      {member.full_name}
                    </td>

                    <td className="px-3 py-4 capitalize text-gray-600">
                      {member.role}
                    </td>

                    <td className="px-3 py-4 capitalize text-gray-600">
                      {member.membership_tier}
                    </td>

                    <td className="px-3 py-4 text-gray-600">
                      {formatDate(member.joined_at)}
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

            {filteredMembers.length === 0 && (
              <div className="py-8 text-center text-sm text-gray-500">
                No members found.
              </div>
            )}

          </div>

        </section>

      </div>
    </main>
  )
}

export default AdminDashboard