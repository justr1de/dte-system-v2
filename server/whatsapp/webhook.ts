/**
 * Rota de webhook para receber eventos da Evolution API
 * ProviDATA - Sistema de Gestão de Providências
 *
 * Registra a rota POST /api/evolution/webhook no Express
 */

import type { Express, Request, Response } from "express";
import { processarMensagem } from "./chatbot";
import { EVOLUTION_CONFIG } from "./config";

/**
 * Payload recebido da Evolution API (evento MESSAGES_UPSERT)
 */
interface EvolutionWebhookPayload {
  event: string;
  instance: string;
  data: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    pushName?: string;
    message?: {
      conversation?: string;
      extendedTextMessage?: {
        text?: string;
      };
      imageMessage?: unknown;
      audioMessage?: unknown;
      documentMessage?: unknown;
    };
    messageType?: string;
    messageTimestamp?: number;
  };
  destination?: string;
  date_time?: string;
  sender?: string;
  server_url?: string;
  apikey?: string;
}

/**
 * Extrai o texto da mensagem do payload da Evolution API
 */
function extrairTextoMensagem(
  payload: EvolutionWebhookPayload
): string | null {
  const message = payload.data?.message;
  if (!message) return null;

  if (message.conversation) {
    return message.conversation;
  }

  if (message.extendedTextMessage?.text) {
    return message.extendedTextMessage.text;
  }

  return null;
}

/**
 * Extrai o número de telefone do remetente
 * O remoteJid vem no formato: 5569999089202@s.whatsapp.net
 */
function extrairTelefone(remoteJid: string): string {
  return remoteJid.split("@")[0];
}

/**
 * Verifica se a mensagem deve ser processada
 */
function deveProcessar(payload: EvolutionWebhookPayload): boolean {
  if (payload.data?.key?.fromMe) return false;

  const remoteJid = payload.data?.key?.remoteJid || "";
  if (remoteJid.includes("@g.us")) return false;
  if (remoteJid === "status@broadcast") return false;
  if (payload.event !== "messages.upsert") return false;

  return true;
}

/**
 * Registra as rotas de webhook no Express
 */
export function registerWebhookRoutes(app: Express): void {
  // Rota principal do webhook - recebe eventos da Evolution API
  app.post("/api/evolution/webhook", async (req: Request, res: Response) => {
    try {
      const payload = req.body as EvolutionWebhookPayload;

      console.log(
        `[Webhook] Evento recebido: ${payload.event} de ${payload.instance || "desconhecido"}`
      );

      // Responder imediatamente para não bloquear a Evolution API
      res.status(200).json({ status: "ok" });

      // Verificar se deve processar
      if (!deveProcessar(payload)) {
        console.log(
          "[Webhook] Mensagem ignorada (fromMe, grupo ou evento não suportado)"
        );
        return;
      }

      // Extrair texto da mensagem
      const texto = extrairTextoMensagem(payload);
      if (!texto) {
        console.log(
          "[Webhook] Mensagem sem texto (mídia, áudio, etc.) - ignorada"
        );
        return;
      }

      // Extrair telefone do remetente
      const telefone = extrairTelefone(payload.data.key.remoteJid);

      console.log(
        `[Webhook] Processando mensagem de ${telefone}: "${texto.substring(0, 50)}${texto.length > 50 ? "..." : ""}"`
      );

      // Processar mensagem no chatbot (assíncrono, não bloqueia a resposta)
      await processarMensagem(telefone, texto);
    } catch (error) {
      console.error("[Webhook] Erro ao processar webhook:", error);
    }
  });

  // Rota GET para verificação de saúde do webhook
  app.get("/api/evolution/webhook", (_req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      service: "ProviDATA WhatsApp Chatbot",
      instance: EVOLUTION_CONFIG.instanceName,
      timestamp: new Date().toISOString(),
    });
  });

  // Rota de status do chatbot
  app.get("/api/evolution/status", async (_req: Request, res: Response) => {
    try {
      const evolutionResponse = await fetch(
        `${EVOLUTION_CONFIG.baseUrl}/instance/connectionState/${EVOLUTION_CONFIG.instanceName}`,
        {
          headers: { apikey: EVOLUTION_CONFIG.apiKey },
        }
      );

      const evolutionData = await evolutionResponse.json();

      res.status(200).json({
        chatbot: "online",
        evolution_api: {
          url: EVOLUTION_CONFIG.baseUrl,
          instance: EVOLUTION_CONFIG.instanceName,
          connection: evolutionData,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(200).json({
        chatbot: "online",
        evolution_api: {
          url: EVOLUTION_CONFIG.baseUrl,
          instance: EVOLUTION_CONFIG.instanceName,
          connection: "error - unable to reach Evolution API",
        },
        timestamp: new Date().toISOString(),
      });
    }
  });

  console.log("[Webhook] Rotas do chatbot WhatsApp registradas:");
  console.log("  POST /api/evolution/webhook");
  console.log("  GET  /api/evolution/webhook");
  console.log("  GET  /api/evolution/status");
}
