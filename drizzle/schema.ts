import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, bigint, boolean, json } from "drizzle-orm/mysql-core";

// ==================== USUÁRIOS E AUTENTICAÇÃO ====================

export const userRoles = ["admin", "gestor", "politico", "demo"] as const;
export type UserRole = (typeof userRoles)[number];

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "gestor", "politico", "demo"]).default("demo").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== CONFIGURAÇÕES DO SISTEMA ====================

export const systemSettings = mysqlTable("system_settings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  settingValue: text("settingValue"),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ==================== DADOS GEOGRÁFICOS ====================

export const regioes = mysqlTable("regioes", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  codigo: varchar("codigo", { length: 20 }),
  uf: varchar("uf", { length: 2 }).default("RO"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const municipios = mysqlTable("municipios", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  codigo: varchar("codigo", { length: 20 }),
  regiaoId: int("regiaoId").references(() => regioes.id),
  uf: varchar("uf", { length: 2 }).default("RO"),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const bairros = mysqlTable("bairros", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  codigo: varchar("codigo", { length: 20 }),
  municipioId: int("municipioId").references(() => municipios.id),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const zonasEleitorais = mysqlTable("zonas_eleitorais", {
  id: int("id").autoincrement().primaryKey(),
  numero: int("numero").notNull(),
  nome: varchar("nome", { length: 100 }),
  municipioId: int("municipioId").references(() => municipios.id),
  endereco: text("endereco"),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const secoesEleitorais = mysqlTable("secoes_eleitorais", {
  id: int("id").autoincrement().primaryKey(),
  numero: int("numero").notNull(),
  zonaId: int("zonaId").references(() => zonasEleitorais.id),
  localVotacao: text("localVotacao"),
  bairroId: int("bairroId").references(() => bairros.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ==================== ELEITORADO ====================

export const eleitorado = mysqlTable("eleitorado", {
  id: int("id").autoincrement().primaryKey(),
  anoEleicao: int("anoEleicao").notNull(),
  municipioId: int("municipioId").references(() => municipios.id),
  bairroId: int("bairroId").references(() => bairros.id),
  zonaId: int("zonaId").references(() => zonasEleitorais.id),
  secaoId: int("secaoId").references(() => secoesEleitorais.id),
  totalEleitores: int("totalEleitores").default(0),
  eleitoresMasculino: int("eleitoresMasculino").default(0),
  eleitoresFeminino: int("eleitoresFeminino").default(0),
  eleitoresOutros: int("eleitoresOutros").default(0),
  faixa16a17: int("faixa16a17").default(0),
  faixa18a24: int("faixa18a24").default(0),
  faixa25a34: int("faixa25a34").default(0),
  faixa35a44: int("faixa35a44").default(0),
  faixa45a59: int("faixa45a59").default(0),
  faixa60a69: int("faixa60a69").default(0),
  faixa70mais: int("faixa70mais").default(0),
  escolaridadeAnalfabeto: int("escolaridadeAnalfabeto").default(0),
  escolaridadeFundamental: int("escolaridadeFundamental").default(0),
  escolaridadeMedio: int("escolaridadeMedio").default(0),
  escolaridadeSuperior: int("escolaridadeSuperior").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ==================== PARTIDOS E CANDIDATOS ====================

export const partidos = mysqlTable("partidos", {
  id: int("id").autoincrement().primaryKey(),
  sigla: varchar("sigla", { length: 20 }).notNull(),
  nome: varchar("nome", { length: 200 }).notNull(),
  numero: int("numero").notNull(),
  cor: varchar("cor", { length: 7 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const candidatos = mysqlTable("candidatos", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 200 }).notNull(),
  nomeUrna: varchar("nomeUrna", { length: 100 }),
  numero: int("numero").notNull(),
  partidoId: int("partidoId").references(() => partidos.id),
  cargo: varchar("cargo", { length: 50 }).notNull(),
  anoEleicao: int("anoEleicao").notNull(),
  municipioId: int("municipioId").references(() => municipios.id),
  situacao: varchar("situacao", { length: 50 }),
  foto: text("foto"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ==================== RESULTADOS ELEITORAIS ====================

export const resultadosEleitorais = mysqlTable("resultados_eleitorais", {
  id: int("id").autoincrement().primaryKey(),
  anoEleicao: int("anoEleicao").notNull(),
  turno: int("turno").default(1),
  cargo: varchar("cargo", { length: 50 }).notNull(),
  municipioId: int("municipioId").references(() => municipios.id),
  bairroId: int("bairroId").references(() => bairros.id),
  zonaId: int("zonaId").references(() => zonasEleitorais.id),
  secaoId: int("secaoId").references(() => secoesEleitorais.id),
  candidatoId: int("candidatoId").references(() => candidatos.id),
  partidoId: int("partidoId").references(() => partidos.id),
  votosValidos: int("votosValidos").default(0),
  votosNominais: int("votosNominais").default(0),
  votosLegenda: int("votosLegenda").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ==================== VOTOS NULOS E BRANCOS ====================

export const votosNulosBrancos = mysqlTable("votos_nulos_brancos", {
  id: int("id").autoincrement().primaryKey(),
  anoEleicao: int("anoEleicao").notNull(),
  turno: int("turno").default(1),
  cargo: varchar("cargo", { length: 50 }).notNull(),
  municipioId: int("municipioId").references(() => municipios.id),
  bairroId: int("bairroId").references(() => bairros.id),
  zonaId: int("zonaId").references(() => zonasEleitorais.id),
  secaoId: int("secaoId").references(() => secoesEleitorais.id),
  votosNulos: int("votosNulos").default(0),
  votosBrancos: int("votosBrancos").default(0),
  abstencoes: int("abstencoes").default(0),
  totalAptos: int("totalAptos").default(0),
  comparecimento: int("comparecimento").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ==================== IMPORTAÇÕES ====================

export const importacoes = mysqlTable("importacoes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  nomeArquivo: varchar("nomeArquivo", { length: 255 }).notNull(),
  tipoArquivo: varchar("tipoArquivo", { length: 50 }).notNull(),
  tipoDataset: varchar("tipoDataset", { length: 50 }).notNull(),
  totalRegistros: int("totalRegistros").default(0),
  registrosImportados: int("registrosImportados").default(0),
  registrosErro: int("registrosErro").default(0),
  status: mysqlEnum("status", ["pendente", "processando", "concluido", "erro"]).default("pendente"),
  mensagemErro: text("mensagemErro"),
  anoReferencia: int("anoReferencia"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ==================== LOGS DE AUDITORIA ====================

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  tableName: varchar("tableName", { length: 100 }),
  recordId: int("recordId"),
  oldValues: json("oldValues"),
  newValues: json("newValues"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ==================== DADOS DE DEMONSTRAÇÃO ====================

export const demoData = mysqlTable("demo_data", {
  id: int("id").autoincrement().primaryKey(),
  dataType: varchar("dataType", { length: 50 }).notNull(),
  dataContent: json("dataContent"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ==================== TYPES ====================

export type Regiao = typeof regioes.$inferSelect;
export type Municipio = typeof municipios.$inferSelect;
export type Bairro = typeof bairros.$inferSelect;
export type ZonaEleitoral = typeof zonasEleitorais.$inferSelect;
export type SecaoEleitoral = typeof secoesEleitorais.$inferSelect;
export type Eleitorado = typeof eleitorado.$inferSelect;
export type Partido = typeof partidos.$inferSelect;
export type Candidato = typeof candidatos.$inferSelect;
export type ResultadoEleitoral = typeof resultadosEleitorais.$inferSelect;
export type VotoNuloBranco = typeof votosNulosBrancos.$inferSelect;
export type Importacao = typeof importacoes.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
