import { DTELayout } from "@/components/DTELayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  BarChart3,
  Download,
  FileText,
  Map,
  PieChart,
  TrendingUp,
  Users,
  Vote,
} from "lucide-react";
import { useState } from "react";

const reportTypes = [
  {
    id: "eleitorado",
    title: "Relatório do Eleitorado",
    description: "Análise demográfica completa dos eleitores",
    icon: Users,
    color: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
    iconColor: "text-blue-500",
  },
  {
    id: "resultados",
    title: "Resultados Eleitorais",
    description: "Votação por partido e candidato",
    icon: BarChart3,
    color: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
    iconColor: "text-emerald-500",
  },
  {
    id: "votos_nulos",
    title: "Votos Nulos e Brancos",
    description: "Análise de votos nulos, brancos e abstenções",
    icon: Vote,
    color: "from-red-500/10 to-red-500/5 border-red-500/20",
    iconColor: "text-red-500",
  },
  {
    id: "geografico",
    title: "Relatório Geográfico",
    description: "Distribuição por zona e bairro",
    icon: Map,
    color: "from-amber-500/10 to-amber-500/5 border-amber-500/20",
    iconColor: "text-amber-500",
  },
  {
    id: "comparativo",
    title: "Análise Comparativa",
    description: "Comparação entre eleições",
    icon: TrendingUp,
    color: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
    iconColor: "text-purple-500",
  },
  {
    id: "executivo",
    title: "Relatório Executivo",
    description: "Resumo executivo para decisores",
    icon: FileText,
    color: "from-primary/10 to-primary/5 border-primary/20",
    iconColor: "text-primary",
  },
];

export default function Relatorios() {
  const { user } = useAuth();
  const [anoSelecionado, setAnoSelecionado] = useState("2024");
  const [regiaoSelecionada, setRegiaoSelecionada] = useState("todas");
  const [formatoSelecionado, setFormatoSelecionado] = useState("pdf");

  const handleGenerateReport = (reportId: string) => {
    toast.info(`Gerando relatório: ${reportTypes.find(r => r.id === reportId)?.title}`, {
      description: "Esta funcionalidade estará disponível em breve.",
    });
  };

  // Check access level for executive reports
  const canAccessExecutive = user && ["admin", "gestor", "politico"].includes(user.role);

  return (
    <DTELayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">
              Gere relatórios personalizados e exporte dados
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regiaoSelecionada} onValueChange={setRegiaoSelecionada}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as regiões</SelectItem>
                <SelectItem value="centro">Centro</SelectItem>
                <SelectItem value="norte">Zona Norte</SelectItem>
                <SelectItem value="sul">Zona Sul</SelectItem>
                <SelectItem value="leste">Zona Leste</SelectItem>
                <SelectItem value="oeste">Zona Oeste</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formatoSelecionado} onValueChange={setFormatoSelecionado}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => {
            const isExecutive = report.id === "executivo";
            const isDisabled = isExecutive && !canAccessExecutive;

            return (
              <Card
                key={report.id}
                className={`bg-gradient-to-br ${report.color} border ${isDisabled ? "opacity-50" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl bg-white/50 dark:bg-black/20`}>
                      <report.icon className={`w-6 h-6 ${report.iconColor}`} />
                    </div>
                    {isExecutive && !canAccessExecutive && (
                      <span className="dte-badge dte-badge-warning">Restrito</span>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-4">{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleGenerateReport(report.id)}
                    disabled={isDisabled}
                    className="w-full gap-2"
                    variant={isDisabled ? "secondary" : "default"}
                  >
                    <Download className="w-4 h-4" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Rápido - {anoSelecionado}</CardTitle>
            <CardDescription>
              Principais indicadores para o período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 rounded-xl bg-secondary/30 text-center">
                <p className="text-3xl font-bold text-primary">245.678</p>
                <p className="text-sm text-muted-foreground mt-1">Total de Eleitores</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 text-center">
                <p className="text-3xl font-bold text-emerald-600">87.6%</p>
                <p className="text-sm text-muted-foreground mt-1">Comparecimento</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 text-center">
                <p className="text-3xl font-bold text-red-600">4.7%</p>
                <p className="text-sm text-muted-foreground mt-1">Votos Nulos</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 text-center">
                <p className="text-3xl font-bold text-slate-600">3.0%</p>
                <p className="text-sm text-muted-foreground mt-1">Votos Brancos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Recentes</CardTitle>
            <CardDescription>
              Histórico de relatórios gerados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum relatório gerado ainda.</p>
              <p className="text-sm mt-1">Selecione um tipo de relatório acima para começar.</p>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Exportação de Dados</CardTitle>
            <CardDescription>
              Exporte datasets completos para análise externa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => toast.info("Exportação em desenvolvimento")}>
                <Users className="w-6 h-6" />
                <span>Exportar Eleitorado</span>
                <span className="text-xs text-muted-foreground">CSV / Excel</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => toast.info("Exportação em desenvolvimento")}>
                <BarChart3 className="w-6 h-6" />
                <span>Exportar Resultados</span>
                <span className="text-xs text-muted-foreground">CSV / Excel</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => toast.info("Exportação em desenvolvimento")}>
                <Vote className="w-6 h-6" />
                <span>Exportar Votos Nulos</span>
                <span className="text-xs text-muted-foreground">CSV / Excel</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DTELayout>
  );
}
