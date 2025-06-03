// src/app/api/itineraries/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ItineraryModel from "@/models/Itinerary"; // Certifique-se que o path está correto
import { generateItineraryWithAI } from "@/lib/aiItineraryGenerator"; // Importa a função refatorada
import { generateSlug } from "@/lib/slugify"; // Sua função de slug
import { format, parseISO, addDays, differenceInDays, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

// Sua função processAIGeneratedTextToSchema (como você a definiu)
// Cole a função processAIGeneratedTextToSchema que você já tem aqui.
// Exemplo (adapte com a sua lógica mais recente):
function processAIGeneratedTextToSchema(rawText: string, tripData: any, generatedSlug: string): any {
  const startDate = parseISO(tripData.startDate);
  const endDate = parseISO(tripData.endDate);

  if (!isValid(startDate) || !isValid(endDate)) {
    console.error("Datas inválidas recebidas no processamento:", tripData.startDate, tripData.endDate);
    throw new Error("Datas de início ou término inválidas no processamento.");
  }

  const tripDuration = differenceInDays(endDate, startDate) + 1;
  if (tripDuration <= 0) {
    throw new Error("A data final deve ser posterior à data inicial no processamento.");
  }
  if (tripDuration > 60) {
    // Aumentando um pouco o limite, mas ainda é bom ter um.
    console.warn(`Duração da viagem (${tripDuration} dias) pode ser muito longa.`);
    // throw new Error("A duração da viagem é muito longa.");
  }

  const itineraryDays: any[] = [];
  const dayBlocks = rawText
    .replace(/### Roteiro de Viagem para[^\n]*\n---\n?/, "") // Torna o \n opcional após ---
    .split(/#### Dia\s*\d+\s*\([^)]*\):\s*\n?/); // Divide pelos cabeçalhos de dia

  // O primeiro elemento após o split pode ser vazio ou lixo antes do primeiro "#### Dia" real
  // Precisamos filtrar blocos vazios e processar corretamente
  dayBlocks.slice(1).forEach((blockContent, index) => {
    const dayNumber = index + 1; // O número do dia real
    const actualDayDate = addDays(startDate, index); // Calcula a data correta para o dia
    const dayDateFormatted = format(actualDayDate, "dd 'de' MMMM", { locale: ptBR });

    const activities: any[] = [];
    const activityPeriods = ["Manhã", "Tarde", "Noite"];

    activityPeriods.forEach((period) => {
      // Regex para capturar blocos de atividades dentro de cada período
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
            if (currentActivity && currentActivity.title) activities.push(currentActivity);
            currentActivity = { period: period, id: uuidv4() };
            currentActivity.title = line.replace(/^🎌\s*/, "").trim();
          } else if (currentActivity) {
            if (line.startsWith("✏️")) currentActivity.description = (currentActivity.description || "") + line.replace(/^✏️\s*/, "").trim() + " ";
            else if (line.startsWith("📍")) currentActivity.location = line.replace(/^📍\s*/, "").trim();
            else if (line.startsWith("💰")) currentActivity.cost = line.replace(/^💰\s*/, "").trim();
            else if (line.startsWith("🌤️")) currentActivity.weather = line.replace(/^🌤️\s*/, "").trim();
          }
        });
        if (currentActivity && currentActivity.title) activities.push(currentActivity); // Salva a última atividade
      }
    });

    activities.forEach((act) => {
      if (act.period.toLowerCase().includes("tarde")) act.icon = "Sunset";
      else if (act.period.toLowerCase().includes("noite")) act.icon = "Moon";
      else act.icon = "Sun"; // Manhã ou default
      if (act.description) act.description = act.description.trim();
    });

    if (activities.length > 0) {
      itineraryDays.push({ day: dayNumber, date: dayDateFormatted, activities });
    }
  });

  const startDateFormatted = format(startDate, "dd/MM/yyyy", { locale: ptBR });
  const endDateFormatted = format(endDate, "dd/MM/yyyy", { locale: ptBR });

  return {
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
  };
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const tripData = await req.json(); // No App Router, o corpo da requisição é obtido com await req.json()

    // Validação básica dos dados de entrada
    if (!tripData.destination || !tripData.startDate || !tripData.endDate || !tripData.interests || !tripData.budget) {
      return NextResponse.json({ error: "Dados da viagem incompletos." }, { status: 400 });
    }

    // 1. Gerar conteúdo do roteiro com a IA
    const rawItineraryText = await generateItineraryWithAI(tripData);
    if (!rawItineraryText || rawItineraryText.trim() === "") {
      return NextResponse.json({ error: "Falha ao gerar conteúdo do roteiro pela IA (resposta vazia)." }, { status: 500 });
    }

    // 2. Gerar um slug
    const slug = generateSlug(`${tripData.destination}-${Date.now()}`);

    // 3. Processar o texto da IA para o formato do schema
    const processedItineraryData = processAIGeneratedTextToSchema(rawItineraryText, tripData, slug);

    if (!processedItineraryData.days || processedItineraryData.days.length === 0) {
      console.warn("Nenhum dia/atividade processado do texto da IA.", rawItineraryText);
      // Decida se isso é um erro ou se um roteiro vazio (mas com outros dados) é aceitável
      // return NextResponse.json({ error: "Não foi possível extrair atividades do roteiro gerado." }, { status: 500 });
    }

    // 4. Salvar no MongoDB
    const newItinerary = new ItineraryModel(processedItineraryData);
    await newItinerary.save();

    return NextResponse.json({ success: true, slug: newItinerary.slug, itinerary: newItinerary }, { status: 201 });
  } catch (error: any) {
    console.error("Erro detalhado ao criar itinerário (API):", error, error.stack);
    let errorMessage = "Falha ao criar itinerário.";
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      errorMessage = `Erro da API da IA: ${error.response.data.error.message}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
