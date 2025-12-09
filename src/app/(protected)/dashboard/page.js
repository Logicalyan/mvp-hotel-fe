"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BedDouble,
  Users,
  DollarSign,
  Activity,
  BookOpen,
  Hotel,
} from "lucide-react"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

// ======================================================
// DUMMY DATA
// ======================================================
const provinces = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau",
  "Jambi", "Sumatera Selatan", "Bangka Belitung", "Bengkulu", "Lampung",
  "DKI Jakarta", "Banten", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta",
  "Jawa Timur", "Bali", "NTB", "NTT",
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan",
  "Kalimantan Timur", "Kalimantan Utara",
  "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Selatan",
  "Sulawesi Tenggara", "Sulawesi Barat",
  "Maluku", "Maluku Utara",
  "Papua", "Papua Barat", "Papua Barat Daya", "Papua Pegunungan",
  "Papua Tengah", "Papua Selatan"
]

// Gunakan warna KOLEKSI agar legend tetap konsisten
const colors = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#a4de6c",
  "#d0ed57", "#d885f1", "#f19cbb", "#a6cee3", "#1f78b4", "#b2df8a",
  "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff8400", "#cab2d6",
  "#6a3d9a", "#ffff99", "#b15928"
]

// Hotels by province (Pie + Bar memakai data yang sama)
const dummyHotelProvinceDist = provinces.map((p, index) => ({
  name: p,
  value: Math.floor(Math.random() * 20) + 1,
  color: colors[index % colors.length],
}))

const dummyStats = {
  totalRevenue: 150000000,
  totalReservations: 120,
  totalTransactions: 75,
  totalUsers: 340,
  totalHotels: 42,
}

const dummyRevenue = [
  { month: "Jan", revenue: 12000000 },
  { month: "Feb", revenue: 13500000 },
  { month: "Mar", revenue: 16000000 },
]

const dummyUsersByRole = [
  { role: "Admin", total: 10, color: "#8884d8" },
  { role: "Hotel", total: 25, color: "#82ca9d" },
  { role: "Customer", total: 305, color: "#ffc658" },
]

const dummyActivities = [
  { type: "reservation", message: "New reservation created", date: "2025-02-01" },
  { type: "transaction", message: "Transaction completed", date: "2025-02-02" },
]

// ======================================================
// MAIN PAGE
// ======================================================
export default function DashboardPage() {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading])

  if (loading || !user) return <p>Loading...</p>

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user.name}! Berikut ringkasan sistem Anda.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" icon={<DollarSign />} value={`Rp ${dummyStats.totalRevenue.toLocaleString()}`} />
        <StatCard title="Total Reservations" icon={<BookOpen />} value={dummyStats.totalReservations} />
        <StatCard title="Total Transactions" icon={<Activity />} value={dummyStats.totalTransactions} />
        <StatCard title="Total Users" icon={<Users />} value={dummyStats.totalUsers} />
        <StatCard title="Total Hotels" icon={<Hotel />} value={dummyStats.totalHotels} />
      </div>

      {/* Revenue + User Roles Chart */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Revenue Overview">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="User Role Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyUsersByRole}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total">
                {dummyUsersByRole.map((item, i) => (
                  <Cell key={i} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ======================================================
     HOTELS BY PROVINCE — PIE (ATAS) + BAR (BAWAH)
====================================================== */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Hotels by Province</CardTitle>
        </CardHeader>

        <CardContent className="space-y-10">

          {/* ================= PIE CHART (TOP) ================= */}
          <div className="w-full">
            <ResponsiveContainer
              width="100%"
              height={1080}   // BESAR seperti keinginanmu
            >
              <PieChart>
                <Pie
                  data={dummyHotelProvinceDist}
                  cx="50%"
                  cy="45%"               // sedikit naik agar legend muat
                  outerRadius="80%"      // responsive lebih halus
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {dummyHotelProvinceDist.map((prov, i) => (
                    <Cell key={i} fill={prov.color} />
                  ))}
                </Pie>

                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    fontSize: "12px",
                    paddingTop: "20px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "16px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ================= BAR CHART (BOTTOM) ================= */}
          <div className="w-full">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dummyHotelProvinceDist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />

                <Bar dataKey="value">
                  {dummyHotelProvinceDist.map((prov, i) => (
                    <Cell key={i} fill={prov.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </CardContent>
      </Card>


      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {dummyActivities.map((a, i) => (
            <div key={i} className="border-b py-3">
              <p className="font-medium">{a.message}</p>
              <p className="text-xs text-muted-foreground">{a.date}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ======================================================
// COMPONENTS
// ======================================================
function StatCard({ title, icon, value }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function ChartCard({ title, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
