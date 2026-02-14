/**
 * Configuração do módulo WhatsApp / Evolution API
 * ProviDATA - Sistema de Gestão de Providências
 *
 * Projeto Supabase: wntiupkhjtgiaxiicxeq (ProviDATA)
 * Região: us-west-2
 */

export const EVOLUTION_CONFIG = {
  baseUrl: process.env.EVOLUTION_API_URL || "http://34.39.236.69:8080",
  apiKey: process.env.EVOLUTION_API_KEY || "providata-evolution-key-2026",
  instanceName: process.env.EVOLUTION_INSTANCE_NAME || "DATA-RO",
};

export const SUPABASE_CONFIG = {
  url:
    process.env.SUPABASE_URL || "https://wntiupkhjtgiaxiicxeq.supabase.co",
  serviceKey:
    process.env.SUPABASE_SERVICE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndudGl1cGtoanRnaWF4aWljeGVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk2MzUzMSwiZXhwIjoyMDgyNTM5NTMxfQ.d0E7iX85NeUsxw3e0eH-IvLaXEks2RBWa0lUnTjbtEk",
};

/**
 * Etapas do fluxo do chatbot
 */
export enum ChatEtapa {
  INICIO = "inicio",
  AGUARDANDO_CIDADE = "aguardando_cidade",
  AGUARDANDO_GABINETE = "aguardando_gabinete",
  AGUARDANDO_NOME = "aguardando_nome",
  AGUARDANDO_CPF = "aguardando_cpf",
  AGUARDANDO_CATEGORIA = "aguardando_categoria",
  AGUARDANDO_DESCRICAO = "aguardando_descricao",
  CONFIRMACAO = "confirmacao",
  FINALIZADO = "finalizado",
}

/**
 * Tempo máximo de inatividade da sessão (30 minutos)
 */
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * Mensagens padrão do chatbot
 */
export const MENSAGENS = {
  BOAS_VINDAS: `🏛️ *ProviDATA - Sistema de Providências*

Olá! Sou o assistente virtual do ProviDATA, o sistema que conecta cidadãos aos seus representantes políticos.

Através de mim, você pode registrar pedidos de providência diretamente ao gabinete do seu representante.

📍 Para começar, me informe o *município* onde você reside:`,

  CIDADE_NAO_ENCONTRADA: `❌ Não encontramos gabinetes cadastrados para esse município.

Os municípios com gabinetes disponíveis são:
{cidades}

Por favor, digite o nome de um dos municípios acima:`,

  SELECIONAR_GABINETE: `📋 Encontramos os seguintes gabinetes em *{cidade}*:

{lista_gabinetes}

Digite o *número* do gabinete para o qual deseja enviar sua providência:`,

  PEDIR_NOME: `👤 Ótimo! Você selecionou o gabinete:
*{gabinete}*

Agora, por favor, informe seu *nome completo*:`,

  PEDIR_CPF: `📝 Obrigado, *{nome}*!

Informe seu *CPF* (apenas números) ou digite *pular* para continuar sem CPF:`,

  SELECIONAR_CATEGORIA: `📂 Agora selecione a *categoria* da sua providência:

{lista_categorias}

Digite o *número* da categoria:`,

  PEDIR_DESCRICAO: `✏️ Categoria selecionada: *{categoria}*

Agora descreva detalhadamente o seu pedido de providência.
Quanto mais informações, melhor poderemos atendê-lo:`,

  CONFIRMACAO: `📋 *Resumo da sua providência:*

👤 Nome: *{nome}*
📍 Município: *{cidade}*
🏛️ Gabinete: *{gabinete}*
📂 Categoria: *{categoria}*
📝 Descrição: {descricao}

Confirma o envio? Digite *SIM* para confirmar ou *NÃO* para cancelar:`,

  PROVIDENCIA_CRIADA: `✅ *Providência registrada com sucesso!*

📋 Protocolo: *{protocolo}*
📅 Data: {data}

Seu pedido foi encaminhado ao gabinete e será analisado em breve.

Guarde o número do protocolo para acompanhamento.

Para registrar uma nova providência, envie *menu*.`,

  CANCELADO: `❌ Providência cancelada.

Para iniciar um novo pedido, envie *menu*.`,

  ERRO: `⚠️ Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.

Se o problema persistir, envie *reiniciar* para começar do zero.`,

  OPCAO_INVALIDA: `⚠️ Opção inválida. Por favor, escolha uma das opções disponíveis.`,

  SESSAO_EXPIRADA: `⏰ Sua sessão expirou por inatividade.

Para iniciar um novo pedido, envie qualquer mensagem.`,
};
