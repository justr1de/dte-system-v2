/**
 * Lógica principal do chatbot WhatsApp
 * Processa mensagens e avança o fluxo de etapas
 * ProviDATA - Sistema de Gestão de Providências
 */

import { ChatEtapa, MENSAGENS } from "./config";
import { sendText, formatPhoneNumber } from "./evolution";
import {
  getOrCreateSessao,
  atualizarSessao,
  resetarSessao,
  type Sessao,
} from "./sessao";
import {
  buscarGabinetesPorMunicipio,
  listarMunicipiosComGabinetes,
  buscarCategorias,
  getOrCreateCidadao,
  criarProvidencia,
} from "./database";

/**
 * Processa uma mensagem recebida do WhatsApp
 */
export async function processarMensagem(
  telefone: string,
  mensagem: string
): Promise<void> {
  const telefoneFormatado = formatPhoneNumber(telefone);
  const texto = mensagem.trim();

  // Comando especial: reiniciar
  if (
    texto.toLowerCase() === "reiniciar" ||
    texto.toLowerCase() === "menu" ||
    texto.toLowerCase() === "inicio"
  ) {
    await resetarSessao(telefoneFormatado);
    await sendText({
      number: telefoneFormatado,
      text: MENSAGENS.BOAS_VINDAS,
    });
    return;
  }

  // Buscar ou criar sessão
  const sessao = await getOrCreateSessao(telefoneFormatado);

  try {
    switch (sessao.etapa) {
      case ChatEtapa.INICIO:
        await handleInicio(telefoneFormatado, sessao);
        break;

      case ChatEtapa.AGUARDANDO_CIDADE:
        await handleMunicipio(telefoneFormatado, texto, sessao);
        break;

      case ChatEtapa.AGUARDANDO_GABINETE:
        await handleGabinete(telefoneFormatado, texto, sessao);
        break;

      case ChatEtapa.AGUARDANDO_NOME:
        await handleNome(telefoneFormatado, texto, sessao);
        break;

      case ChatEtapa.AGUARDANDO_CPF:
        await handleCpf(telefoneFormatado, texto, sessao);
        break;

      case ChatEtapa.AGUARDANDO_CATEGORIA:
        await handleCategoria(telefoneFormatado, texto, sessao);
        break;

      case ChatEtapa.AGUARDANDO_DESCRICAO:
        await handleDescricao(telefoneFormatado, texto, sessao);
        break;

      case ChatEtapa.CONFIRMACAO:
        await handleConfirmacao(telefoneFormatado, texto, sessao);
        break;

      case ChatEtapa.FINALIZADO:
        await resetarSessao(telefoneFormatado);
        await sendText({
          number: telefoneFormatado,
          text: MENSAGENS.BOAS_VINDAS,
        });
        break;

      default:
        await resetarSessao(telefoneFormatado);
        await sendText({
          number: telefoneFormatado,
          text: MENSAGENS.BOAS_VINDAS,
        });
    }
  } catch (error) {
    console.error(
      `[Chatbot] Erro ao processar mensagem de ${telefoneFormatado}:`,
      error
    );
    await sendText({
      number: telefoneFormatado,
      text: MENSAGENS.ERRO,
    });
  }
}

// ==================== HANDLERS POR ETAPA ====================

/**
 * Etapa INICIO: Envia boas-vindas e pede o município
 */
async function handleInicio(telefone: string, sessao: Sessao): Promise<void> {
  await atualizarSessao(telefone, {
    etapa: ChatEtapa.AGUARDANDO_CIDADE,
  });

  await sendText({
    number: telefone,
    text: MENSAGENS.BOAS_VINDAS,
  });
}

/**
 * Etapa AGUARDANDO_CIDADE: Recebe o município e lista gabinetes
 */
async function handleMunicipio(
  telefone: string,
  municipio: string,
  sessao: Sessao
): Promise<void> {
  const gabinetes = await buscarGabinetesPorMunicipio(municipio);

  if (gabinetes.length === 0) {
    const municipios = await listarMunicipiosComGabinetes();
    const listaMunicipios = municipios.map((m) => `  • ${m}`).join("\n");

    const msg = MENSAGENS.CIDADE_NAO_ENCONTRADA.replace(
      "{cidades}",
      listaMunicipios || "Nenhum município cadastrado"
    );

    await sendText({ number: telefone, text: msg });
    return;
  }

  // Salvar opções de gabinetes na sessão
  const gabinetesOpcoes = gabinetes.map((g, i) => ({
    id: g.id,
    nome: g.nome,
    index: i + 1,
  }));

  const listaGabinetes = gabinetesOpcoes
    .map((g) => `  *${g.index}.* ${g.nome}`)
    .join("\n");

  const municipioNormalizado = gabinetes[0].municipio || municipio;

  await atualizarSessao(telefone, {
    etapa: ChatEtapa.AGUARDANDO_GABINETE,
    cidade_informada: municipioNormalizado,
    dados_temporarios: {
      ...sessao.dados_temporarios,
      gabinetes_opcoes: gabinetesOpcoes,
    },
  });

  const msg = MENSAGENS.SELECIONAR_GABINETE.replace(
    "{cidade}",
    municipioNormalizado
  ).replace("{lista_gabinetes}", listaGabinetes);

  await sendText({ number: telefone, text: msg });
}

/**
 * Etapa AGUARDANDO_GABINETE: Recebe a seleção do gabinete
 */
async function handleGabinete(
  telefone: string,
  texto: string,
  sessao: Sessao
): Promise<void> {
  const opcoes = sessao.dados_temporarios.gabinetes_opcoes || [];
  const escolha = parseInt(texto);

  if (isNaN(escolha) || escolha < 1 || escolha > opcoes.length) {
    await sendText({
      number: telefone,
      text: `${MENSAGENS.OPCAO_INVALIDA}\n\nDigite um número de 1 a ${opcoes.length}:`,
    });
    return;
  }

  const gabineteEscolhido = opcoes[escolha - 1];

  await atualizarSessao(telefone, {
    etapa: ChatEtapa.AGUARDANDO_NOME,
    gabinete_selecionado_id: gabineteEscolhido.id,
    gabinete_id: gabineteEscolhido.id,
    dados_temporarios: {
      ...sessao.dados_temporarios,
      gabinete_nome: gabineteEscolhido.nome,
    },
  });

  const msg = MENSAGENS.PEDIR_NOME.replace(
    "{gabinete}",
    gabineteEscolhido.nome
  );
  await sendText({ number: telefone, text: msg });
}

/**
 * Etapa AGUARDANDO_NOME: Recebe o nome completo
 */
async function handleNome(
  telefone: string,
  nome: string,
  sessao: Sessao
): Promise<void> {
  if (nome.length < 3) {
    await sendText({
      number: telefone,
      text: "⚠️ Por favor, informe seu nome completo (mínimo 3 caracteres):",
    });
    return;
  }

  await atualizarSessao(telefone, {
    etapa: ChatEtapa.AGUARDANDO_CPF,
    dados_temporarios: {
      ...sessao.dados_temporarios,
      nome_completo: nome,
    },
  });

  const msg = MENSAGENS.PEDIR_CPF.replace("{nome}", nome);
  await sendText({ number: telefone, text: msg });
}

/**
 * Etapa AGUARDANDO_CPF: Recebe o CPF ou pula
 */
async function handleCpf(
  telefone: string,
  texto: string,
  sessao: Sessao
): Promise<void> {
  let cpf: string | undefined;

  if (
    texto.toLowerCase() !== "pular" &&
    texto.toLowerCase() !== "não" &&
    texto.toLowerCase() !== "nao" &&
    texto !== "0"
  ) {
    const cpfLimpo = texto.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
      await sendText({
        number: telefone,
        text: "⚠️ CPF inválido. Digite os 11 números do CPF ou *pular* para continuar sem CPF:",
      });
      return;
    }

    cpf = cpfLimpo;
  }

  // Buscar categorias do gabinete selecionado
  const gabineteId = sessao.gabinete_selecionado_id;
  if (!gabineteId) {
    await resetarSessao(telefone);
    await sendText({ number: telefone, text: MENSAGENS.ERRO });
    return;
  }

  const categorias = await buscarCategorias(gabineteId);

  if (categorias.length === 0) {
    // Sem categorias, pular para descrição
    await atualizarSessao(telefone, {
      etapa: ChatEtapa.AGUARDANDO_DESCRICAO,
      dados_temporarios: {
        ...sessao.dados_temporarios,
        cpf,
        categoria_id: undefined,
        categoria_nome: "Geral",
      },
    });

    await sendText({
      number: telefone,
      text: "✏️ Descreva detalhadamente o seu pedido de providência.\nQuanto mais informações, melhor poderemos atendê-lo:",
    });
    return;
  }

  const categoriasOpcoes = categorias.map((c, i) => ({
    id: c.id,
    nome: c.nome,
    index: i + 1,
  }));

  const listaCategorias = categoriasOpcoes
    .map((c) => `  *${c.index}.* ${c.nome}`)
    .join("\n");

  await atualizarSessao(telefone, {
    etapa: ChatEtapa.AGUARDANDO_CATEGORIA,
    dados_temporarios: {
      ...sessao.dados_temporarios,
      cpf,
      categorias_opcoes: categoriasOpcoes,
    },
  });

  const msg = MENSAGENS.SELECIONAR_CATEGORIA.replace(
    "{lista_categorias}",
    listaCategorias
  );
  await sendText({ number: telefone, text: msg });
}

/**
 * Etapa AGUARDANDO_CATEGORIA: Recebe a seleção da categoria
 */
async function handleCategoria(
  telefone: string,
  texto: string,
  sessao: Sessao
): Promise<void> {
  const opcoes = sessao.dados_temporarios.categorias_opcoes || [];
  const escolha = parseInt(texto);

  if (isNaN(escolha) || escolha < 1 || escolha > opcoes.length) {
    await sendText({
      number: telefone,
      text: `${MENSAGENS.OPCAO_INVALIDA}\n\nDigite um número de 1 a ${opcoes.length}:`,
    });
    return;
  }

  const categoriaEscolhida = opcoes[escolha - 1];

  await atualizarSessao(telefone, {
    etapa: ChatEtapa.AGUARDANDO_DESCRICAO,
    dados_temporarios: {
      ...sessao.dados_temporarios,
      categoria_id: categoriaEscolhida.id,
      categoria_nome: categoriaEscolhida.nome,
    },
  });

  const msg = MENSAGENS.PEDIR_DESCRICAO.replace(
    "{categoria}",
    categoriaEscolhida.nome
  );
  await sendText({ number: telefone, text: msg });
}

/**
 * Etapa AGUARDANDO_DESCRICAO: Recebe a descrição da providência
 */
async function handleDescricao(
  telefone: string,
  descricao: string,
  sessao: Sessao
): Promise<void> {
  if (descricao.length < 10) {
    await sendText({
      number: telefone,
      text: "⚠️ A descrição precisa ter pelo menos 10 caracteres. Por favor, descreva melhor o seu pedido:",
    });
    return;
  }

  await atualizarSessao(telefone, {
    etapa: ChatEtapa.CONFIRMACAO,
    dados_temporarios: {
      ...sessao.dados_temporarios,
      descricao,
    },
  });

  // Montar resumo para confirmação
  const dados = sessao.dados_temporarios;
  const descricaoResumida =
    descricao.length > 100 ? descricao.substring(0, 100) + "..." : descricao;

  const msg = MENSAGENS.CONFIRMACAO.replace(
    "{nome}",
    dados.nome_completo || "Não informado"
  )
    .replace("{cidade}", sessao.cidade_informada || "Não informado")
    .replace("{gabinete}", dados.gabinete_nome || "Não informado")
    .replace("{categoria}", dados.categoria_nome || "Geral")
    .replace("{descricao}", descricaoResumida);

  await sendText({ number: telefone, text: msg });
}

/**
 * Etapa CONFIRMACAO: Confirma ou cancela a providência
 */
async function handleConfirmacao(
  telefone: string,
  texto: string,
  sessao: Sessao
): Promise<void> {
  const resposta = texto.toLowerCase().trim();

  if (
    resposta === "sim" ||
    resposta === "s" ||
    resposta === "confirmar" ||
    resposta === "1"
  ) {
    // Criar cidadão
    const cidadao = await getOrCreateCidadao({
      telefone,
      nome: sessao.dados_temporarios.nome_completo || "Cidadão",
      cpf: sessao.dados_temporarios.cpf,
      cidade: sessao.cidade_informada || undefined,
      gabinete_id: sessao.gabinete_selecionado_id || undefined,
    });

    if (!cidadao) {
      await sendText({ number: telefone, text: MENSAGENS.ERRO });
      return;
    }

    // Criar providência
    const descricaoCompleta = sessao.dados_temporarios.descricao || "";
    const categoriaNome = sessao.dados_temporarios.categoria_nome || "Geral";
    const titulo = `[WhatsApp] ${categoriaNome} - ${descricaoCompleta.substring(0, 50)}`;

    const providencia = await criarProvidencia({
      cidadao_id: cidadao.id,
      gabinete_id: sessao.gabinete_selecionado_id!,
      categoria_id: sessao.dados_temporarios.categoria_id || "",
      titulo,
      descricao: descricaoCompleta,
    });

    if (!providencia) {
      await sendText({ number: telefone, text: MENSAGENS.ERRO });
      return;
    }

    // Sucesso!
    const agora = new Date();
    const dataFormatada = `${String(agora.getDate()).padStart(2, "0")}/${String(agora.getMonth() + 1).padStart(2, "0")}/${agora.getFullYear()} às ${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;

    const msg = MENSAGENS.PROVIDENCIA_CRIADA.replace(
      "{protocolo}",
      providencia.numero_protocolo
    ).replace("{data}", dataFormatada);

    await atualizarSessao(telefone, {
      etapa: ChatEtapa.FINALIZADO,
      dados_temporarios: {},
    });

    await sendText({ number: telefone, text: msg });
  } else if (
    resposta === "nao" ||
    resposta === "não" ||
    resposta === "n" ||
    resposta === "cancelar" ||
    resposta === "2"
  ) {
    await resetarSessao(telefone);
    await sendText({ number: telefone, text: MENSAGENS.CANCELADO });
  } else {
    await sendText({
      number: telefone,
      text: "Por favor, digite *SIM* para confirmar ou *NÃO* para cancelar:",
    });
  }
}
