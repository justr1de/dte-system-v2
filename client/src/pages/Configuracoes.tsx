import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DTELayout from "@/components/DTELayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { 
  Settings, 
  Palette, 
  Bell, 
  Database, 
  Shield, 
  RefreshCw,
  Save,
  Plus,
  Trash2,
  Edit,
  Key,
  Globe,
  Server,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  Info
} from "lucide-react";

export default function Configuracoes() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSettingKey, setSelectedSettingKey] = useState<string | null>(null);
  const [newSetting, setNewSetting] = useState({ key: "", value: "", description: "" });

  // Fetch system settings
  const { data: settings, isLoading: settingsLoading, refetch: refetchSettings } = trpc.settings.list.useQuery(
    undefined,
    { enabled: !!user && user.role === "admin" }
  );

  // Mutations
  const upsertSettingMutation = trpc.settings.upsert.useMutation({
    onSuccess: () => {
      toast.success("Configuração salva com sucesso!");
      refetchSettings();
      setEditDialogOpen(false);
      setSelectedSettingKey(null);
      setNewSetting({ key: "", value: "", description: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao salvar configuração");
    },
  });

  const deleteSettingMutation = trpc.settings.delete.useMutation({
    onSuccess: () => {
      toast.success("Configuração removida!");
      refetchSettings();
      setDeleteDialogOpen(false);
      setSelectedSettingKey(null);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover configuração");
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    if (!loading && user && user.role !== "admin") {
      toast.error("Acesso restrito a administradores");
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleSaveSetting = () => {
    if (!newSetting.key.trim()) {
      toast.error("A chave é obrigatória");
      return;
    }
    upsertSettingMutation.mutate({
      key: newSetting.key.trim(),
      value: newSetting.value,
      description: newSetting.description || undefined,
    });
  };

  const handleEditSetting = (settingKey: string, settingValue: string | null, description: string | null) => {
    setSelectedSettingKey(settingKey);
    setNewSetting({
      key: settingKey,
      value: settingValue || "",
      description: description || "",
    });
    setEditDialogOpen(true);
  };

  const handleDeleteSetting = (settingKey: string) => {
    setSelectedSettingKey(settingKey);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSettingKey) {
      deleteSettingMutation.mutate({ key: selectedSettingKey });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to get setting value
  const getSettingValue = (key: string, defaultValue: string = "") => {
    const setting = settings?.find(s => s.settingKey === key);
    return setting?.settingValue || defaultValue;
  };

  // Default settings templates
  const defaultSettings = [
    { key: "app_name", value: "Data Tracking Eleitoral", description: "Nome da aplicação" },
    { key: "app_logo_url", value: "", description: "URL do logo da aplicação" },
    { key: "primary_color", value: "#10b981", description: "Cor primária do tema (hex)" },
    { key: "secondary_color", value: "#0d9488", description: "Cor secundária do tema (hex)" },
    { key: "email_notifications", value: "true", description: "Habilitar notificações por email" },
    { key: "max_import_size_mb", value: "50", description: "Tamanho máximo de arquivo para importação (MB)" },
    { key: "session_timeout_minutes", value: "60", description: "Tempo de expiração da sessão (minutos)" },
    { key: "maintenance_mode", value: "false", description: "Modo de manutenção ativo" },
    { key: "google_maps_api_key", value: "", description: "Chave da API do Google Maps" },
    { key: "smtp_host", value: "", description: "Host do servidor SMTP" },
    { key: "smtp_port", value: "587", description: "Porta do servidor SMTP" },
    { key: "smtp_user", value: "", description: "Usuário SMTP" },
    { key: "contact_email", value: "contato@dataro-it.com.br", description: "Email de contato" },
  ];

  const addDefaultSetting = (setting: { key: string; value: string; description: string }) => {
    setNewSetting(setting);
    setSelectedSettingKey(null);
    setEditDialogOpen(true);
  };

  if (loading) {
    return (
      <DTELayout>
        <div className="flex items-center justify-center h-96">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DTELayout>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <DTELayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              Configurações do Sistema
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as configurações globais da plataforma
            </p>
          </div>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setSelectedSettingKey(null); setNewSetting({ key: "", value: "", description: "" }); }}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Configuração
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedSettingKey ? "Editar Configuração" : "Nova Configuração"}
                </DialogTitle>
                <DialogDescription>
                  {selectedSettingKey 
                    ? "Atualize os valores da configuração selecionada"
                    : "Adicione uma nova configuração ao sistema"
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="setting-key">Chave</Label>
                  <Input
                    id="setting-key"
                    placeholder="ex: app_name"
                    value={newSetting.key}
                    onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                    disabled={!!selectedSettingKey}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setting-value">Valor</Label>
                  <Textarea
                    id="setting-value"
                    placeholder="Valor da configuração"
                    value={newSetting.value}
                    onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setting-description">Descrição (opcional)</Label>
                  <Input
                    id="setting-description"
                    placeholder="Descrição da configuração"
                    value={newSetting.description}
                    onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveSetting} disabled={upsertSettingMutation.isPending}>
                  {upsertSettingMutation.isPending ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Aparência</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Integrações</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">Avançado</span>
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Informações do Sistema
                  </CardTitle>
                  <CardDescription>
                    Configurações básicas da aplicação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome da Aplicação</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={getSettingValue("app_name", "Data Tracking Eleitoral")} 
                        readOnly 
                        className="bg-muted"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => addDefaultSetting(defaultSettings.find(s => s.key === "app_name")!)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email de Contato</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={getSettingValue("contact_email", "contato@dataro-it.com.br")} 
                        readOnly 
                        className="bg-muted"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => addDefaultSetting(defaultSettings.find(s => s.key === "contact_email")!)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Segurança
                  </CardTitle>
                  <CardDescription>
                    Configurações de segurança do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tempo de Sessão (minutos)</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={getSettingValue("session_timeout_minutes", "60")} 
                        readOnly 
                        className="bg-muted"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => addDefaultSetting(defaultSettings.find(s => s.key === "session_timeout_minutes")!)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Modo de Manutenção</Label>
                      <p className="text-sm text-muted-foreground">
                        Bloqueia acesso de usuários não-admin
                      </p>
                    </div>
                    <Switch 
                      checked={getSettingValue("maintenance_mode") === "true"}
                      onCheckedChange={(checked) => {
                        upsertSettingMutation.mutate({
                          key: "maintenance_mode",
                          value: checked ? "true" : "false",
                          description: "Modo de manutenção ativo",
                        });
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Personalização Visual
                </CardTitle>
                <CardDescription>
                  Customize as cores e aparência do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Cor Primária</Label>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: getSettingValue("primary_color", "#10b981") }}
                      />
                      <Input 
                        value={getSettingValue("primary_color", "#10b981")} 
                        readOnly 
                        className="bg-muted"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => addDefaultSetting(defaultSettings.find(s => s.key === "primary_color")!)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cor Secundária</Label>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: getSettingValue("secondary_color", "#0d9488") }}
                      />
                      <Input 
                        value={getSettingValue("secondary_color", "#0d9488")} 
                        readOnly 
                        className="bg-muted"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => addDefaultSetting(defaultSettings.find(s => s.key === "secondary_color")!)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>URL do Logo</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={getSettingValue("app_logo_url")} 
                      placeholder="https://exemplo.com/logo.png"
                      readOnly 
                      className="bg-muted"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => addDefaultSetting(defaultSettings.find(s => s.key === "app_logo_url")!)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Configurações de Notificações
                </CardTitle>
                <CardDescription>
                  Configure como o sistema envia notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar emails para eventos importantes
                    </p>
                  </div>
                  <Switch 
                    checked={getSettingValue("email_notifications") === "true"}
                    onCheckedChange={(checked) => {
                      upsertSettingMutation.mutate({
                        key: "email_notifications",
                        value: checked ? "true" : "false",
                        description: "Habilitar notificações por email",
                      });
                    }}
                  />
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Configurações SMTP</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Host SMTP</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={getSettingValue("smtp_host")} 
                          placeholder="smtp.exemplo.com"
                          readOnly 
                          className="bg-muted"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => addDefaultSetting(defaultSettings.find(s => s.key === "smtp_host")!)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Porta SMTP</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={getSettingValue("smtp_port", "587")} 
                          readOnly 
                          className="bg-muted"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => addDefaultSetting(defaultSettings.find(s => s.key === "smtp_port")!)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Usuário SMTP</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={getSettingValue("smtp_user")} 
                          placeholder="usuario@exemplo.com"
                          readOnly 
                          className="bg-muted"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => addDefaultSetting(defaultSettings.find(s => s.key === "smtp_user")!)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Integrações Externas
                </CardTitle>
                <CardDescription>
                  Configure APIs e serviços externos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Globe className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Google Maps API</h4>
                        <p className="text-sm text-muted-foreground">
                          Mapas de calor e visualização geográfica
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSettingValue("google_maps_api_key") ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Configurado
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Não configurado
                        </Badge>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addDefaultSetting(defaultSettings.find(s => s.key === "google_maps_api_key")!)}
                      >
                        <Key className="mr-2 h-4 w-4" />
                        Configurar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Limites do Sistema
                  </CardTitle>
                  <CardDescription>
                    Configure limites e restrições
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tamanho Máximo de Importação (MB)</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={getSettingValue("max_import_size_mb", "50")} 
                        readOnly 
                        className="bg-muted"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => addDefaultSetting(defaultSettings.find(s => s.key === "max_import_size_mb")!)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Todas as Configurações
                  </CardTitle>
                  <CardDescription>
                    Lista completa de configurações do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {settingsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : settings && settings.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Chave</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Atualizado</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {settings.map((setting) => (
                            <TableRow key={setting.id}>
                              <TableCell className="font-mono text-sm">{setting.settingKey}</TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {setting.settingValue || <span className="text-muted-foreground">-</span>}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                                {setting.description || "-"}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDate(setting.updatedAt)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditSetting(setting.settingKey, setting.settingValue, setting.description)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteSetting(setting.settingKey)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma configuração encontrada</p>
                      <p className="text-sm mt-2">
                        Clique em "Nova Configuração" para adicionar
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja remover a configuração "{selectedSettingKey}"?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleteSettingMutation.isPending}>
                {deleteSettingMutation.isPending ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DTELayout>
  );
}
