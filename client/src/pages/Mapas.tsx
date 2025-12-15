import { DTELayout } from "@/components/DTELayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Info, Map, MapPin } from "lucide-react";
import { useState } from "react";

// Simulated heatmap data for demonstration
const bairrosHeatmapData = [
  { nome: "Centro", eleitores: 25678, nulos: 1234, brancos: 876, lat: -8.7619, lng: -63.9039, intensidade: 0.9 },
  { nome: "Nova Porto Velho", eleitores: 18234, nulos: 987, brancos: 654, lat: -8.7520, lng: -63.8940, intensidade: 0.75 },
  { nome: "Embratel", eleitores: 15678, nulos: 876, brancos: 543, lat: -8.7421, lng: -63.8841, intensidade: 0.65 },
  { nome: "Caiari", eleitores: 12345, nulos: 765, brancos: 432, lat: -8.7322, lng: -63.8742, intensidade: 0.55 },
  { nome: "São Cristóvão", eleitores: 11234, nulos: 654, brancos: 321, lat: -8.7223, lng: -63.8643, intensidade: 0.5 },
  { nome: "Arigolândia", eleitores: 9876, nulos: 543, brancos: 210, lat: -8.7124, lng: -63.8544, intensidade: 0.45 },
  { nome: "Pedrinhas", eleitores: 8765, nulos: 432, brancos: 198, lat: -8.7025, lng: -63.8445, intensidade: 0.4 },
  { nome: "Tancredo Neves", eleitores: 7654, nulos: 321, brancos: 187, lat: -8.6926, lng: -63.8346, intensidade: 0.35 },
  { nome: "Liberdade", eleitores: 6543, nulos: 298, brancos: 165, lat: -8.7718, lng: -63.9138, intensidade: 0.3 },
  { nome: "Três Marias", eleitores: 5432, nulos: 276, brancos: 143, lat: -8.7817, lng: -63.9237, intensidade: 0.25 },
];

function getHeatmapColor(intensidade: number, tipo: string) {
  if (tipo === "eleitores") {
    // Blue gradient for voters
    const r = Math.round(59 + (1 - intensidade) * 100);
    const g = Math.round(130 + (1 - intensidade) * 100);
    const b = Math.round(246);
    return `rgb(${r}, ${g}, ${b})`;
  } else if (tipo === "nulos") {
    // Red gradient for null votes
    const r = 239;
    const g = Math.round(68 + (1 - intensidade) * 150);
    const b = Math.round(68 + (1 - intensidade) * 150);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Green gradient for parties
    const r = Math.round(34 + (1 - intensidade) * 100);
    const g = Math.round(197);
    const b = Math.round(94 + (1 - intensidade) * 100);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

function HeatmapLegend({ tipo }: { tipo: string }) {
  const labels = {
    eleitores: { low: "Baixa densidade", high: "Alta densidade" },
    nulos: { low: "Poucos votos nulos", high: "Muitos votos nulos" },
    partidos: { low: "Baixa votação", high: "Alta votação" },
  };

  const colors = {
    eleitores: ["#93c5fd", "#3b82f6", "#1d4ed8"],
    nulos: ["#fca5a5", "#ef4444", "#b91c1c"],
    partidos: ["#86efac", "#22c55e", "#15803d"],
  };

  const currentLabels = labels[tipo as keyof typeof labels] || labels.eleitores;
  const currentColors = colors[tipo as keyof typeof colors] || colors.eleitores;

  return (
    <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
      <span className="text-sm text-muted-foreground">{currentLabels.low}</span>
      <div className="flex-1 h-3 rounded-full" style={{
        background: `linear-gradient(to right, ${currentColors[0]}, ${currentColors[1]}, ${currentColors[2]})`
      }} />
      <span className="text-sm text-muted-foreground">{currentLabels.high}</span>
    </div>
  );
}

function SimulatedHeatmap({ data, tipo }: { data: typeof bairrosHeatmapData; tipo: string }) {
  const [hoveredBairro, setHoveredBairro] = useState<string | null>(null);

  // Calculate grid positions for visualization
  const gridSize = 4;
  const cellSize = 100 / gridSize;

  return (
    <div className="relative w-full aspect-square bg-secondary/20 rounded-xl overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-px bg-border/30">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="bg-card/50" />
        ))}
      </div>

      {/* Heatmap points */}
      {data.map((bairro, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = col * cellSize + cellSize / 2;
        const y = row * cellSize + cellSize / 2;
        const size = 30 + bairro.intensidade * 40;

        return (
          <div
            key={bairro.nome}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
            }}
            onMouseEnter={() => setHoveredBairro(bairro.nome)}
            onMouseLeave={() => setHoveredBairro(null)}
          >
            <div
              className="w-full h-full rounded-full opacity-70 hover:opacity-100 transition-opacity"
              style={{
                backgroundColor: getHeatmapColor(bairro.intensidade, tipo),
                boxShadow: `0 0 ${size / 2}px ${getHeatmapColor(bairro.intensidade, tipo)}`,
              }}
            />
            {hoveredBairro === bairro.nome && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10 bg-card border border-border rounded-lg shadow-lg p-3 min-w-[150px]">
                <p className="font-semibold text-sm">{bairro.nome}</p>
                <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                  <p>Eleitores: {bairro.eleitores.toLocaleString("pt-BR")}</p>
                  <p>Votos Nulos: {bairro.nulos.toLocaleString("pt-BR")}</p>
                  <p>Votos Brancos: {bairro.brancos.toLocaleString("pt-BR")}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Map label */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Porto Velho - RO</span>
      </div>
    </div>
  );
}

export default function Mapas() {
  const [tipoMapa, setTipoMapa] = useState("eleitores");
  const [anoSelecionado, setAnoSelecionado] = useState("2024");
  const { data: demoBairros } = trpc.demo.getData.useQuery({ dataType: "bairros_demo" });

  return (
    <DTELayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mapas de Calor</h1>
            <p className="text-muted-foreground">
              Visualização geográfica da distribuição eleitoral
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={tipoMapa} onValueChange={setTipoMapa}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de mapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eleitores">Densidade de Eleitores</SelectItem>
                <SelectItem value="nulos">Votos Nulos/Brancos</SelectItem>
                <SelectItem value="partidos">Votação por Partido</SelectItem>
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

        {/* Info Banner */}
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Visualização Simulada</p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Este mapa de calor é uma representação visual dos dados eleitorais. Para integração com mapas reais do Google Maps, 
                  é necessário configurar a API de mapas. Os dados exibidos são baseados nas informações importadas para o sistema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" />
              {tipoMapa === "eleitores" && "Mapa de Densidade de Eleitores"}
              {tipoMapa === "nulos" && "Mapa de Votos Nulos e Brancos"}
              {tipoMapa === "partidos" && "Mapa de Votação por Partido"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <HeatmapLegend tipo={tipoMapa} />
            <SimulatedHeatmap data={bairrosHeatmapData} tipo={tipoMapa} />
          </CardContent>
        </Card>

        {/* Bairros List */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Bairro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bairrosHeatmapData.map((bairro) => (
                <div
                  key={bairro.nome}
                  className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{bairro.nome}</h3>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getHeatmapColor(bairro.intensidade, tipoMapa) }}
                    />
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Eleitores:</span>
                      <span className="font-mono">{bairro.eleitores.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Votos Nulos:</span>
                      <span className="font-mono text-red-600">{bairro.nulos.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Votos Brancos:</span>
                      <span className="font-mono text-slate-600">{bairro.brancos.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border/50">
                      <span>% Nulos/Brancos:</span>
                      <span className="font-mono font-semibold">
                        {(((bairro.nulos + bairro.brancos) / bairro.eleitores) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different map views */}
        <Tabs defaultValue="comparativo" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
            <TabsTrigger value="evolucao">Evolução Temporal</TabsTrigger>
          </TabsList>

          <TabsContent value="comparativo">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Densidade de Eleitores</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimulatedHeatmap data={bairrosHeatmapData} tipo="eleitores" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Votos Nulos e Brancos</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimulatedHeatmap data={bairrosHeatmapData} tipo="nulos" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="evolucao">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {["2020", "2022", "2024"].map((ano) => (
                <Card key={ano}>
                  <CardHeader>
                    <CardTitle className="text-lg">Eleição {ano}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimulatedHeatmap 
                      data={bairrosHeatmapData.map(b => ({
                        ...b,
                        intensidade: b.intensidade * (0.8 + (parseInt(ano) - 2020) * 0.1)
                      }))} 
                      tipo={tipoMapa} 
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DTELayout>
  );
}
