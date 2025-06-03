// src/pages/api/itineraries.ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import ItineraryModel from "@/models/Itinerary"; // Certifique-se que o path está correto
import { generateItineraryWithAI } from "@/lib/aiItineraryGenerator"; // Importa a função refatorada
import { generateSlug } from "@/lib/slugify"; // Sua função de slug
import { format, parseISO, addDays, differenceInDays, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid"; // Para IDs de atividades

// Função para processar o texto da IA. Esta é uma versão mais robusta.
function processAIGeneratedTextToSchema(rawText: string, tripData: any, generatedSlug: string): any {
  const startDate = parseISO(tripData.startDate);
  const endDate = parseISO(tripData.endDate);

  if (!isValid(startDate) || !isValid(endDate)) {
    throw new Error("Datas de início ou término inválidas no processamento.");
  }

  const tripDuration = differenceInDays(endDate, startDate) + 1;
  if (tripDuration <= 0) {
    throw new Error("A data final deve ser posterior à data inicial no processamento.");
  }

  const itineraryDays: any[] = [];
  // Remove o cabeçalho inicial "### Roteiro de Viagem para..." e divide por "#### Dia"
  const dayBlocks = rawText
    .replace(/### Roteiro de Viagem para[^\n]+\n---\n/, "")
    .split("#### Dia")
    .slice(1);

  dayBlocks.forEach((block, index) => {
    const dayNumber = index + 1;
    const dayDate = format(addDays(startDate, index), "dd 'de' MMMM", { locale: ptBR }); // Calcula a data do dia

    const activities: any[] = [];
    const activityTypes = ["Manhã", "Tarde", "Noite"];

    activityTypes.forEach((type) => {
      const regex = new RegExp(`\\*\\*🕐 ${type}:\\*\\*([\\s\\S]*?)(?=\\n\\*\\*🕐|\\n---|$)`, "m");
      const match = block.match(regex);

      if (match && match[1]) {
        const content = match[1].trim();
        const lines = content
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        // Tenta extrair múltiplos blocos de atividade dentro de um período
        let currentActivity: any = null;
        lines.forEach((line) => {
          if (line.startsWith("🎌")) {
            if (currentActivity) activities.push(currentActivity); // Salva a atividade anterior
            currentActivity = { period: type, id: uuidv4() }; // Inicia nova atividade
            currentActivity.title = line.replace(/^🎌\s*/, "").trim();
          } else if (currentActivity) {
            if (line.startsWith("✏️")) currentActivity.description = (currentActivity.description || "") + line.replace(/^✏️\s*/, "").trim() + " ";
            else if (line.startsWith("📍")) currentActivity.location = line.replace(/^📍\s*/, "").trim();
            else if (line.startsWith("💰")) currentActivity.cost = line.replace(/^💰\s*/, "").trim();
            else if (line.startsWith("🌤️")) currentActivity.weather = line.replace(/^🌤️\s*/, "").trim();
          }
        });
        if (currentActivity && currentActivity.title) activities.push(currentActivity); // Salva a última atividade do bloco/período
      }
    });

    // Adiciona ícone a cada atividade processada
    activities.forEach((act) => {
      if (act.period.toLowerCase().includes("tarde")) act.icon = "Sunset";
      else if (act.period.toLowerCase().includes("noite")) act.icon = "Moon";
      else act.icon = "Sun";
      if (act.description) act.description = act.description.trim();
    });

    if (activities.length > 0) {
      itineraryDays.push({ day: dayNumber, date: dayDate, activities });
    }
  });

  const startDateFormatted = format(startDate, "dd/MM/yyyy", { locale: ptBR });
  const endDateFormatted = format(endDate, "dd/MM/yyyy", { locale: ptBR });

  return {
    slug: generatedSlug,
    title: `Roteiro de Viagem para ${tripData.destination}`,
    destination: tripData.destination,
    startDate: tripData.startDate, // Salva como ISO string
    endDate: tripData.endDate, // Salva como ISO string
    dates: `${startDateFormatted} - ${endDateFormatted}`,
    duration: `${tripDuration} dia(s)`,
    budget: tripData.budget,
    interests: tripData.interests,
    totalCost: tripData.budget,
    days: itineraryDays,
    rawContent: rawText,
    // userId: tripData.userId, // Adicione se houver autenticação
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await dbConnect();
      const tripData = req.body;

      // Validação básica dos dados de entrada
      if (!tripData.destination || !tripData.startDate || !tripData.endDate || !tripData.interests || !tripData.budget) {
        return res.status(400).json({ error: "Dados da viagem incompletos." });
      }

      // 1. Gerar conteúdo do roteiro com a IA
      const rawItineraryText = await generateItineraryWithAI(tripData);
      if (!rawItineraryText || rawItineraryText.trim() === "") {
        throw new Error("Falha ao gerar conteúdo do roteiro pela IA (resposta vazia).");
      }

      // 2. Gerar um slug
      // Para garantir unicidade, pode ser necessário consultar o banco e adicionar um sufixo se o slug já existir.
      // Por simplicidade, adicionamos um timestamp aqui.
      const slug = generateSlug(`${tripData.destination}-${Date.now()}`);

      // 3. Processar o texto da IA para o formato do schema
      const processedItineraryData = processAIGeneratedTextToSchema(rawItineraryText, tripData, slug);

      // 4. Salvar no MongoDB
      const newItinerary = new ItineraryModel(processedItineraryData);
      await newItinerary.save();

      res.status(201).json({ success: true, slug: newItinerary.slug, itinerary: newItinerary });
    } catch (error: any) {
      console.error("Erro detalhado ao criar itinerário:", error, error.stack);
      let errorMessage = "Falha ao criar itinerário.";
      if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
        errorMessage = `Erro da API da IA: ${error.response.data.error.message}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
