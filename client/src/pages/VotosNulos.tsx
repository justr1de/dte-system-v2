import { DTELayout } from "@/components/DTELayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, Ban, MinusCircle, TrendingDown, TrendingUp, Users } from "lucide-react";
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
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";

const COLORS = {
  nulos: "#ef4444",
  brancos: "#94a3b8",
  abstencoes: "#f59e0b",
  validos: "#22c55e",
};

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toLocaleString("pt-BR");
}

export default function VotosNulos() {
  const [anoSelecionado, setAnoSelecionado] = useState("2024");
  const [cargoSelecionado, setCargoSelecionado] = useState("prefeito");
  const { data: demoVotos } = trpc.demo.getData.useQuery({ dataType: "votos_nulos_brancos_demo" });
  const { data: demoBairros } = trpc.demo.getData.useQuery({ dataType: "bairros_demo" });

  // Demo data
  const votosDemo = demoVotos?.[0]?.dataContent as any;
  const bairrosDemo = (demoBairros?.[0]?.dataContent as any) || [];

  const totalAptos = 245678;
  const totalNulos = 10123;
  const totalBrancos = 6543;
  const totalAbstencoes = 30345;
  const comparecimento = totalAptos - totalAbstencoes;
  const votosValidos = comparecimento - totalNulos - totalBrancos;

  // Percentuais
  const percNulos = ((totalNulos / comparecimento) * 100).toFixed(1);
  const percBrancos = ((totalBrancos / comparecimento) * 100).toFixed(1);
  const percAbstencoes = ((totalAbstencoes / totalAptos) * 100).toFixed(1);
  const percComparecimento = ((comparecimento / totalAptos) * 100).toFixed(1);

  // Dados para gráfico de pizza
  const composicaoVotosData = [
    { name: "Votos Válidos", value: votosValidos, color: COLORS.validos },
    { name: "Votos Nulos", value: totalNulos, color: COLORS.nulos },
    { name: "Votos Brancos", value: totalBrancos, color: COLORS.brancos },
  ];

  const participacaoData = [
    { name: "Comparecimento", value: comparecimento, color: COLORS.validos },
    { name: "Abstenções", value: totalAbstencoes, color: COLORS.abstencoes },
  ];

  // Evolução ao longo dos anos
  const evolucaoData = votosDemo?.dados || [
    { ano: 2020, nulos: 12345, brancos: 8765, abstencoes: 34567, aptos: 230000 },
    { ano: 2022, nulos: 11234, brancos: 7654, abstencoes: 32456, aptos: 238000 },
    { ano: 2024, nulos: 10123, brancos: 6543, abstencoes: 30345, aptos: 245678 },
  ];

  // Dados por bairro
  const bairrosData = Array.isArray(bairrosDemo)
    ? bairrosDemo.map((b: any) => ({
        nome: b.nome,
        nulos: b.nulos,
        brancos: b.brancos,
        total: b.nulos + b.brancos,
        percentual: (((b.nulos + b.brancos) / b.eleitores) * 100).toFixed(1),
      }))
    : [
        { nome: "Centro", nulos: 1234, brancos: 876, total: 2110, percentual: "8.2" },
        { nome: "Nova Porto Velho", nulos: 987, brancos: 654, total: 1641, percentual: "9.0" },
        { nome: "Embratel", nulos: 876, brancos: 543, total: 1419, percentual: "9.1" },
        { nome: "Caiari", nulos: 765, brancos: 432, total: 1197, percentual: "9.7" },
        { nome: "São Cristóvão", nulos: 654, brancos: 321, total: 975, percentual: "8.7" },
        { nome: "Arigolândia", nulos: 543, brancos: 210, total: 753, percentual: "7.6" },
        { nome: "Pedrinhas", nulos: 432, brancos: 198, total: 630, percentual: "7.2" },
        { nome: "Tancredo Neves", nulos: 321, brancos: 187, total: 508, percentual: "6.6" },
      ];

  // Dados por zona eleitoral
  const zonasData = [
    { zona: "1ª Zona", nulos: 2345, brancos: 1234, total: 3579, percentual: "8.5" },
    { zona: "2ª Zona", nulos: 2123, brancos: 1098, total: 3221, percentual: "7.9" },
    { zona: "3ª Zona", nulos: 1987, brancos: 987, total: 2974, percentual: "8.2" },
    { zona: "4ª Zona", nulos: 1876, brancos: 876, total: 2752, percentual: "7.6" },
    { zona: "5ª Zona", nulos: 1792, brancos: 348, total: 2140, percentual: "9.1" },
  ];

  // Evolução percentual
  const evolucaoPercentualData = evolucaoData.map((d: any) => ({
    ano: d.ano.toString(),
    nulos: ((d.nulos / (d.aptos - d.abstencoes)) * 100).toFixed(1),
    brancos: ((d.brancos / (d.aptos - d.abstencoes)) * 100).toFixed(1),
    abstencoes: ((d.abstencoes / d.aptos) * 100).toFixed(1),
  }));

  return (
    <DTELayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Votos Nulos e Brancos</h1>
            <p className="text-muted-foreground">
              Rastreamento e análise de votos nulos, brancos e abstenções
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Votos Nulos</p>
                  <p className="text-3xl font-bold text-red-600">{formatNumber(totalNulos)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{percNulos}% do comparecimento</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    <TrendingDown className="w-3 h-3" />
                    <span>-9.9% vs 2022</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-red-500/10">
                  <Ban className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-500/10 to-slate-500/5 border-slate-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Votos Brancos</p>
                  <p className="text-3xl font-bold text-slate-600">{formatNumber(totalBrancos)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{percBrancos}% do comparecimento</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    <TrendingDown className="w-3 h-3" />
                    <span>-14.5% vs 2022</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-500/10">
                  <MinusCircle className="w-6 h-6 text-slate-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Abstenções</p>
                  <p className="text-3xl font-bold text-amber-600">{formatNumber(totalAbstencoes)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{percAbstencoes}% dos aptos</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    <TrendingDown className="w-3 h-3" />
                    <span>-6.5% vs 2022</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Comparecimento</p>
                  <p className="text-3xl font-bold text-emerald-600">{percComparecimento}%</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatNumber(comparecimento)} eleitores</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+1.2% vs 2022</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <Users className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Composição dos Votos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={composicaoVotosData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {composicaoVotosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString("pt-BR"), "Votos"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participação Eleitoral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participacaoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {participacaoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="evolucao" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="evolucao">Evolução</TabsTrigger>
            <TabsTrigger value="bairros">Por Bairro</TabsTrigger>
            <TabsTrigger value="zonas">Por Zona</TabsTrigger>
          </TabsList>

          {/* Evolução */}
          <TabsContent value="evolucao" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Votos Nulos e Brancos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={evolucaoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="ano" />
                      <YAxis tickFormatter={(value) => formatNumber(value)} />
                      <Tooltip
                        formatter={(value: number) => [value.toLocaleString("pt-BR"), ""]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="nulos" name="Votos Nulos" fill={COLORS.nulos} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="brancos" name="Votos Brancos" fill={COLORS.brancos} radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="abstencoes" name="Abstenções" stroke={COLORS.abstencoes} strokeWidth={2} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução Percentual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolucaoPercentualData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                      <Line type="monotone" dataKey="nulos" name="% Nulos" stroke={COLORS.nulos} strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="brancos" name="% Brancos" stroke={COLORS.brancos} strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="abstencoes" name="% Abstenções" stroke={COLORS.abstencoes} strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Por Bairro */}
          <TabsContent value="bairros" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Votos Nulos e Brancos por Bairro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bairrosData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tickFormatter={(value) => formatNumber(value)} />
                      <YAxis type="category" dataKey="nome" className="text-xs" />
                      <Tooltip
                        formatter={(value: number) => [value.toLocaleString("pt-BR"), ""]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="nulos" name="Votos Nulos" stackId="a" fill={COLORS.nulos} />
                      <Bar dataKey="brancos" name="Votos Brancos" stackId="a" fill={COLORS.brancos} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhamento por Bairro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-sm">Bairro</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Nulos</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Brancos</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Total</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">% do Bairro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bairrosData.map((bairro: any) => (
                        <tr key={bairro.nome} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-3 px-4 font-medium">{bairro.nome}</td>
                          <td className="py-3 px-4 text-right font-mono text-red-600">
                            {bairro.nulos.toLocaleString("pt-BR")}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-600">
                            {bairro.brancos.toLocaleString("pt-BR")}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold">
                            {bairro.total.toLocaleString("pt-BR")}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`dte-badge ${parseFloat(bairro.percentual) > 9 ? "dte-badge-danger" : parseFloat(bairro.percentual) > 8 ? "dte-badge-warning" : "dte-badge-success"}`}>
                              {bairro.percentual}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Por Zona */}
          <TabsContent value="zonas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Votos Nulos e Brancos por Zona Eleitoral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={zonasData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="zona" />
                      <YAxis tickFormatter={(value) => formatNumber(value)} />
                      <Tooltip
                        formatter={(value: number) => [value.toLocaleString("pt-BR"), ""]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="nulos" name="Votos Nulos" fill={COLORS.nulos} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="brancos" name="Votos Brancos" fill={COLORS.brancos} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhamento por Zona Eleitoral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-sm">Zona</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Nulos</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Brancos</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">Total</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">% da Zona</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zonasData.map((zona) => (
                        <tr key={zona.zona} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-3 px-4 font-medium">{zona.zona}</td>
                          <td className="py-3 px-4 text-right font-mono text-red-600">
                            {zona.nulos.toLocaleString("pt-BR")}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-600">
                            {zona.brancos.toLocaleString("pt-BR")}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold">
                            {zona.total.toLocaleString("pt-BR")}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`dte-badge ${parseFloat(zona.percentual) > 9 ? "dte-badge-danger" : parseFloat(zona.percentual) > 8 ? "dte-badge-warning" : "dte-badge-success"}`}>
                              {zona.percentual}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DTELayout>
  );
}
