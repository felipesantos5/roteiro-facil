import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import axios from "axios";
import { differenceInDays, format, parse, isValid } from "date-fns";
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
  // try {
  //   // Analisa as datas de início e término da viagem
  //   const startDate = parseDate(tripData.startDate);
  //   const endDate = parseDate(tripData.endDate);

  //   // Calcula a duração da viagem em dias
  //   const tripDuration = differenceInDays(endDate, startDate) + 1;

  //   // Função para construir o prompt dinâmico para a Deepseek API
  //   const buildDynamicPrompt = (tripData: TripData): string => {
  //     return `Você é um especialista em planejamento de viagens com conhecimento detalhado sobre ${tripData.destination}. Crie um roteiro de viagem personalizado considerando:

  //   1. Contexto do viajante:
  //   - Destino: ${tripData.destination}
  //   - Data de início: ${format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
  //   - Data de término: ${format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
  //   - Duração da viagem: ${tripDuration} dias
  //   - Interesses principais: ${tripData.interests.join(", ")} (Ex: museus, gastronomia, natureza)
  //   - Faixa de orçamento: ${tripData.budget} (Ex: econômico, moderado, luxuoso)

  //   2. Requisitos do Roteiro:
  //   Para cada dia, forneça um plano detalhado incluindo:
  //   → Período do dia (Manhã/Tarde/Noite)
  //   → Nome do local/atividade
  //   → Descrição detalhada (50-70 palavras) destacando elementos únicos, aspectos culturais e como se relaciona aos interesses do viajante
  //   → Localização exata (Endereço)
  //   → Custo médio da atividade ou local (em moeda local)
  //   → Considerações climáticas e dicas relevantes para a época do ano (Ex: roupas adequadas, eventos sazonais)

  //   3. Restrições:
  //   - Evitar turismo massificado, priorizando experiências autênticas
  //   - Balancear atividades físicas e culturais para atender a diferentes preferências
  //   - Incluir opções para diferentes condições meteorológicas (Ex: atividades indoor em dias chuvosos)

  //   Formato exigido para cada dia:

  //   Dia X (${format(startDate, "dd 'de' MMMM", { locale: ptBR })}):
  //   🕐 Manhã/Tarde/Noite:
  //   🎌 [Nome da Atividade/Local]
  //   ✏️ [Descrição detalhada]
  //   📍 [Localização exata]
  //   💰 [Custo médio]
  //   🌤️ [Considerações climáticas e dicas]`;
  //   };

  //   // Define as mensagens a serem enviadas para a Deepseek API
  //   const messages = [
  //     {
  //       role: "system",
  //       content: "Você é um assistente especializado em criação de roteiros de viagem detalhados e personalizados. Forneça informações precisas e relevantes.",
  //     },
  //     {
  //       role: "user",
  //       content: buildDynamicPrompt(tripData),
  //     },
  //   ];

  //   // Envia a requisição para a Deepseek API
  //   const response = await axios.post(
  //     `${DEEPSEEK_API_URL}/chat/completions`,
  //     {
  //       model: "deepseek-chat",
  //       messages,
  //       temperature: 0.7, // Ajusta a aleatoriedade da resposta (0.0 a 1.0)
  //       max_tokens: 1500, // Limita o tamanho da resposta
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   console.log("Response from Deepseek API:", response.data);

  //   // Retorna o conteúdo da resposta ou uma string vazia em caso de falha
  //   return response.data.choices[0]?.message?.content || "";
  // } catch (error) {
  //   console.error("Erro na geração do roteiro:", error);
  //   throw new Error("Falha ao gerar roteiro");
  // }

  return `"### Roteiro de Viagem para Florianópolis, SC (16 a 18 de março de 2025)

---

#### Dia 1 (16 de março):  
**🕐 Manhã:** 
🎌 Mercado Público de Florianópolis 
✏️ Explore o coração histórico e cultural da cidade. O mercado oferece uma variedade de produtos locais, como artesanato, frutos do mar frescos e comidas típicas. Experimente a sequência de camarão, prato tradicional da região.  
📍 R. Jerônimo Coelho, 60 - Centro, Florianópolis - SC  
💰 R$ 50-100 (refeição + compras)  
🌤️ Março é quente e úmido. Use roupas leves e calçados confortáveis. Leve um guarda-chuva, pois chuvas rápidas são comuns.  

**🕐 Tarde:**  
🎌 Fortaleza de São José da Ponta Grossa  
✏️ Visite esta fortaleza do século XVIII, parte do sistema de defesa da ilha. A estrutura histórica e a vista panorâmica do mar são imperdíveis. Ótimo para fotos e para aprender sobre a história colonial do Brasil.  
📍 Rod. SC-401, km 12 - Praia do Forte, Florianópolis - SC  
💰 R$ 10 (entrada)  
🌤️ Use protetor solar e chapéu, pois a área é aberta e ensolarada.  

**🕐 Noite:**  
🎌 Restaurante Ostradamus  
✏️ Desfrute de uma experiência gastronômica autêntica com frutos do mar frescos. O restaurante é conhecido por sua atmosfera acolhedora e pratos como ostras e moquecas.  
📍 R. Laurindo Januário da Silveira, 463 - Lagoa da Conceição, Florianópolis - SC  
💰 R$ 100-150 por pessoa  
🌤️ Noite agradável, leve um casaco leve para o vento da lagoa.  

---

#### Dia 2 (17 de março):  
**🕐 Manhã:**  
🎌 Trilha da Lagoinha do Leste  
✏️ Uma das trilhas mais bonitas da ilha, com paisagens deslumbrantes de mata atlântica e uma praia isolada. Ideal para quem gosta de natureza e atividades físicas moderadas.  
📍 Acesso pela Praia do Matadeiro ou Costa de Dentro - Florianópolis - SC  
💰 Gratuito  
🌤️ Use tênis de trilha, leve água e lanches leves. Março é quente, então comece cedo para evitar o calor intenso.  

**🕐 Tarde:**  
🎌 Museu Histórico de Santa Catarina (Palácio Cruz e Sousa)
✏️ Conheça a história do estado em um palácio do século XIX, com exposições sobre cultura, política e arte. A arquitetura neoclássica é impressionante.  
📍 Praça XV de Novembro, 227 - Centro, Florianópolis - SC  
💰 R$ 10 (entrada)  
🌤️ Atividade indoor, ideal para o período mais quente do dia.  

**🕐 Noite:**  
**🎌 Feirinha da Lagoa da Conceição**  
✏️ Uma feira ao ar livre com artesanato local, comidas típicas e apresentações culturais. Ótima oportunidade para comprar lembranças e interagir com os moradores.  
📍 Av. Afonso Delambert Neto, 709 - Lagoa da Conceição, Florianópolis - SC  
💰 R$ 30-50 (compras e lanches)  
🌤️ Noite agradável, leve um casaco leve.  

---

#### Dia 3 (18 de março):  
**🕐 Manhã:**  
**🎌 Praia Mole**  
✏️ Uma das praias mais famosas de Florianópolis, conhecida por suas ondas fortes e paisagem deslumbrante. Ideal para relaxar ou praticar surf.  
📍 Rod. Jornalista Maurício Sirotsky Sobrinho, s/n - Lagoa da Conceição, Florianópolis - SC  
💰 Gratuito  
🌤️ Use protetor solar e leve uma canga ou toalha.  

**🕐 Tarde:**  
**🎌 Projeto Tamar Florianópolis**  
✏️ Conheça o trabalho de conservação das tartarugas marinhas. O centro tem exposições interativas e tanques com espécies locais.  
📍 R. Prof. Ademir Francisco, 140 - Barra da Lagoa, Florianópolis - SC  
💰 R$ 24 (entrada)  
🌤️ Atividade indoor, ideal para o período mais quente do dia.  

**🕐 Noite:**  
**🎌 Bar do Arante**  
✏️ Um bar tradicional na Praia do Arante, conhecido por sua atmosfera descontraída e pratos como o pastel de camarão. Ótimo para encerrar a viagem com um jantar à beira-mar.  
📍 R. Abelardo Otacílio Gomes, 228 - Praia do Arante, Florianópolis - SC  
💰 R$ 80-120 por pessoa  
🌤️ Noite agradável, leve um casaco leve para o vento da praia.  

---

### Considerações Finais:  
- **Clima em março:** Quente e úmido, com possibilidade de chuvas rápidas. Leve roupas leves, protetor solar e um guarda-chuva.  
- **Transporte:** Alugue um carro para facilitar o deslocamento entre as praias e pontos turísticos.  
- **Orçamento:** Moderado, com gastos médios de R$ 300-400 por dia, incluindo alimentação, transporte e ingressos.  

Boa viagem! 🌴"`;
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
