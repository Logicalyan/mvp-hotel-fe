// app/hotel/dashboard/[id]/page.jsx
"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import {
  CalendarIcon, Hotel, BedDouble, Users, DollarSign,
  TrendingUp, TrendingDown, Activity, AlertCircle, RefreshCw,
  Inbox,
  CalendarDays,
  LucideBookMarked,
  BookOpen
} from "lucide-react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Services
import { getHotelDashboard } from "@/lib/services/dashboard"
import { getHotelById } from "@/lib/services/hotel"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function HotelDashboardPage() {
  const params = useParams()
  const hotelId = parseInt(params.id)
  const { hotelId: authHotelId, role, loading: authLoading, user } = useAuth()

  const [hotel, setHotel] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accessDenied, setAccessDenied] = useState(false)

  // Date filters
  // STATE BARU: Pisahkan "sedang dipilih" dan "sudah diterapkan"
  const [tempStartDate, setTempStartDate] = useState(null)   // sementara di popover
  const [tempEndDate, setTempEndDate] = useState(null)       // sementara di popover
  const [appliedStartDate, setAppliedStartDate] = useState(null) // yang dipakai fetch
  const [appliedEndDate, setAppliedEndDate] = useState(null)     // yang dipakai fetch
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // SECURITY: Validasi akses hotel
  useEffect(() => {
    if (!authLoading && role === 'hotel') {
      if (authHotelId && hotelId !== authHotelId) {
        console.error('Access denied: trying to access different hotel dashboard')
        setAccessDenied(true)
      }
    }
  }, [authLoading, role, hotelId, authHotelId])

  // Fetch data hanya ketika applied date berubah
  useEffect(() => {
    if (accessDenied || !hotelId) return
    loadDashboard()
  }, [hotelId, accessDenied, appliedStartDate, appliedEndDate])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters = {}
      if (appliedStartDate) filters.start_date = format(appliedStartDate, 'yyyy-MM-dd')
      if (appliedEndDate) filters.end_date = format(appliedEndDate, 'yyyy-MM-dd')

      const [hotelData, dashData] = await Promise.all([
        getHotelById(hotelId),
        getHotelDashboard(hotelId, filters)
      ])

      setHotel(hotelData)
      setDashboardData(dashData)
    } catch (err) {
      console.error("Failed to load dashboard:", err)
      setError(err.response?.data?.message || err.message || "Failed to load dashboard data")
      toast.error("Gagal memuat dashboard", {
        description: err.response?.data?.message || "Silakan coba lagi"
      })
    } finally {
      setLoading(false)
    }
  }

  // Apply filter (dipanggil saat klik tombol Apply)
  const applyFilters = () => {
    setAppliedStartDate(tempStartDate)
    setAppliedEndDate(tempEndDate)
    setIsFilterOpen(false)
  }

  // Clear semua filter
  const clearFilters = () => {
    setTempStartDate(null)
    setTempEndDate(null)
    setAppliedStartDate(null)
    setAppliedEndDate(null)
  }

  // Quick filter langsung apply
  const applyQuickFilter = (days) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days + 1)

    setTempStartDate(start)
    setTempEndDate(end)
    setAppliedStartDate(start)
    setAppliedEndDate(end)
    setIsFilterOpen(false)
  }

  // Tampilan teks pada tombol filter
  const hasActiveFilter = appliedStartDate || appliedEndDate
  const filterDisplayText = hasActiveFilter
    ? `${format(appliedStartDate || new Date(), "dd MMM", { locale: idLocale })} - ${format(appliedEndDate || appliedStartDate, "dd MMM yyyy", { locale: idLocale })}`
    : "Pilih rentang tanggal"

  // ✅ Loading state
  if (authLoading || loading) {
    return <DashboardSkeleton />
  }

  // ✅ Access denied
  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="text-gray-600 mt-2">You dont have permission to access this hotel.</p>
        <Link href="/dashboard">
          <Button className="mt-4">Go to Dashboard</Button>
        </Link>
      </div>
    )
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Dashboard</AlertTitle>
          <AlertDescription className="mt-2">
            {error}
          </AlertDescription>
        </Alert>
        <div className="flex gap-2 mt-4">
          <Button onClick={loadDashboard} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
          <Link href={`/hotel/dashboard/${hotelId}/room-types`}>
            <Button variant="secondary">
              Go to Room Types
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // ✅ VALIDATION: Safe data extraction with fallbacks
  const stats = {
    totalRooms: dashboardData?.stats?.totalRooms ?? 0,
    totalBookings: dashboardData?.stats?.totalBookings ?? 0,
    totalRevenue: dashboardData?.stats?.totalRevenue ?? 0,
    occupancyRate: dashboardData?.stats?.occupancyRate ?? 0,
    totalGuests: dashboardData?.stats?.totalGuests ?? 0,
    revenueGrowth: dashboardData?.stats?.revenueGrowth ?? 0,
    bookingsGrowth: dashboardData?.stats?.bookingsGrowth ?? 0,
    occupancyGrowth: dashboardData?.stats?.occupancyGrowth ?? 0,
    guestsGrowth: dashboardData?.stats?.guestsGrowth ?? 0,
  }

  const revenueData = dashboardData?.revenue_chart || []
  const bookingData = dashboardData?.booking_chart || []
  const roomTypeData = dashboardData?.room_types_distribution || []
  const recentActivities = dashboardData?.recent_activities || []

  // ✅ Helper untuk format trend
  const formatTrend = (value) => {
    if (!value || value === 0) return null
    const isPositive = value > 0
    return {
      value: Math.abs(value),
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-green-500' : 'text-red-500'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header + Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang kembali, {user?.name || 'Pengguna'}! Berikut performa {hotel?.name || 'hotel Anda'}.
          </p>
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("justify-start text-left font-normal", !hasActiveFilter && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filterDisplayText}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
              <div className="space-y-4">
                {/* Quick Filters */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Filter Cepat</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => applyQuickFilter(7)}>7 Hari Terakhir</Button>
                    <Button size="sm" variant="outline" onClick={() => applyQuickFilter(30)}>30 Hari Terakhir</Button>
                    <Button size="sm" variant="outline" onClick={() => applyQuickFilter(90)}>90 Hari Terakhir</Button>
                  </div>
                </div>

                {/* Custom Range */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Rentang Kustom</h4>
                  <Calendar
                    mode="range"
                    selected={{ from: tempStartDate, to: tempEndDate }}
                    onSelect={(range) => {
                      setTempStartDate(range?.from || null)
                      setTempEndDate(range?.to || null)
                    }}
                    numberOfMonths={2}
                    locale={idLocale}
                  />
                </div>

                {/* Apply & Clear */}
                <div className="flex justify-between pt-2 border-t">
                  <Button size="sm" variant="ghost" onClick={clearFilters}>
                    Clear
                  </Button>
                  <Button size="sm" onClick={applyFilters}>
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilter && (
            <Button size="sm" variant="ghost" onClick={clearFilters}>
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue > 0
                ? `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`
                : 'Rp 0'
              }
            </div>
            {formatTrend(stats.revenueGrowth) && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {(() => {
                  const trend = formatTrend(stats.revenueGrowth)
                  const Icon = trend.icon
                  return (
                    <>
                      <Icon className={`h-3 w-3 ${trend.color}`} />
                      <span className={trend.color}>
                        {trend.isPositive ? '+' : '-'}{trend.value.toFixed(1)}%
                      </span>
                      <span>from last period</span>
                    </>
                  )
                })()}
              </p>
            )}
            {!formatTrend(stats.revenueGrowth) && (
              <p className="text-xs text-muted-foreground mt-1">
                No comparison data
              </p>
            )}
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <CalendarDays className="h-4 w-4 text  -muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            {formatTrend(stats.bookingsGrowth) && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {(() => {
                  const trend = formatTrend(stats.bookingsGrowth)
                  const Icon = trend.icon
                  return (
                    <>
                      <Icon className={`h-3 w-3 ${trend.color}`} />
                      <span className={trend.color}>
                        {trend.isPositive ? '+' : '-'}{trend.value.toFixed(1)}%
                      </span>
                      <span>from last period</span>
                    </>
                  )
                })()}
              </p>
            )}
            {!formatTrend(stats.bookingsGrowth) && (
              <p className="text-xs text-muted-foreground mt-1">
                No comparison data
              </p>
            )}
          </CardContent>
        </Card>

        {/* Occupancy Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Occupancy Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.occupancyRate > 0
                ? `${stats.occupancyRate.toFixed(1)}%`
                : '0%'
              }
            </div>
            {formatTrend(stats.occupancyGrowth) && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {(() => {
                  const trend = formatTrend(stats.occupancyGrowth)
                  const Icon = trend.icon
                  return (
                    <>
                      <Icon className={`h-3 w-3 ${trend.color}`} />
                      <span className={trend.color}>
                        {trend.isPositive ? '+' : '-'}{trend.value.toFixed(1)}%
                      </span>
                      <span>from last period</span>
                    </>
                  )
                })()}
              </p>
            )}
            {!formatTrend(stats.occupancyGrowth) && (
              <p className="text-xs text-muted-foreground mt-1">
                No comparison data
              </p>
            )}
          </CardContent>
        </Card>

        {/* Total Guests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Guests
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
            {formatTrend(stats.guestsGrowth) && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {(() => {
                  const trend = formatTrend(stats.guestsGrowth)
                  const Icon = trend.icon
                  return (
                    <>
                      <Icon className={`h-3 w-3 ${trend.color}`} />
                      <span className={trend.color}>
                        {trend.isPositive ? '+' : '-'}{trend.value.toFixed(1)}%
                      </span>
                      <span>from last period</span>
                    </>
                  )
                })()}
              </p>
            )}
            {!formatTrend(stats.guestsGrowth) && (
              <p className="text-xs text-muted-foreground mt-1">
                No comparison data
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              {revenueData.length > 0
                ? `Revenue data for ${revenueData.length} period${revenueData.length !== 1 ? 's' : ''}`
                : 'No revenue data available'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `Rp ${Number(value).toLocaleString('id-ID')}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState
                icon={DollarSign}
                title="No Revenue Data"
                description="Revenue data will appear here once bookings are made"
              />
            )}
          </CardContent>
        </Card>

        {/* Bookings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings Overview</CardTitle>
            <CardDescription>
              {bookingData.length > 0
                ? `Booking data for ${bookingData.length} period${bookingData.length !== 1 ? 's' : ''}`
                : 'No booking data available'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#82ca9d" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState
                icon={Hotel}
                title="No Booking Data"
                description="Booking statistics will appear here once bookings are created"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Room Types Distribution & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Room Types Distribution */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Room Types Distribution</CardTitle>
            <CardDescription>
              {roomTypeData.length > 0
                ? `${roomTypeData.length} room type${roomTypeData.length !== 1 ? 's' : ''} in your hotel`
                : 'No room types available'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {roomTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roomTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roomTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState
                icon={BedDouble}
                title="No Room Types"
                description="Start by creating room types for your hotel"
                action={
                  <Link href={`/hotel/dashboard/${hotelId}/room-types/create`}>
                    <Button size="sm" className="mt-4">
                      Create Room Type
                    </Button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your hotel efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href={`/hotel/dashboard/${hotelId}/room-types`}>
              <Button className="w-full justify-start" variant="outline">
                <BedDouble className="mr-2 h-4 w-4" />
                Manage Room Types
              </Button>
            </Link>
            <Link href={`/hotel/dashboard/${hotelId}/reservations`}>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Managed Reservations
              </Button>
            </Link>
            <Link href={`/hotel/dashboard/${hotelId}/rooms`}>
              <Button className="w-full justify-start" variant="outline">
                <BedDouble className="mr-2 h-4 w-4" />
                Manage Rooms
              </Button>
            </Link>
            <Link href={`/hotel/dashboard/${hotelId}/reports`}>
              <Button className="w-full justify-start" variant="outline">
                <Activity className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            {recentActivities.length > 0
              ? 'Latest updates and activities in your hotel'
              : 'No recent activities'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0">
                  <div className="mt-1">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.action || 'Unknown action'}</p>
                      {activity.badge && (
                        <Badge variant={activity.badge} className="text-xs">
                          {activity.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.description || 'No description'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time || 'Recently'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Inbox}
              title="No Recent Activity"
              description="Activities will appear here as they happen"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ✅ Empty Chart State Component
function EmptyChartState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
      <Icon className="h-12 w-12 text-muted-foreground mb-3" />
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ✅ Empty State Component
function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icon className="h-10 w-10 text-muted-foreground mb-3" />
      <h3 className="font-semibold text-base mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
    </div>
  )
}

// Skeleton Loading Component
function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}