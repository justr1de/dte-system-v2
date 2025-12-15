import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import {
  BarChart3,
  ChevronRight,
  FileSpreadsheet,
  Map,
  PieChart,
  Shield,
  TrendingUp,
  Users,
  Vote,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

const features = [
  {
    icon: Users,
    title: "Perfil do Eleitorado",
    description: "Análise demográfica completa por faixa etária, gênero, escolaridade e renda per capita",
  },
  {
    icon: BarChart3,
    title: "Resultados Eleitorais",
    description: "Visualização de resultados por partido e candidato com comparação entre eleições",
  },
  {
    icon: Vote,
    title: "Votos Nulos e Brancos",
    description: "Rastreamento detalhado de votos nulos, brancos e abstenções por região",
  },
  {
    icon: Map,
    title: "Mapas de Calor",
    description: "Visualização geográfica da distribuição eleitoral e densidade de votos",
  },
  {
    icon: FileSpreadsheet,
    title: "Importação de Dados",
    description: "Carregue datasets eleitorais em formato CSV ou Excel com validação automática",
  },
  {
    icon: Shield,
    title: "Controle de Acesso",
    description: "Sistema RBAC com 4 níveis: Administrador, Gestor, Político e Demonstração",
  },
];

const stats = [
  { label: "Eleitores Analisados", value: "245K+" },
  { label: "Zonas Eleitorais", value: "45" },
  { label: "Bairros Mapeados", value: "52" },
  { label: "Anos de Dados", value: "8+" },
];

export default function Home() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">DTE</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Data Tracking Eleitoral</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/demo">
              <Button variant="ghost" size="sm">
                Demonstração
              </Button>
            </Link>
            <a href={getLoginUrl()}>
              <Button size="sm">Entrar</Button>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Sistema de Análise Eleitoral para Campanhas 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Inteligência de Dados para{" "}
              <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                Campanhas Eleitorais
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Plataforma completa de rastreamento e análise de dados eleitorais, 
              com foco especial em votos nulos e brancos, perfil demográfico e 
              visualizações geográficas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Explorar Demonstração
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href={getLoginUrl()}>
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  Acessar Sistema
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Funcionalidades Principais</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas para análise e visualização de dados eleitorais
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Níveis de Acesso</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sistema de permissões granular para diferentes perfis de usuário
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Administrador",
                description: "Acesso total ao sistema, gerenciamento de usuários e importação de dados",
                color: "from-red-500/20 to-red-500/5 border-red-500/30",
                iconColor: "text-red-500",
              },
              {
                title: "Gestor de Campanha",
                description: "Importação de dados, visualização de relatórios e gestão de campanhas",
                color: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
                iconColor: "text-blue-500",
              },
              {
                title: "Político",
                description: "Visualização de dashboards e relatórios personalizados",
                color: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
                iconColor: "text-purple-500",
              },
              {
                title: "Demonstração",
                description: "Acesso limitado à área de demonstração com dados de exemplo",
                color: "from-gray-500/20 to-gray-500/5 border-gray-500/30",
                iconColor: "text-gray-500",
              },
            ].map((level) => (
              <Card key={level.title} className={`bg-gradient-to-br ${level.color} border`}>
                <CardContent className="p-6">
                  <Shield className={`w-8 h-8 ${level.iconColor} mb-4`} />
                  <h3 className="font-semibold text-lg mb-2">{level.title}</h3>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container">
          <Card className="bg-gradient-to-r from-primary to-chart-2 text-white overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJjLTIgMC00IDItNCAyczItNCA0LTRjMiAwIDQgMiA0IDRzMiA0IDIgNGMwIDItMiA0LTIgNHMtMiAyLTQgMmMtMiAwLTQtMi00LTJzLTItNC0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Pronto para transformar sua campanha?
                </h2>
                <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                  Acesse dados eleitorais detalhados e tome decisões estratégicas baseadas em informações precisas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/demo">
                    <Button size="lg" variant="secondary" className="gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Ver Demonstração
                    </Button>
                  </Link>
                  <a href={getLoginUrl()}>
                    <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20">
                      Começar Agora
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">DTE - Data Tracking Eleitoral</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Sistema DTE. Desenvolvido para campanhas eleitorais 2026.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
