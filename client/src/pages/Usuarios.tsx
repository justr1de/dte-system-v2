import { DTELayout } from "@/components/DTELayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { AlertCircle, Search, Shield, Users } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  gestor: "Gestor de Campanha",
  politico: "Político",
  demo: "Demonstração",
};

const roleBadgeColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  gestor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  politico: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  demo: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const roleDescriptions: Record<string, string> = {
  admin: "Acesso total ao sistema, incluindo gerenciamento de usuários e importação de dados",
  gestor: "Pode importar dados, visualizar relatórios e gerenciar campanhas",
  politico: "Visualização de dashboards e relatórios personalizados",
  demo: "Acesso limitado à área de demonstração com dados de exemplo",
};

export default function Usuarios() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const { data: usuarios, refetch } = trpc.users.list.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const updateRole = trpc.users.updateRole.useMutation({
    onSuccess: () => {
      toast.success("Permissão atualizada com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar permissão");
    },
  });

  // Redirect if not admin
  if (!authLoading && (!user || user.role !== "admin")) {
    return (
      <DTELayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-4">
            Esta área é restrita a administradores do sistema.
          </p>
          <Button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</Button>
        </div>
      </DTELayout>
    );
  }

  const filteredUsers = usuarios?.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: number, newRole: "admin" | "gestor" | "politico" | "demo") => {
    updateRole.mutate({ userId, role: newRole });
  };

  return (
    <DTELayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie permissões e níveis de acesso dos usuários
          </p>
        </div>

        {/* Role Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(roleLabels).map(([role, label]) => {
            const count = usuarios?.filter((u) => u.role === role).length || 0;
            return (
              <Card key={role} className="bg-gradient-to-br from-card to-secondary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{label}</p>
                      <p className="text-3xl font-bold mt-1">{count}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${roleBadgeColors[role].split(" ")[0]}`}>
                      <Shield className={`w-6 h-6 ${roleBadgeColors[role].split(" ").slice(1).join(" ")}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Role Descriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Níveis de Acesso</CardTitle>
            <CardDescription>Entenda as permissões de cada nível</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(roleDescriptions).map(([role, description]) => (
                <div
                  key={role}
                  className="p-4 rounded-xl bg-secondary/30 border border-border/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`dte-badge ${roleBadgeColors[role]}`}>
                      {roleLabels[role]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Lista de Usuários</CardTitle>
                <CardDescription>
                  {filteredUsers?.length || 0} usuários cadastrados
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-[200px]"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filtrar por nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="politico">Político</SelectItem>
                    <SelectItem value="demo">Demonstração</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers && filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Usuário</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Nível de Acesso</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Último Acesso</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {u.name?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{u.name || "Sem nome"}</p>
                              <p className="text-xs text-muted-foreground">ID: {u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">{u.email || "-"}</td>
                        <td className="py-3 px-4">
                          <span className={`dte-badge ${roleBadgeColors[u.role]}`}>
                            {roleLabels[u.role]}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {u.lastSignedIn
                            ? new Date(u.lastSignedIn).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            value={u.role}
                            onValueChange={(value) =>
                              handleRoleChange(u.id, value as "admin" | "gestor" | "politico" | "demo")
                            }
                            disabled={u.id === user?.id}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="gestor">Gestor</SelectItem>
                              <SelectItem value="politico">Político</SelectItem>
                              <SelectItem value="demo">Demonstração</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum usuário encontrado.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DTELayout>
  );
}
