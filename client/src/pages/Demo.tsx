import { DTELayout } from "@/components/DTELayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  BarChart3,
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  Info,
  Map,
  PieChart,
  Play,
  TrendingUp,
  Users,
  Vote,
} from "lucide-react";
import { Link } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const features = [
  {
    icon: Users,
    title: "Perfil do Eleitorado",
    description: "Análise demográfica completa dos eleitores por faixa etária, gênero, escolaridade e renda",
    href: "/eleitorado",
  },
  {
    icon: BarChart3,
    title: "Resultados Eleitorais",
    description: "Visualização de resultados por partido e candidato com comparação entre eleições",
    href: "/resultados",
  },
  {
    icon: Vote,
    title: "Votos Nulos e Brancos",
    description: "Rastreamento detalhado de votos nulos, brancos e abstenções por região",
    href: "/votos-nulos",
  },
  {
    icon: Map,
    title: "Mapas de Calor",
    description: "Visualização geográfica da distribuição eleitoral e densidade de votos",
    href: "/mapas",
  },
];

export default function Demo() {
  const { data: demoData } = trpc.demo.getData.useQuery({});

  // Demo statistics
  const demoStats = {
    totalEleitores: 245678,
    zonas: 45,
    bairros: 52,
    partidos: 32,
  };

  // Demo chart data
  const faixaEtariaData = [
    { faixa: "16-17", eleitores: 4521 },
    { faixa: "18-24", eleitores: 32456 },
    { faixa: "25-34", eleitores: 48923 },
    { faixa: "35-44", eleitores: 52341 },
    { faixa: "45-59", eleitores: 58234 },
    { faixa: "60-69", eleitores: 32145 },
    { faixa: "70+", eleitores: 17058 },
  ];

  const partidosData = [
    { name: "PT", value: 45678 },
    { name: "PL", value: 42345 },
    { name: "MDB", value: 38234 },
    { name: "PSDB", value: 28456 },
    { name: "PP", value: 22345 },
    { name: "Outros", value: 45678 },
  ];

  const votosData = [
    { tipo: "Válidos", valor: 198456, cor: "#22c55e" },
    { tipo: "Nulos", valor: 10123, cor: "#ef4444" },
    { tipo: "Brancos", valor: 6543, cor: "#94a3b8" },
  ];

  return (
    <DTELayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Área de Demonstração</h1>
            <p className="text-muted-foreground">
              Explore as funcionalidades do sistema com dados de exemplo
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">Modo Demonstração</span>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-chart-2/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="p-4 rounded-xl bg-primary/10">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Bem-vindo ao Sistema DTE</h2>
                <p className="text-muted-foreground">
                  Esta é uma demonstração do Sistema Data Tracking Eleitoral. Os dados exibidos são 
                  fictícios e servem apenas para ilustrar as funcionalidades da plataforma. 
                  Para acessar dados reais, entre em contato com o administrador.
                </p>
              </div>
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  <Play className="w-4 h-4" />
                  Explorar Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{demoStats.totalEleitores.toLocaleString("pt-BR")}</p>
              <p className="text-sm text-muted-foreground">Eleitores</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
            <CardContent className="p-6 text-center">
              <Map className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              <p className="text-2xl font-bold">{demoStats.zonas}</p>
              <p className="text-sm text-muted-foreground">Zonas Eleitorais</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <p className="text-2xl font-bold">{demoStats.bairros}</p>
              <p className="text-sm text-muted-foreground">Bairros</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <CardContent className="p-6 text-center">
              <PieChart className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <p className="text-2xl font-bold">{demoStats.partidos}</p>
              <p className="text-sm text-muted-foreground">Partidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div>
          <h2 className="text-xl font-bold mb-4">Funcionalidades Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sample Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribuição por Faixa Etária</CardTitle>
              <CardDescription>Dados de demonstração</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={faixaEtariaData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="faixa" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString("pt-BR"), "Eleitores"]}
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Votação por Partido</CardTitle>
              <CardDescription>Dados de demonstração</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={partidosData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {partidosData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Votes Composition */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Composição dos Votos - Última Eleição</CardTitle>
            <CardDescription>Dados de demonstração</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {votosData.map((item) => (
                <div
                  key={item.tipo}
                  className="p-6 rounded-xl text-center"
                  style={{ backgroundColor: `${item.cor}15` }}
                >
                  <p className="text-3xl font-bold" style={{ color: item.cor }}>
                    {item.valor.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{item.tipo}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((item.valor / 215122) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary to-chart-2 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Pronto para começar?</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              O Sistema DTE oferece análises detalhadas e insights valiosos para sua campanha eleitoral.
              Entre em contato para obter acesso completo aos dados reais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Ver Dashboard Completo
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Solicitar Acesso
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DTELayout>
  );
}
