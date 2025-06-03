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

    const buildDynamicPrompt = (data: TripData, sDate: Date, eDate: Date, duration: number): string => {
      const formattedStartDate = format(sDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      const formattedEndDate = format(addDays(sDate, duration - 1), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }); // Ajustar data final se tripDuration foi limitada

      return `Você é um especialista em planejamento de viagens com conhecimento detalhado sobre ${
        data.destination
      }. Crie um roteiro de viagem personalizado seguindo RIGOROSAMENTE este formato Markdown:

### Roteiro de Viagem para ${data.destination} (${formattedStartDate} a ${formattedEndDate})

---

${Array.from(
  { length: duration },
  (_, i) => `
#### Dia ${i + 1} (${format(addDays(sDate, i), "dd 'de' MMMM", { locale: ptBR })}):

**🕐 Manhã:**
🎌 [NOME DA ATIVIDADE DA MANHÃ]
✏️ [DESCRIÇÃO BREVE DA ATIVIDADE DA MANHÃ - MAX 3 LINHAS]
📍 [ENDEREÇO COMPLETO OU ÁREA DA ATIVIDADE DA MANHÃ]
💰 [CUSTO ESTIMADO POR PESSOA PARA A ATIVIDADE DA MANHÃ]
🌤️ [DICA DE CLIMA/VESTUÁRIO PARA A MANHÃ - 1 LINHA]

**🕐 Tarde:**
🎌 [NOME DA ATIVIDADE DA TARDE]
✏️ [DESCRIÇÃO BREVE DA ATIVIDADE DA TARDE - MAX 3 LINHAS]
📍 [ENDEREÇO COMPLETO OU ÁREA DA ATIVIDADE DA TARDE]
💰 [CUSTO ESTIMADO POR PESSOA PARA A ATIVIDADE DA TARDE]
🌤️ [DICA DE CLIMA/VESTUÁRIO PARA A TARDE - 1 LINHA]

**🕐 Noite:**
🎌 [NOME DA ATIVIDADE DA NOITE]
✏️ [DESCRIÇÃO BREVE DA ATIVIDADE DA NOITE - MAX 3 LINHAS]
📍 [ENDEREÇO COMPLETO OU ÁREA DA ATIVIDADE DA NOITE]
💰 [CUSTO ESTIMADO POR PESSOA PARA A ATIVIDADE DA NOITE]
🌤️ [DICA DE CLIMA/VESTUÁRIO PARA A NOITE - 1 LINHA]

---`
).join("\n")}

Considere as seguintes informações ao criar o roteiro:
- Interesses principais: ${data.interests.join(", ")}
- Faixa de orçamento: ${data.budget}

Instruções importantes:
1.  Siga RIGOROSAMENTE o formato Markdown fornecido, incluindo os emojis 🕐🎌✏️📍💰🌤️ e a estrutura de cada seção.
2.  As descrições (✏️) devem ser concisas, com no máximo 3 linhas.
3.  Inclua APENAS as informações solicitadas dentro dos colchetes []. Não adicione detalhes extras, explicações, notas de rodapé ou texto introdutório/conclusivo fora do formato especificado.
4.  Comece diretamente com "### Roteiro de Viagem" e termine após o último dia.
5.  Priorize experiências autênticas e locais.
6.  Equilibre atividades (ex: não coloque dois museus seguidos no mesmo período).
7.  Sugira atividades variadas e adequadas aos interesses e orçamento fornecidos.
8.  Para o campo 📍 ENDEREÇO COMPLETO, forneça o endereço da atração ou, se não aplicável (ex: "Caminhada pela orla"), o nome da área geral.
9.  Para o campo 💰 CUSTO ESTIMADO, use "Gratuito", "Baixo (até R$50)", "Médio (R$51-R$150)", "Alto (acima de R$150)" ou um valor específico (ex: "R$ 75 por pessoa").
10. Para o campo 🌤️ DICA DE CLIMA/VESTUÁRIO, seja breve e prático.
11. Se não houver uma atividade específica para um período (Manhã, Tarde ou Noite), deixe os campos em branco, mas mantenha a estrutura do período. Exemplo:
    **🕐 Manhã:**
    🎌 []
    ✏️ []
    📍 []
    💰 []
    🌤️ []`;
    };

    const messages = [
      {
        role: "system",
        content:
          "Você é um assistente especializado em criação de roteiros de viagem detalhados e personalizados. Forneça informações precisas e relevantes, seguindo estritamente o formato solicitado.",
      },
      {
        role: "user",
        content: buildDynamicPrompt(tripData, startDate, endDate, tripDuration),
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
