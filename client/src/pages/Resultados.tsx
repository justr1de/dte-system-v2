import { DTELayout } from "@/components/DTELayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Award, BarChart3, TrendingUp, Users } from "lucide-react";
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
  LineChart,
  Line,
} from "recharts";

const PARTY_COLORS: Record<string, string> = {
  PT: "#e11d48",
  PL: "#1d4ed8",
  MDB: "#16a34a",
  PSDB: "#eab308",
  PP: "#7c3aed",
  UNIÃO: "#0891b2",
  PSD: "#f97316",
  REPUBLICANOS: "#06b6d4",
  PDT: "#dc2626",
  OUTROS: "#6b7280",
};

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toLocaleString("pt-BR");
}

export default function Resultados() {
  const [anoSelecionado, setAnoSelecionado] = useState("2024");
  const [cargoSelecionado, setCargoSelecionado] = useState("prefeito");
  const { data: demoResultados } = trpc.demo.getData.useQuery({ dataType: "resultados_demo" });

  // Demo data for parties
  const partidosData = [
    { sigla: "PT", votos: 45678, percentual: 20.5, cor: PARTY_COLORS.PT },
    { sigla: "PL", votos: 42345, percentual: 19.0, cor: PARTY_COLORS.PL },
    { sigla: "MDB", votos: 38234, percentual: 17.2, cor: PARTY_COLORS.MDB },
    { sigla: "PSDB", votos: 28456, percentual: 12.8, cor: PARTY_COLORS.PSDB },
    { sigla: "PP", votos: 22345, percentual: 10.0, cor: PARTY_COLORS.PP },
    { sigla: "UNIÃO", votos: 18234, percentual: 8.2, cor: PARTY_COLORS.UNIÃO },
    { sigla: "PSD", votos: 15678, percentual: 7.0, cor: PARTY_COLORS.PSD },
    { sigla: "OUTROS", votos: 11766, percentual: 5.3, cor: PARTY_COLORS.OUTROS },
  ];

  // Demo data for candidates
  const candidatosData = [
    { nome: "Candidato A", partido: "PT", votos: 45678, percentual: 20.5 },
    { nome: "Candidato B", partido: "PL", votos: 42345, percentual: 19.0 },
    { nome: "Candidato C", partido: "MDB", votos: 38234, percentual: 17.2 },
    { nome: "Candidato D", partido: "PSDB", votos: 28456, percentual: 12.8 },
    { nome: "Candidato E", partido: "PP", votos: 22345, percentual: 10.0 },
  ];

  // Demo data for comparison across years
  const comparacaoData = [
    { ano: "2020", PT: 42345, PL: 38234, MDB: 35678, PSDB: 25456, PP: 20345 },
    { ano: "2022", PT: 44567, PL: 40234, MDB: 36789, PSDB: 26789, PP: 21456 },
    { ano: "2024", PT: 45678, PL: 42345, MDB: 38234, PSDB: 28456, PP: 22345 },
  ];

  // Demo data for evolution
  const evolucaoPartidosData = [
    { ano: "2016", PT: 18.5, PL: 12.3, MDB: 22.1, PSDB: 15.6 },
    { ano: "2018", PT: 19.2, PL: 14.5, MDB: 20.8, PSDB: 14.2 },
    { ano: "2020", PT: 19.8, PL: 16.2, MDB: 19.5, PSDB: 13.5 },
    { ano: "2022", PT: 20.1, PL: 18.5, MDB: 18.2, PSDB: 12.8 },
    { ano: "2024", PT: 20.5, PL: 19.0, MDB: 17.2, PSDB: 12.8 },
  ];

  const totalVotos = partidosData.reduce((acc, p) => acc + p.votos, 0);

  return (
    <DTELayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resultados Eleitorais</h1>
            <p className="text-muted-foreground">
              Análise detalhada dos resultados por partido e candidato
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={cargoSelecionado} onValueChange={setCargoSelecionado}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prefeito">Prefeito</SelectItem>
                <SelectItem value="vereador">Vereador</SelectItem>
                <SelectItem value="governador">Governador</SelectItem>
                <SelectItem value="deputado_estadual">Dep. Estadual</SelectItem>
                <SelectItem value="deputado_federal">Dep. Federal</SelectItem>
                <SelectItem value="senador">Senador</SelectItem>
              </SelectContent>
            </Select>
            <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Votos</p>
                  <p className="text-3xl font-bold">{formatNumber(totalVotos)}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Partido Líder</p>
                  <p className="text-3xl font-bold">{partidosData[0].sigla}</p>
                  <p className="text-xs text-muted-foreground mt-1">{partidosData[0].percentual}% dos votos</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <Award className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Candidatos</p>
                  <p className="text-3xl font-bold">{candidatosData.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Concorrentes</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Users className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Partidos</p>
                  <p className="text-3xl font-bold">{partidosData.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Com representação</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="partidos" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="partidos">Por Partido</TabsTrigger>
            <TabsTrigger value="candidatos">Por Candidato</TabsTrigger>
            <TabsTrigger value="comparacao">Comparação</TabsTrigger>
          </TabsList>

          {/* Por Partido */}
          <TabsContent value="partidos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Votação por Partido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={partidosData} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" tickFormatter={(value) => formatNumber(value)} />
                        <YAxis type="category" dataKey="sigla" />
                        <Tooltip
                          formatter={(value: number) => [value.toLocaleString("pt-BR"), "Votos"]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="votos" radius={[0, 4, 4, 0]}>
                          {partidosData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cor} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição Percentual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={partidosData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="votos"
                        >
                          {partidosData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cor} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string, props: any) => [
                            `${value.toLocaleString("pt-BR")} (${props.payload.percentual}%)`,
                            props.payload.sigla,
                          ]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend
                          formatter={(value, entry: any) => entry.payload.sigla}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Party Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhamento por Partido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-sm">Posição</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">Partido</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Votos</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Percentual</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">Representação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partidosData.map((partido, index) => (
                        <tr key={partido.sigla} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: partido.cor }}
                              />
                              <span className="font-medium">{partido.sigla}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            {partido.votos.toLocaleString("pt-BR")}
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            {partido.percentual}%
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${partido.percentual}%`,
                                  backgroundColor: partido.cor,
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Por Candidato */}
          <TabsContent value="candidatos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ranking de Candidatos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidatosData.map((candidato, index) => (
                    <div
                      key={candidato.nome}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}º
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{candidato.nome}</span>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: PARTY_COLORS[candidato.partido] || "#6b7280" }}
                          >
                            {candidato.partido}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{candidato.votos.toLocaleString("pt-BR")} votos</span>
                          <span>{candidato.percentual}%</span>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${candidato.percentual}%`,
                              backgroundColor: PARTY_COLORS[candidato.partido] || "#6b7280",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparação */}
          <TabsContent value="comparacao" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução da Votação por Partido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolucaoPartidosData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="ano" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, ""]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="PT" stroke={PARTY_COLORS.PT} strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="PL" stroke={PARTY_COLORS.PL} strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="MDB" stroke={PARTY_COLORS.MDB} strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="PSDB" stroke={PARTY_COLORS.PSDB} strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparação entre Eleições</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparacaoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="ano" />
                      <YAxis tickFormatter={(value) => formatNumber(value)} />
                      <Tooltip
                        formatter={(value: number) => [value.toLocaleString("pt-BR"), "Votos"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="PT" fill={PARTY_COLORS.PT} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="PL" fill={PARTY_COLORS.PL} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="MDB" fill={PARTY_COLORS.MDB} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="PSDB" fill={PARTY_COLORS.PSDB} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="PP" fill={PARTY_COLORS.PP} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DTELayout>
  );
}
