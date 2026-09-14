import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Resource = {
  id: string
  name: string
  type: string
  capacity: number | null
  description: string | null
}

type Booking = {
  id: string
  resource_id: string
  member_id: string
  start_time: string
  end_time: string
  status: string
  created_at: string
  resources?: {
    name: string
    type: string
  } | null
}

function Bookings() {
  const [resources, setResources] = useState<Resource[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedResource, setSelectedResource] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadBookingData()
  }, [])

  const loadBookingData = async () => {
    setLoading(true)
    setError('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Please sign in to manage your bookings.')
      setLoading(false)
      return
    }

    const [resourcesResult, bookingsResult] = await Promise.all([
      supabase
        .from('resources')
        .select('*')
        .order('type')
        .order('name'),

      supabase
        .from('bookings')
        .select(`
          id,
          resource_id,
          member_id,
          start_time,
          end_time,
          status,
          created_at,
          resources (
            name,
            type
          )
        `)
        .eq('member_id', user.id)
        .order('start_time', { ascending: false }),
    ])

    if (resourcesResult.error) {
      setError(resourcesResult.error.message)
      setLoading(false)
      return
    }

    if (bookingsResult.error) {
      setError(bookingsResult.error.message)
      setLoading(false)
      return
    }

    setResources(resourcesResult.data || [])

    const formattedBookings = (bookingsResult.data || []).map((booking) => ({
      ...booking,
      resources: Array.isArray(booking.resources)
        ? booking.resources[0] || null
        : booking.resources,
    }))

    setBookings(formattedBookings as Booking[])
    setLoading(false)
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (!selectedResource || !startTime || !endTime) {
      setError('Please complete all booking fields.')
      return
    }

    const start = new Date(startTime)
    const end = new Date(endTime)

    if (end <= start) {
      setError('End time must be after the start time.')
      return
    }

    setSaving(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Your session has expired. Please sign in again.')
      setSaving(false)
      return
    }

    const { error: bookingError } = await supabase
      .from('bookings')
      .insert({
        resource_id: selectedResource,
        member_id: user.id,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        status: 'pending',
      })

    if (bookingError) {
      if (
        bookingError.message.toLowerCase().includes('overlap') ||
        bookingError.message.toLowerCase().includes('conflict') ||
        bookingError.code === '23P01'
      ) {
        setError(
          'This resource is already booked for the selected time. Please choose another time.'
        )
      } else {
        setError(bookingError.message)
      }

      setSaving(false)
      return
    }

    setMessage(
      'Booking request submitted. It is now waiting for staff approval.'
    )

    setSelectedResource('')
    setStartTime('')
    setEndTime('')

    await loadBookingData()
    setSaving(false)
  }

  const handleCancel = async (bookingId: string) => {
    setMessage('')
    setError('')

    const { error: cancelError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)

    if (cancelError) {
      setError(cancelError.message)
      return
    }

    setMessage('Booking cancelled.')
    await loadBookingData()
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

  const statusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      case 'cancelled':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-amber-100 text-amber-700'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-40 rounded-2xl bg-gray-200" />
          <div className="h-24 rounded-2xl bg-gray-200" />
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Riverside Community Hub
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Book a Resource
          </h1>

          <p className="mt-2 text-gray-600">
            Reserve a room or equipment for your community activities.
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

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            New booking
          </h2>

          <form onSubmit={handleBooking} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="resource"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Resource
              </label>

              <select
                id="resource"
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                required
              >
                <option value="">Select a resource</option>

                {resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} — {resource.type}
                  </option>
                ))}
              </select>
            </div>

            {selectedResource && (
              <div className="rounded-xl bg-gray-50 p-4">
                {(() => {
                  const resource = resources.find(
                    (item) => item.id === selectedResource
                  )

                  if (!resource) return null

                  return (
                    <>
                      <p className="font-semibold text-gray-900">
                        {resource.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {resource.description}
                      </p>

                      {resource.capacity && (
                        <p className="mt-2 text-xs font-medium text-gray-500">
                          Capacity: {resource.capacity} people
                        </p>
                      )}
                    </>
                  )
                })()}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="startTime"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Start time
                </label>

                <input
                  id="startTime"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="endTime"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  End time
                </label>

                <input
                  id="endTime"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? 'Submitting...' : 'Submit booking request'}
            </button>
          </form>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              My bookings
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              View your booking requests and their current status.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="font-medium text-gray-900">
                No bookings yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Your booking requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {booking.resources?.name || 'Resource'}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-600">
                        {formatDate(booking.start_time)}
                      </p>

                      <p className="text-sm text-gray-600">
                        {formatTime(booking.start_time)} –{' '}
                        {formatTime(booking.end_time)}
                      </p>

                      {booking.resources?.type && (
                        <p className="mt-1 text-xs capitalize text-gray-400">
                          {booking.resources.type}
                        </p>
                      )}
                    </div>

                    {['pending', 'approved'].includes(
                      booking.status.toLowerCase()
                    ) && (
                      <button
                        type="button"
                        onClick={() => handleCancel(booking.id)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default Bookings