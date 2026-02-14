/**
 * Cliente da Evolution API para envio de mensagens WhatsApp
 * ProviDATA - Sistema de Gestão de Providências
 */

import { EVOLUTION_CONFIG } from "./config";

interface SendTextOptions {
  number: string;
  text: string;
  delay?: number;
}

/**
 * Envia uma mensagem de texto via Evolution API
 */
export async function sendText(options: SendTextOptions): Promise<boolean> {
  const { number, text, delay = 1200 } = options;

  try {
    const url = `${EVOLUTION_CONFIG.baseUrl}/message/sendText/${EVOLUTION_CONFIG.instanceName}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: EVOLUTION_CONFIG.apiKey,
      },
      body: JSON.stringify({
        number,
        text,
        delay,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `[Evolution] Erro ao enviar mensagem para ${number}: ${response.status} - ${errorBody}`
      );
      return false;
    }

    console.log(`[Evolution] Mensagem enviada para ${number}`);
    return true;
  } catch (error) {
    console.error(`[Evolution] Erro de conexão ao enviar mensagem:`, error);
    return false;
  }
}

/**
 * Formata número de telefone para o padrão da Evolution API
 * Remove caracteres especiais e garante formato 55DDDNNNNNNNNN
 */
export function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  if (!cleaned.startsWith("55")) {
    cleaned = "55" + cleaned;
  }

  return cleaned;
}
