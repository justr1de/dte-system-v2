import { DTELayout } from "@/components/DTELayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Users,
  FileSpreadsheet,
  LogIn,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  current: number;
  previous: number;
  suffix?: string;
}

function MetricCard({ title, icon, current, previous, suffix = "" }: MetricCardProps) {
  const diff = current - previous;
  const percentChange = previous > 0 ? ((diff / previous) * 100).toFixed(1) : current > 0 ? "100" : "0";
  const isPositive = diff > 0;
  const isNeutral = diff === 0;

  return (
    <Card className="dte-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {current.toLocaleString("pt-BR")}{suffix}
        </div>
        <div className="flex items-center gap-2 mt-2">
          {isNeutral ? (
            <div className="flex items-center text-muted-foreground">
              <Minus className="w-4 h-4 mr-1" />
              <span className="text-sm">Sem alteração</span>
            </div>
          ) : isPositive ? (
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+{percentChange}%</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600 dark:text-red-400">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{percentChange}%</span>
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            vs. período anterior ({previous.toLocaleString("pt-BR")})
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardComparativo() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState<"week" | "month">("week");

  const { data: stats, isLoading, refetch } = trpc.comparative.stats.useQuery(
    { period },
    { enabled: user?.role === "admin" }
  );

  // Redirect non-admin users
  if (!authLoading && (!user || user.role !== "admin")) {
    setLocation("/dashboard");
    return null;
  }

  if (authLoading || isLoading) {
    return (
      <DTELayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-80" />
        </div>
      </DTELayout>
    );
  }

  // Prepare chart data
  const currentDays = stats?.current.activitiesByDay || [];
  const previousDays = stats?.previous.activitiesByDay || [];

  // Merge data for comparison chart
  const chartData = currentDays.map((day, index) => ({
    name: new Date(day.date).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" }),
    atual: Number(day.count),
    anterior: previousDays[index] ? Number(previousDays[index].count) : 0,
  }));

  // Summary comparison data
  const summaryData = [
    {
      name: "Atividades",
      atual: stats?.current.activities || 0,
      anterior: stats?.previous.activities || 0,
    },
    {
      name: "Novos Usuários",
      atual: stats?.current.newUsers || 0,
      anterior: stats?.previous.newUsers || 0,
    },
    {
      name: "Importações",
      atual: stats?.current.imports || 0,
      anterior: stats?.previous.imports || 0,
    },
    {
      name: "Logins",
      atual: stats?.current.logins || 0,
      anterior: stats?.previous.logins || 0,
    },
  ];

  return (
    <DTELayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard Comparativo</h1>
            <p className="text-muted-foreground">
              Compare métricas entre períodos para identificar tendências
            </p>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as "week" | "month")}>
            <TabsList>
              <TabsTrigger value="week" className="gap-2">
                <Calendar className="w-4 h-4" />
                Semanal
              </TabsTrigger>
              <TabsTrigger value="month" className="gap-2">
                <Calendar className="w-4 h-4" />
                Mensal
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Period Info */}
        <Card className="dte-card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Comparação {period === "week" ? "Semanal" : "Mensal"}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {period === "week"
                    ? "Comparando os últimos 7 dias com os 7 dias anteriores"
                    : "Comparando os últimos 30 dias com os 30 dias anteriores"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Atividades"
            icon={<Activity className="w-5 h-5 text-emerald-500" />}
            current={stats?.current.activities || 0}
            previous={stats?.previous.activities || 0}
          />
          <MetricCard
            title="Novos Usuários"
            icon={<Users className="w-5 h-5 text-blue-500" />}
            current={stats?.current.newUsers || 0}
            previous={stats?.previous.newUsers || 0}
          />
          <MetricCard
            title="Importações"
            icon={<FileSpreadsheet className="w-5 h-5 text-amber-500" />}
            current={stats?.current.imports || 0}
            previous={stats?.previous.imports || 0}
          />
          <MetricCard
            title="Logins"
            icon={<LogIn className="w-5 h-5 text-purple-500" />}
            current={stats?.current.logins || 0}
            previous={stats?.previous.logins || 0}
          />
        </div>

        {/* Activity Timeline Chart */}
        <Card className="dte-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Atividades por Dia
            </CardTitle>
            <CardDescription>
              Comparação de atividades diárias entre períodos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="atual"
                    name="Período Atual"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="anterior"
                    name="Período Anterior"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#94a3b8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Comparison Bar Chart */}
        <Card className="dte-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Resumo Comparativo
            </CardTitle>
            <CardDescription>
              Visão geral das métricas entre os dois períodos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="atual"
                    name="Período Atual"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="anterior"
                    name="Período Anterior"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="dte-card">
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>Análise automática das tendências</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summaryData.map((metric) => {
                const diff = metric.atual - metric.anterior;
                const percentChange =
                  metric.anterior > 0
                    ? ((diff / metric.anterior) * 100).toFixed(1)
                    : metric.atual > 0
                    ? "100"
                    : "0";
                const isPositive = diff > 0;
                const isNeutral = diff === 0;

                return (
                  <div
                    key={metric.name}
                    className={`p-4 rounded-lg border ${
                      isNeutral
                        ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                        : isPositive
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                        : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isNeutral ? (
                        <Minus className="w-5 h-5 text-gray-500" />
                      ) : isPositive ? (
                        <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                      <span className="font-medium">{metric.name}</span>
                    </div>
                    <p
                      className={`text-sm ${
                        isNeutral
                          ? "text-gray-600 dark:text-gray-400"
                          : isPositive
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {isNeutral
                        ? "Sem alteração significativa no período"
                        : isPositive
                        ? `Aumento de ${percentChange}% em relação ao período anterior`
                        : `Redução de ${Math.abs(Number(percentChange))}% em relação ao período anterior`}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DTELayout>
  );
}
