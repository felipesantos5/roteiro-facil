import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import axios from "axios";
import { differenceInDays, format, parse, isValid, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// Configuração do CORS para permitir requisições de domínios específicos
const cors = Cors({
  methods: ["POST"],
  origin: (origin, callback) => {
    const whitelist = ["http://localhost:3000", "https://seusite.com"]; // Domínios permitidos
    if (origin && whitelist.includes(origin)) {
      callback(null, true); // Permite a requisição
    } else {
      callback(new Error("Not allowed by CORS")); // Bloqueia a requisição
    }
  },
});

// Função auxiliar para executar o middleware CORS
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        reject(result); // Rejeita a promessa em caso de erro
        return;
      }
      resolve(result); // Resolve a promessa com o resultado
    });
  });
}

// URL da Deepseek API e chave de API (obtida das variáveis de ambiente)
const DEEPSEEK_API_URL = "https://api.deepseek.com";
const DEEPSEEK_API_KEY = "sk-afddf6c7aae94ae69550235e7612c36a";

interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  interests: string[];
  budget: string;
}

// Função para analisar diferentes formatos de data
function parseDate(dateString: string): Date {
  const formats = ["yyyy-MM-dd'T'HH:mm:ss.SSSX", "yyyy-MM-dd", "dd/MM/yyyy"];

  for (const dateFormat of formats) {
    const parsedDate = parse(dateString, dateFormat, new Date(), { locale: ptBR });
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  throw new Error(`Invalid date format: ${dateString}`);
}

// Função principal para gerar o roteiro de viagem
export async function generateItinerary(tripData: TripData): Promise<string> {
  try {
    // Analisa as datas de início e término da viagem
    const startDate = parseDate(tripData.startDate);
    const endDate = parseDate(tripData.endDate);

    // Calcula a duração da viagem em dias
    const tripDuration = differenceInDays(endDate, startDate) + 1;

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

    // Define as mensagens a serem enviadas para a Deepseek API
    const messages = [
      {
        role: "system",
        content: "Você é um assistente especializado em criação de roteiros de viagem detalhados e personalizados. Forneça informações precisas e relevantes.",
      },
      {
        role: "user",
        content: buildDynamicPrompt(tripData),
      },
    ];

    // Envia a requisição para a Deepseek API
    const response = await axios.post(
      `${DEEPSEEK_API_URL}/chat/completions`,
      {
        model: "deepseek-chat",
        messages,
        temperature: 0.7, // Ajusta a aleatoriedade da resposta (0.0 a 1.0)
        max_tokens: 1500, // Limita o tamanho da resposta
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from Deepseek API:", response.data.choices[0]?.message?.content);

    // Retorna o conteúdo da resposta ou uma string vazia em caso de falha
    return response.data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Erro na geração do roteiro:", error);
    throw new Error("Falha ao gerar roteiro");
  }
}

// Handler principal da API Next.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Executa o middleware CORS para controlar o acesso à API
  await runMiddleware(req, res, cors);

  // Verifica se o método da requisição é POST
  if (req.method === "POST") {
    try {
      // Obtém os dados da viagem do corpo da requisição
      const tripData: TripData = req.body;

      // Valida se todos os dados necessários foram fornecidos
      if (!tripData.destination || !tripData.startDate || !tripData.endDate) {
        return res.status(400).json({ error: "Dados de viagem incompletos." });
      }

      // Gera o roteiro de viagem
      const itinerary = await generateItinerary(tripData);

      // Retorna o roteiro gerado como resposta
      res.status(200).json({ itinerary });
    } catch (error) {
      // Em caso de erro, retorna uma resposta de erro
      console.error("Erro na geração do roteiro:", error);
      res.status(500).json({ error: "Falha ao gerar roteiro. Por favor, tente novamente mais tarde." });
    }
  } else {
    // Se o método da requisição não for POST, retorna um erro
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
