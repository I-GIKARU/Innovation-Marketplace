"use client"

import { Bar, BarChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useAdminDashboard } from "@/hooks/useAdminDashboard"
import { useEffect } from "react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"]

export default function AdminChart() {
  const { dashboardData, loading, error, fetchDashboardData } = useAdminDashboard()

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading charts data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (!dashboardData || !dashboardData.stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No dashboard data available.</p>
      </div>
    )
  }

  const userStats = dashboardData.stats.user_stats
  const projectStats = dashboardData.stats.project_stats
  const orderStats = dashboardData.stats.order_stats

  const userChartData = [
    { name: "Total Users", value: userStats.total },
    { name: "Students", value: userStats.students },
    { name: "Clients", value: userStats.clients },
  ]

  const projectChartData = [
    { name: "Approved", value: projectStats.approved },
    { name: "Pending", value: projectStats.pending },
    { name: "Featured", value: projectStats.featured },
  ]

  const orderChartData = [
    { name: "Total Orders", value: orderStats.total },
    { name: "Completed Orders", value: orderStats.completed },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
          <CardDescription>Overview of different user roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              totalUsers: { label: "Total Users", color: COLORS[0] },
              students: { label: "Students", color: COLORS[1] },
              clients: { label: "Clients", color: COLORS[2] },
            }}
            className="min-h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" fill="currentColor" radius={[4, 4, 0, 0]}>
                  {userChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Statistics</CardTitle>
          <CardDescription>Distribution of project statuses.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ChartContainer
            config={{
              approved: { label: "Approved", color: COLORS[0] },
              pending: { label: "Pending", color: COLORS[1] },
              featured: { label: "Featured", color: COLORS[2] },
            }}
            className="min-h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <Pie
                  data={projectChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {projectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* New Card for Order Statistics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Order Statistics</CardTitle>
          <CardDescription>Overview of total and completed orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              totalOrders: { label: "Total Orders", color: COLORS[0] },
              completedOrders: { label: "Completed Orders", color: COLORS[1] },
            }}
            className="min-h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" fill="currentColor" radius={[4, 4, 0, 0]}>
                  {orderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
