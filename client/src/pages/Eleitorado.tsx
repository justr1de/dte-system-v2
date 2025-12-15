import { DTELayout } from "@/components/DTELayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toLocaleString("pt-BR");
}

export default function Eleitorado() {
  const [anoSelecionado, setAnoSelecionado] = useState("2024");
  const { data: demoData } = trpc.demo.getData.useQuery({ dataType: "eleitorado_demo" });

  const eleitoradoDemo = demoData?.[0]?.dataContent as any;

  // Demo data
  const totalEleitores = eleitoradoDemo?.totalEleitores || 245678;
  const masculino = eleitoradoDemo?.masculino || 118234;
  const feminino = eleitoradoDemo?.feminino || 127444;

  const faixaEtariaData = eleitoradoDemo?.faixasEtarias
    ? Object.entries(eleitoradoDemo.faixasEtarias).map(([faixa, valor]) => ({
        faixa,
        eleitores: valor as number,
        percentual: ((valor as number) / totalEleitores * 100).toFixed(1),
      }))
    : [
        { faixa: "16-17", eleitores: 4521, percentual: "1.8" },
        { faixa: "18-24", eleitores: 32456, percentual: "13.2" },
        { faixa: "25-34", eleitores: 48923, percentual: "19.9" },
        { faixa: "35-44", eleitores: 52341, percentual: "21.3" },
        { faixa: "45-59", eleitores: 58234, percentual: "23.7" },
        { faixa: "60-69", eleitores: 32145, percentual: "13.1" },
        { faixa: "70+", eleitores: 17058, percentual: "6.9" },
      ];

  const escolaridadeData = eleitoradoDemo?.escolaridade
    ? Object.entries(eleitoradoDemo.escolaridade).map(([nivel, valor]) => ({
        name: nivel.charAt(0).toUpperCase() + nivel.slice(1),
        value: valor as number,
        percentual: ((valor as number) / totalEleitores * 100).toFixed(1),
      }))
    : [
        { name: "Analfabeto", value: 8234, percentual: "3.4" },
        { name: "Fundamental", value: 45678, percentual: "18.6" },
        { name: "Médio", value: 98234, percentual: "40.0" },
        { name: "Superior", value: 93532, percentual: "38.1" },
      ];

  const generoData = [
    { name: "Masculino", value: masculino, percentual: ((masculino / totalEleitores) * 100).toFixed(1) },
    { name: "Feminino", value: feminino, percentual: ((feminino / totalEleitores) * 100).toFixed(1) },
  ];

  const rendaData = [
    { faixa: "Até 1 SM", eleitores: 45678, percentual: "18.6" },
    { faixa: "1-2 SM", eleitores: 78234, percentual: "31.8" },
    { faixa: "2-5 SM", eleitores: 65432, percentual: "26.6" },
    { faixa: "5-10 SM", eleitores: 35678, percentual: "14.5" },
    { faixa: "10+ SM", eleitores: 20656, percentual: "8.4" },
  ];

  const evolucaoData = [
    { ano: "2018", eleitores: 228456 },
    { ano: "2020", eleitores: 235678 },
    { ano: "2022", eleitores: 241234 },
    { ano: "2024", eleitores: 245678 },
  ];

  return (
    <DTELayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Perfil do Eleitorado</h1>
            <p className="text-muted-foreground">
              Análise demográfica detalhada dos eleitores
            </p>
          </div>
          <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">Eleição 2024</SelectItem>
              <SelectItem value="2022">Eleição 2022</SelectItem>
              <SelectItem value="2020">Eleição 2020</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Eleitores</p>
                  <p className="text-3xl font-bold">{formatNumber(totalEleitores)}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+1.8% vs 2022</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Eleitores Masculinos</p>
                  <p className="text-3xl font-bold">{formatNumber(masculino)}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {((masculino / totalEleitores) * 100).toFixed(1)}% do total
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 border-pink-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Eleitoras Femininas</p>
                  <p className="text-3xl font-bold">{formatNumber(feminino)}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {((feminino / totalEleitores) * 100).toFixed(1)}% do total
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-pink-500/10">
                  <Users className="w-6 h-6 text-pink-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Faixa Etária */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Faixa Etária</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={faixaEtariaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="faixa" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(value) => formatNumber(value)} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value.toLocaleString("pt-BR")} eleitores`,
                        "Total",
                      ]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="eleitores" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gênero */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Gênero</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#ec4899" />
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString("pt-BR"), "Eleitores"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend
                      formatter={(value, entry: any) => (
                        <span className="text-sm">
                          {value} ({entry.payload.percentual}%)
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Escolaridade */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Escolaridade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={escolaridadeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percentual }) => `${name}: ${percentual}%`}
                      labelLine={true}
                    >
                      {escolaridadeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString("pt-BR"), "Eleitores"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Renda */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Renda Per Capita</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rendaData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tickFormatter={(value) => formatNumber(value)} />
                    <YAxis type="category" dataKey="faixa" className="text-xs" />
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString("pt-BR"), "Eleitores"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="eleitores" radius={[0, 4, 4, 0]}>
                      {rendaData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evolução do Eleitorado */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Eleitorado ao Longo dos Anos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolucaoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorEleitores" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="ano" />
                  <YAxis tickFormatter={(value) => formatNumber(value)} />
                  <Tooltip
                    formatter={(value: number) => [value.toLocaleString("pt-BR"), "Eleitores"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="eleitores"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEleitores)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DTELayout>
  );
}
