/**
 * Gerenciamento de sessões do chatbot WhatsApp
 * Usa a tabela whatsapp_sessoes no Supabase
 * ProviDATA - Sistema de Gestão de Providências
 */

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG, ChatEtapa, SESSION_TIMEOUT_MS } from "./config";

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.serviceKey);

export interface Sessao {
  telefone: string;
  etapa: ChatEtapa;
  cidade_informada: string | null;
  gabinete_selecionado_id: string | null;
  dados_temporarios: DadosTemporarios;
  ultima_interacao: string;
  gabinete_id: string | null;
}

export interface DadosTemporarios {
  nome_completo?: string;
  cpf?: string;
  categoria_id?: string;
  categoria_nome?: string;
  descricao?: string;
  gabinete_nome?: string;
  gabinetes_opcoes?: Array<{ id: string; nome: string; index: number }>;
  categorias_opcoes?: Array<{ id: string; nome: string; index: number }>;
}

/**
 * Busca ou cria uma sessão para o telefone informado
 */
export async function getOrCreateSessao(telefone: string): Promise<Sessao> {
  // Buscar sessão existente
  const { data: sessaoExistente, error: fetchError } = await supabase
    .from("whatsapp_sessoes")
    .select("*")
    .eq("telefone", telefone)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("[Sessao] Erro ao buscar sessão:", fetchError);
  }

  // Se existe sessão, verificar se expirou
  if (sessaoExistente) {
    const ultimaInteracao = new Date(
      sessaoExistente.ultima_interacao
    ).getTime();
    const agora = Date.now();

    if (agora - ultimaInteracao > SESSION_TIMEOUT_MS) {
      return await resetarSessao(telefone);
    }

    // Atualizar timestamp
    await supabase
      .from("whatsapp_sessoes")
      .update({ ultima_interacao: new Date().toISOString() })
      .eq("telefone", telefone);

    return {
      telefone: sessaoExistente.telefone,
      etapa: sessaoExistente.etapa as ChatEtapa,
      cidade_informada: sessaoExistente.cidade_informada,
      gabinete_selecionado_id: sessaoExistente.gabinete_selecionado_id,
      dados_temporarios: sessaoExistente.dados_temporarios || {},
      ultima_interacao: sessaoExistente.ultima_interacao,
      gabinete_id: sessaoExistente.gabinete_id,
    };
  }

  // Criar nova sessão
  const novaSessao: Sessao = {
    telefone,
    etapa: ChatEtapa.INICIO,
    cidade_informada: null,
    gabinete_selecionado_id: null,
    dados_temporarios: {},
    ultima_interacao: new Date().toISOString(),
    gabinete_id: null,
  };

  const { error: insertError } = await supabase
    .from("whatsapp_sessoes")
    .insert({
      telefone: novaSessao.telefone,
      etapa: novaSessao.etapa,
      cidade_informada: novaSessao.cidade_informada,
      gabinete_selecionado_id: novaSessao.gabinete_selecionado_id,
      dados_temporarios: novaSessao.dados_temporarios,
      ultima_interacao: novaSessao.ultima_interacao,
      gabinete_id: novaSessao.gabinete_id,
    });

  if (insertError) {
    console.error("[Sessao] Erro ao criar sessão:", insertError);
  }

  return novaSessao;
}

/**
 * Atualiza a sessão no banco de dados
 */
export async function atualizarSessao(
  telefone: string,
  updates: Partial<Omit<Sessao, "telefone">>
): Promise<void> {
  const { error } = await supabase
    .from("whatsapp_sessoes")
    .update({
      ...updates,
      ultima_interacao: new Date().toISOString(),
    })
    .eq("telefone", telefone);

  if (error) {
    console.error("[Sessao] Erro ao atualizar sessão:", error);
  }
}

/**
 * Reseta a sessão para o estado inicial
 */
export async function resetarSessao(telefone: string): Promise<Sessao> {
  const sessaoResetada: Sessao = {
    telefone,
    etapa: ChatEtapa.INICIO,
    cidade_informada: null,
    gabinete_selecionado_id: null,
    dados_temporarios: {},
    ultima_interacao: new Date().toISOString(),
    gabinete_id: null,
  };

  const { error } = await supabase.from("whatsapp_sessoes").upsert({
    telefone: sessaoResetada.telefone,
    etapa: sessaoResetada.etapa,
    cidade_informada: sessaoResetada.cidade_informada,
    gabinete_selecionado_id: sessaoResetada.gabinete_selecionado_id,
    dados_temporarios: sessaoResetada.dados_temporarios,
    ultima_interacao: sessaoResetada.ultima_interacao,
    gabinete_id: sessaoResetada.gabinete_id,
  });

  if (error) {
    console.error("[Sessao] Erro ao resetar sessão:", error);
  }

  return sessaoResetada;
}
