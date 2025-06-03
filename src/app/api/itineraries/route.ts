import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ItineraryModel, { IItinerary } from "@/models/Itinerary"; // Importando IItinerary
import { generateItineraryWithAI } from "@/lib/aiItineraryGenerator";
import { generateSlug } from "@/lib/slugify";
import { format, parseISO, addDays, differenceInDays, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

// Função para processar o texto da IA e transformar em estrutura para o Schema
function processAIGeneratedTextToSchema(rawText: string, tripData: any, generatedSlug: string): Partial<IItinerary> {
  const startDate = parseISO(tripData.startDate);
  const endDate = parseISO(tripData.endDate);

  if (!isValid(startDate) || !isValid(endDate)) {
    console.error("Datas inválidas no processamento:", tripData.startDate, tripData.endDate);
    throw new Error("Datas de início ou término inválidas ao processar o roteiro.");
  }

  const tripDuration = differenceInDays(endDate, startDate) + 1;
  if (tripDuration <= 0) {
    throw new Error("A data final deve ser posterior à data inicial ao processar o roteiro.");
  }
  if (tripDuration > 60) {
    console.warn(`Duração da viagem (${tripDuration} dias) pode ser muito longa.`);
  }

  const itineraryDays: any[] = [];
  const dayBlocksText = rawText.replace(/### Roteiro de Viagem para[^\n]*\n---\s*\n?/, "");
  const dayBlocks = dayBlocksText.split(/#### Dia\s*\d+\s*\([^)]*\):\s*\n?/);

  for (let i = 1; i < dayBlocks.length; i++) {
    const blockContent = dayBlocks[i];
    if (!blockContent || blockContent.trim() === "") continue; // Pular blocos vazios

    const dayNumber = i;
    const actualDayDate = addDays(startDate, dayNumber - 1);
    const dayDateFormatted = format(actualDayDate, "dd 'de' MMMM", { locale: ptBR });

    const activities: any[] = [];
    const activityPeriods = ["Manhã", "Tarde", "Noite"];

    activityPeriods.forEach((period) => {
      const periodRegex = new RegExp(`\\*\\*🕐 ${period}:\\*\\*([\\s\\S]*?)(?=(\\n\\*\\*🕐|\\n#### Dia|\\n---|$))`, "m");
      const periodMatch = blockContent.match(periodRegex);

      if (periodMatch && periodMatch[1]) {
        const activitiesInPeriodBlock = periodMatch[1].trim();
        const individualActivityLines = activitiesInPeriodBlock
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        let currentActivity: any = null;
        individualActivityLines.forEach((line) => {
          if (line.startsWith("🎌")) {
            if (currentActivity && currentActivity.title && currentActivity.title.trim() !== "[]" && currentActivity.title.trim() !== "") {
              activities.push(currentActivity);
            }
            currentActivity = { period: period, id: uuidv4(), title: "", description: "", location: "", cost: "", weather: "", icon: "" }; // Inicializa com id
            currentActivity.title = line.replace(/^🎌\s*/, "").trim();
          } else if (currentActivity) {
            if (line.startsWith("✏️")) currentActivity.description = ((currentActivity.description || "") + line.replace(/^✏️\s*/, "").trim() + " ").trim();
            else if (line.startsWith("📍")) currentActivity.location = line.replace(/^📍\s*/, "").trim();
            else if (line.startsWith("💰")) currentActivity.cost = line.replace(/^💰\s*/, "").trim();
            else if (line.startsWith("🌤️")) currentActivity.weather = line.replace(/^🌤️\s*/, "").trim();
          }
        });
        if (currentActivity && currentActivity.title && currentActivity.title.trim() !== "[]" && currentActivity.title.trim() !== "") {
          activities.push(currentActivity);
        }
      }
    });

    activities.forEach((act) => {
      if (act.period.toLowerCase().includes("tarde")) act.icon = "Sunset";
      else if (act.period.toLowerCase().includes("noite")) act.icon = "Moon";
      else act.icon = "Sun";
      Object.keys(act).forEach((key) => {
        if (act[key] === "[]") act[key] = "";
      });
    });

    if (activities.length > 0) {
      itineraryDays.push({ day: dayNumber, date: dayDateFormatted, activities });
    }
  }

  const startDateFormatted = format(startDate, "dd/MM/yyyy", { locale: ptBR });
  const endDateFormatted = format(endDate, "dd/MM/yyyy", { locale: ptBR });

  return {
    id: uuidv4(), // <-- ADICIONADO: Gerar um ID único para o itinerário
    slug: generatedSlug,
    title: `Roteiro de Viagem para ${tripData.destination}`,
    destination: tripData.destination,
    startDate: tripData.startDate,
    endDate: tripData.endDate,
    dates: `${startDateFormatted} - ${endDateFormatted}`,
    duration: `${tripDuration} dia(s)`,
    budget: tripData.budget,
    interests: tripData.interests,
    totalCost: tripData.budget,
    days: itineraryDays,
    rawContent: rawText,
    // userId: tripData.userId, // Adicionar se houver autenticação
  };
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const tripData = await req.json();

    if (!tripData.destination || !tripData.startDate || !tripData.endDate || !tripData.interests || !tripData.budget) {
      return NextResponse.json({ error: "Dados da viagem incompletos." }, { status: 400 });
    }
    console.log("Dados recebidos para gerar itinerário:", tripData);

    const rawItineraryText = await generateItineraryWithAI(tripData);
    if (!rawItineraryText || rawItineraryText.trim() === "") {
      console.error("Resposta da IA vazia.");
      return NextResponse.json({ error: "Falha ao gerar conteúdo do roteiro pela IA (resposta vazia)." }, { status: 500 });
    }
    console.log("Texto bruto da IA (início):", rawItineraryText.substring(0, 500) + "...");

    const slug = generateSlug(`${tripData.destination}-${Date.now()}`);

    console.log("Processando texto da IA para o schema...");
    const processedItineraryData = processAIGeneratedTextToSchema(rawItineraryText, tripData, slug);

    console.log("Dados processados para salvar (início):", JSON.stringify(processedItineraryData, null, 2).substring(0, 500) + "...");

    const newItinerary = new ItineraryModel(processedItineraryData);
    await newItinerary.save();
    console.log("Itinerário salvo com slug:", newItinerary.slug, "e ID:", newItinerary.id);

    return NextResponse.json({ success: true, slug: newItinerary.slug, itinerary: newItinerary.toObject() }, { status: 201 });
  } catch (error: any) {
    console.error("Erro CRÍTICO ao criar itinerário (API):", error.message, error.stack);
    let errorMessage = "Falha ao criar itinerário.";
    // Tenta extrair mensagem de erro da IA se for um erro Axios
    if (error.isAxiosError && error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      errorMessage = `Erro da API da IA: ${error.response.data.error.message}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage, details: error.stack }, { status: 500 });
  }
}
