import axios from "axios";
import { differenceInDays, format, parseISO, addDays, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

const DEEPSEEK_API_URL = "https://api.deepseek.com"; // Ou sua URL configurada

interface TripData {
  destination: string;
  startDate: string; // Espera-se formato ISO string (ex: "2024-12-25T03:00:00.000Z")
  endDate: string; // Espera-se formato ISO string
  interests: string[];
  budget: string; // Ex: "Econômico", "Moderado", "Luxuoso"
}

// Função auxiliar para garantir que as datas são válidas
function parseValidDate(dateString: string, dateLabel: string): Date {
  const parsedDate = parseISO(dateString);
  if (!isValid(parsedDate)) {
    throw new Error(`Formato de data inválido para ${dateLabel}: ${dateString}. Use o formato ISO.`);
  }
  return parsedDate;
}

export async function generateItineraryWithAI(tripData: TripData): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error("DEEPSEEK_API_KEY não está configurada nas variáveis de ambiente do servidor.");
    throw new Error("Chave da API de IA não configurada no servidor.");
  }

  try {
    const startDate = parseValidDate(tripData.startDate, "Data de Início");
    const endDate = parseValidDate(tripData.endDate, "Data de Término");

    let tripDuration = differenceInDays(endDate, startDate) + 1;

    if (tripDuration <= 0) {
      throw new Error("A data final deve ser igual ou posterior à data inicial.");
    }
    if (tripDuration > 30) {
      // Limite para evitar prompts e respostas muito longos
      console.warn(`A duração da viagem (${tripDuration} dias) é longa. Limitando a 30 dias para a IA.`);
      tripDuration = 30; // Opcional: limitar a duração para a IA
      // Ou pode-se lançar um erro se preferir não limitar:
      // throw new Error("A duração da viagem é muito longa para gerar um roteiro detalhado (máx. 30 dias).");
    }

    const buildDynamicPrompt = (tripData: TripData): string => {
      return `Você é um especialista em planejamento de viagens com conhecimento detalhado sobre ${tripData.destination}. Crie um roteiro de viagem personalizado seguindo RIGOROSAMENTE este formato:
    
    ### Roteiro de Viagem para ${tripData.destination} (${format(tripData.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} a ${format(tripData.endDate, "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      })})
    
    ---
    
    ${Array.from(
      { length: tripDuration },
      (_, i) => `
    #### Dia ${i + 1} (${format(addDays(tripData.startDate, i), "dd 'de' MMMM", { locale: ptBR })}):
    
    **🕐 Manhã:**
    🎌 [NOME DA ATIVIDADE - Ex: Visita ao Museu Nacional]
    ✏️ [DESCRIÇÃO BREVE - MAX 2 LINHAS. Ex: Explore a história e a arte local. Destaque as principais exposições.]
    📍 [ENDEREÇO COMPLETO - Ex: Rua XV de Novembro, 123, Centro]
    💰 [CUSTO ESTIMADO - Ex: R$ 20 por pessoa]
    🌤️ [DICA DE CLIMA/VESTUÁRIO - 1 LINHA. Ex: Use roupas leves e confortáveis.]
    
    **🕐 Tarde:**
    🎌 [NOME DA ATIVIDADE - Ex: Passeio de Barco pela Baía]
    ✏️ [DESCRIÇÃO BREVE - MAX 2 LINHAS. Ex: Desfrute de vistas panorâmicas da cidade. Observe a vida marinha local.]
    📍 [ENDEREÇO COMPLETO - Ex: Cais dos Pescadores, s/n, Beira Mar]
    💰 [CUSTO ESTIMADO - Ex: R$ 50 por pessoa]
    🌤️ [DICA DE CLIMA/VESTUÁRIO - 1 LINHA. Ex: Leve um casaco, pois pode ventar.]
    
    **🕐 Noite:**
    🎌 [NOME DA ATIVIDADE - Ex: Jantar em Restaurante Típico]
    ✏️ [DESCRIÇÃO BREVE - MAX 2 LINHAS. Ex: Saboreie pratos tradicionais da região. Experimente a culinária local.]
    📍 [ENDEREÇO COMPLETO - Ex: Rua da Praia, 456, Centro Histórico]
    💰 [CUSTO ESTIMADO - Ex: R$ 80 por pessoa]
    🌤️ [DICA DE CLIMA/VESTUÁRIO - 1 LINHA. Ex: Vista-se casualmente elegante.]
    
    ---`
    ).join("\n")}
    
    Considere as seguintes informações ao criar o roteiro:
    - Interesses principais: ${tripData.interests.join(", ")} (Ex: história, natureza, gastronomia)
    - Faixa de orçamento: ${tripData.budget} (Ex: Econômico, Moderado, Luxo)
    
    Instruções importantes:
    1. Siga RIGOROSAMENTE o formato fornecido acima, incluindo os emojis e a estrutura de cada seção (Manhã, Tarde, Noite).
    2. Mantenha as descrições CONCISAS, com no máximo 2 linhas, focando nos pontos mais importantes da atividade.
    3. Inclua APENAS as informações solicitadas dentro dos colchetes []. Não adicione detalhes extras ou informações que não foram pedidas.
    4. NÃO adicione nenhum texto ou explicação adicional no início ou no final do roteiro. Comece diretamente com "### Roteiro de Viagem" e termine após o último dia.
    5. Priorize experiências autênticas e locais, evitando pontos turísticos excessivamente populares.
    6. Equilibre atividades físicas (caminhadas, esportes) e culturais (museus, teatros), oferecendo variedade ao viajante.
    7. Inclua opções para diferentes condições meteorológicas (atividades ao ar livre e em locais fechados), para que o roteiro seja flexível.
    8. Varie os tipos de atividades ao longo dos dias (ex: não coloque dois museus seguidos).
    9. Otimize o tempo de deslocamento entre as atividades, agrupando locais próximos sempre que possível.
    
    Exemplo de como preencher cada campo:
    - **🎌 NOME DA ATIVIDADE:** Coloque o nome da atração ou atividade.
    - **✏️ DESCRIÇÃO BREVE:** Descreva a atividade em poucas palavras, destacando o que a torna especial.
    - **📍 ENDEREÇO COMPLETO:** Inclua o endereço completo para facilitar a localização.
    - **💰 CUSTO ESTIMADO:** Indique o custo aproximado da atividade por pessoa.
    - **🌤️ DICA DE CLIMA/VESTUÁRIO:** Sugira roupas ou acessórios adequados para o clima previsto.
    
    Este prompt foi projetado para gerar uma saída que corresponda EXATAMENTE ao formato desejado, garantindo a consistência e a qualidade do roteiro.`;
    };

    const messages = [
      {
        role: "system",
        content:
          "Você é um assistente especializado em criação de roteiros de viagem detalhados e personalizados. Forneça informações precisas e relevantes, seguindo estritamente o formato solicitado.",
      },
      {
        role: "user",
        content: buildDynamicPrompt(tripData),
      },
    ];

    const aiResponse = await axios.post(
      `${DEEPSEEK_API_URL}/chat/completions`,
      { model: "deepseek-chat", messages, temperature: 0.6, max_tokens: 4090 },
      { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
    );

    if (aiResponse.data && aiResponse.data.choices && aiResponse.data.choices[0] && aiResponse.data.choices[0].message) {
      return aiResponse.data.choices[0].message.content || "";
    } else {
      console.error("Estrutura de resposta inesperada da API Deepseek:", aiResponse.data);
      throw new Error("Resposta inesperada da API de IA.");
    }
  } catch (error) {
    console.error("Erro na geração do roteiro pela IA:", error);
    if (axios.isAxiosError(error)) {
      console.error("Detalhes do erro Axios:", error.response?.status, error.response?.data);
    }
    throw new Error("Falha ao comunicar com a IA para gerar roteiro.");
  }
}
