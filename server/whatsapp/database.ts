/**
 * Consultas ao banco de dados Supabase para o chatbot
 * ProviDATA - Sistema de Gestão de Providências
 *
 * Nomes de colunas conforme schema real do Supabase (wntiupkhjtgiaxiicxeq):
 *   gabinetes.municipio | cidadaos.nome | providencias.numero_protocolo | categorias.ativo
 */

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "./config";

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.serviceKey);

// ==================== GABINETES ====================

export interface Gabinete {
  id: string;
  nome: string;
  municipio: string;
  uf: string;
  parlamentar_nome?: string;
  parlamentar_cargo?: string;
  ativo?: boolean;
}

/**
 * Busca gabinetes por município (busca parcial, case-insensitive)
 */
export async function buscarGabinetesPorMunicipio(
  municipio: string
): Promise<Gabinete[]> {
  const { data, error } = await supabase
    .from("gabinetes")
    .select("id, nome, municipio, uf, parlamentar_nome, parlamentar_cargo, ativo")
    .ilike("municipio", `%${municipio}%`)
    .eq("ativo", true)
    .order("nome");

  if (error) {
    console.error("[DB] Erro ao buscar gabinetes:", error);
    return [];
  }

  return data || [];
}

/**
 * Busca todos os municípios que possuem gabinetes ativos
 */
export async function listarMunicipiosComGabinetes(): Promise<string[]> {
  const { data, error } = await supabase
    .from("gabinetes")
    .select("municipio")
    .eq("ativo", true)
    .not("municipio", "is", null);

  if (error) {
    console.error("[DB] Erro ao listar municípios:", error);
    return [];
  }

  const municipios = Array.from(
    new Set((data || []).map((g) => g.municipio).filter(Boolean))
  );
  return municipios.sort();
}

/**
 * Busca um gabinete pelo ID
 */
export async function buscarGabinetePorId(
  id: string
): Promise<Gabinete | null> {
  const { data, error } = await supabase
    .from("gabinetes")
    .select("id, nome, municipio, uf, parlamentar_nome, parlamentar_cargo, ativo")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[DB] Erro ao buscar gabinete:", error);
    return null;
  }

  return data;
}

// ==================== CATEGORIAS ====================

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
}

/**
 * Busca categorias ativas de um gabinete.
 * Se não houver categorias específicas do gabinete, busca as gerais (gabinete_id IS NULL).
 */
export async function buscarCategorias(
  gabineteId: string
): Promise<Categoria[]> {
  let { data, error } = await supabase
    .from("categorias")
    .select("id, nome, descricao")
    .eq("gabinete_id", gabineteId)
    .eq("ativo", true)
    .order("nome");

  if (error) {
    console.error("[DB] Erro ao buscar categorias:", error);
    return [];
  }

  // Se não tem categorias do gabinete, buscar as gerais (gabinete_id IS NULL)
  if (!data || data.length === 0) {
    const result = await supabase
      .from("categorias")
      .select("id, nome, descricao")
      .is("gabinete_id", null)
      .eq("ativo", true)
      .order("nome");

    data = result.data;
    if (result.error) {
      console.error("[DB] Erro ao buscar categorias gerais:", result.error);
      return [];
    }
  }

  return data || [];
}

// ==================== CIDADÃOS ====================

export interface Cidadao {
  id: string;
  nome: string;
  telefone?: string;
  celular?: string;
  cpf?: string;
  email?: string;
  cidade?: string;
}

/**
 * Busca ou cria um cidadão pelo telefone (busca em telefone e celular)
 */
export async function getOrCreateCidadao(params: {
  telefone: string;
  nome: string;
  cpf?: string;
  cidade?: string;
  gabinete_id?: string;
}): Promise<Cidadao | null> {
  // Buscar cidadão existente pelo telefone ou celular
  const { data: existentes } = await supabase
    .from("cidadaos")
    .select("*")
    .or(`telefone.eq.${params.telefone},celular.eq.${params.telefone}`);

  const existente = existentes && existentes.length > 0 ? existentes[0] : null;

  if (existente) {
    const updates: Record<string, string | undefined> = {};
    if (params.nome && params.nome !== existente.nome) {
      updates.nome = params.nome;
    }
    if (params.cpf && params.cpf !== existente.cpf) {
      updates.cpf = params.cpf;
    }
    if (params.cidade && params.cidade !== existente.cidade) {
      updates.cidade = params.cidade;
    }

    if (Object.keys(updates).length > 0) {
      await supabase.from("cidadaos").update(updates).eq("id", existente.id);
    }

    return existente;
  }

  // Criar novo cidadão
  const { data: novoCidadao, error } = await supabase
    .from("cidadaos")
    .insert({
      nome: params.nome,
      celular: params.telefone,
      cpf: params.cpf || null,
      cidade: params.cidade || null,
      gabinete_id: params.gabinete_id || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[DB] Erro ao criar cidadão:", error);
    return null;
  }

  return novoCidadao;
}

// ==================== PROVIDÊNCIAS ====================

export interface NovaProvidencia {
  cidadao_id: string;
  gabinete_id: string;
  categoria_id: string;
  descricao: string;
  titulo: string;
}

/**
 * Gera um protocolo único para a providência
 * Formato: PROV-YYYYMMDD-XXXX
 */
function gerarProtocolo(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const aleatorio = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `PROV-${ano}${mes}${dia}-${aleatorio}`;
}

/**
 * Cria uma nova providência no banco de dados
 */
export async function criarProvidencia(
  params: NovaProvidencia
): Promise<{ numero_protocolo: string; id: string } | null> {
  const protocolo = gerarProtocolo();

  const insertData: Record<string, unknown> = {
    numero_protocolo: protocolo,
    cidadao_id: params.cidadao_id,
    gabinete_id: params.gabinete_id,
    titulo: params.titulo,
    descricao: params.descricao,
    status: "recebida",
    prioridade: "media",
  };

  // Só incluir categoria_id se for um UUID válido
  if (params.categoria_id && params.categoria_id.length > 0) {
    insertData.categoria_id = params.categoria_id;
  }

  const { data, error } = await supabase
    .from("providencias")
    .insert(insertData)
    .select("id, numero_protocolo")
    .single();

  if (error) {
    console.error("[DB] Erro ao criar providência:", error);
    return null;
  }

  // Registrar no histórico
  if (data) {
    await supabase.from("historico_providencias").insert({
      providencia_id: data.id,
      acao: "criacao",
      status_anterior: null,
      status_novo: "recebida",
      observacao: "Providência registrada via WhatsApp",
    });
  }

  return data;
}
