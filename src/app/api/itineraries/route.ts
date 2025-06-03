// Local: src/app/api/itineraries/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ItineraryModel, { IItinerary, IDay, IActivity } from "@/models/Itinerary";
import { generateItineraryWithAI } from "@/lib/aiItineraryGenerator";
import { generateSlug } from "@/lib/slugify";
import { format, parseISO, addDays, differenceInDays, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

function processAIGeneratedTextToSchema(rawText: string, tripData: any, generatedSlug: string): Partial<IItinerary> {
  console.log("==== INICIANDO processAIGeneratedTextToSchema ====");
  // Removendo o log completo do rawText daqui para evitar poluir muito,
  // mas você pode reativá-lo para depuração profunda se necessário.
  // console.log("Texto Bruto Recebido da IA (completo):\n", rawText);

  const startDate = parseISO(tripData.startDate);
  const endDate = parseISO(tripData.endDate);

  if (!isValid(startDate) || !isValid(endDate)) {
    console.error("Datas inválidas no processamento:", tripData.startDate, tripData.endDate);
    throw new Error("Datas de início ou término inválidas ao processar o roteiro.");
  }

  const tripDuration = differenceInDays(endDate, startDate) + 1;
  // ... (validações de tripDuration) ...

  const itineraryDays: IDay[] = [];

  // 1. Limpa o cabeçalho principal do roteiro
  const contentWithoutMainHeader = rawText.replace(/^### Roteiro de Viagem para[^\n]*\n---\s*\n?/m, "").trim();

  // 2. Divide o conteúdo restante em blocos de dia.
  // O regex para dividir por dia. Ele captura o cabeçalho do dia para referência, se necessário,
  // mas o importante é o que vem *depois* do split.
  // Usamos um lookahead positivo para manter o delimitador no início do próximo bloco, facilitando o parse do cabeçalho do dia se preciso.
  // Ou, mais simples, split e ignora o primeiro elemento se ele for vazio ou não for um bloco de dia.
  const dayBlocks = contentWithoutMainHeader.split(/\n(?=#### Dia\s*\d+)/); // Divide antes de "#### Dia"

  console.log("Blocos de Dia Brutos (após split inicial):", JSON.stringify(dayBlocks, null, 2));

  for (let k = 0; k < dayBlocks.length; k++) {
    let dayBlockText = dayBlocks[k].trim();
    if (!dayBlockText.startsWith("#### Dia")) {
      console.log(`Bloco ${k} não parece ser um dia válido, pulando: "${dayBlockText.substring(0, 50)}..."`);
      continue;
    }

    // Extrair o número do dia e a data do cabeçalho do bloco atual
    const dayHeaderMatch = dayBlockText.match(/^#### Dia\s*(\d+)\s*\(([^)]+)\)\s*:\s*\n?/);
    if (!dayHeaderMatch) {
      console.warn(`Cabeçalho do dia não encontrado ou malformado no bloco: "${dayBlockText.substring(0, 100)}..."`);
      continue;
    }

    // const dayNumberFromText = parseInt(dayHeaderMatch[1], 10); // Pode ser usado para validação
    // const dayDateFromText = dayHeaderMatch[2]; // Pode ser usado para validação

    const dayNumber = itineraryDays.length + 1; // Sequencial, mais robusto que parsear do texto se a IA falhar no número
    const actualDayDate = addDays(startDate, dayNumber - 1);
    const dayDateFormatted = format(actualDayDate, "dd 'de' MMMM", { locale: ptBR });

    console.log(`\n--- Processando Dia ${dayNumber} (${dayDateFormatted}) ---`);

    // Remove o cabeçalho do dia do bloco para processar apenas as atividades
    const activitiesContentForDay = dayBlockText.replace(/^#### Dia[^\n]*\n/, "").trim();
    // Remove também o "---" final do dia, se houver, para não interferir no parsing do último período.
    const cleanActivitiesContent = activitiesContentForDay.replace(/\n---\s*$/, "").trim();

    console.log("Conteúdo de Atividades Limpo para o Dia:\n", cleanActivitiesContent);

    const activities: IActivity[] = [];
    const activityPeriods = ["Manhã", "Tarde", "Noite"];

    activityPeriods.forEach((period, index) => {
      console.log(`  Buscando atividades para o período: ${period}`);

      // Regex para encontrar o início do período atual
      const currentPeriodStartRegex = new RegExp(`\\*\\*🕐\\s*${period}\\s*:\\*\\*`, "m");
      const matchCurrent = cleanActivitiesContent.match(currentPeriodStartRegex);

      if (!matchCurrent) {
        console.log(`    Marcador de início para ${period} não encontrado.`);
        return; // Pula para o próximo período se o marcador atual não for encontrado
      }

      const startIndex = matchCurrent.index + matchCurrent[0].length;
      let endIndex = cleanActivitiesContent.length; // Por padrão, vai até o fim

      // Tenta encontrar o início do PRÓXIMO período para delimitar o fim do atual
      if (index < activityPeriods.length - 1) {
        const nextPeriod = activityPeriods[index + 1];
        const nextPeriodStartRegex = new RegExp(`\\*\\*🕐\\s*${nextPeriod}\\s*:\\*\\*`, "m");
        const matchNext = cleanActivitiesContent.substring(startIndex).match(nextPeriodStartRegex);
        if (matchNext && typeof matchNext.index === "number") {
          endIndex = startIndex + matchNext.index;
        }
      }

      const activitiesInPeriodBlock = cleanActivitiesContent.substring(startIndex, endIndex).trim();

      if (activitiesInPeriodBlock && activitiesInPeriodBlock.trim() !== "") {
        console.log(`    Conteúdo encontrado para ${period}:\n`, activitiesInPeriodBlock);
        const individualActivityLines = activitiesInPeriodBlock
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        // ... (resto da sua lógica para processar individualActivityLines)
        // (copie a lógica de currentActivity, etc., para cá)

        let currentActivity: Partial<IActivity> = {};
        individualActivityLines.forEach((line) => {
          if (line.startsWith("🎌")) {
            if (currentActivity.title && currentActivity.title.trim() !== "[]" && currentActivity.title.trim() !== "") {
              if (!currentActivity.icon) {
                if (currentActivity.period?.toLowerCase().includes("tarde")) currentActivity.icon = "Sunset";
                else if (currentActivity.period?.toLowerCase().includes("noite")) currentActivity.icon = "Moon";
                else currentActivity.icon = "Sun";
              }
              if (currentActivity.description) currentActivity.description = currentActivity.description.trim();
              activities.push(currentActivity as IActivity);
            }
            currentActivity = {
              id: uuidv4(),
              period: period,
              title: line.replace(/^🎌\s*/, "").trim(),
              description: "",
              location: "",
              cost: "",
              weather: "",
              icon: "",
            };
            console.log(`      Nova atividade: Título='${currentActivity.title}'`);
          } else if (currentActivity.title) {
            if (line.startsWith("✏️")) {
              currentActivity.description = (currentActivity.description + " " + line.replace(/^✏️\s*/, "").trim()).trim();
            } else if (line.startsWith("📍")) {
              currentActivity.location = line.replace(/^📍\s*/, "").trim();
            } else if (line.startsWith("💰")) {
              currentActivity.cost = line.replace(/^💰\s*/, "").trim();
            } else if (line.startsWith("🌤️")) {
              currentActivity.weather = line.replace(/^🌤️\s*/, "").trim();
            } else if (currentActivity.description !== undefined && !/^(🎌|📍|💰|🌤️)/.test(line)) {
              currentActivity.description = (currentActivity.description + " " + line.trim()).trim();
            }
          }
        });
        if (currentActivity.title && currentActivity.title.trim() !== "[]" && currentActivity.title.trim() !== "") {
          if (!currentActivity.icon) {
            if (currentActivity.period?.toLowerCase().includes("tarde")) currentActivity.icon = "Sunset";
            else if (currentActivity.period?.toLowerCase().includes("noite")) currentActivity.icon = "Moon";
            else currentActivity.icon = "Sun";
          }
          if (currentActivity.description) currentActivity.description = currentActivity.description.trim();
          activities.push(currentActivity as IActivity);
          console.log(`      Última atividade do período '${period}' adicionada: '${currentActivity.title}'`);
        }
      } else {
        console.log(`    Nenhum conteúdo de atividade encontrado para ${period} (bloco vazio após extração).`);
      }
    });

    // Limpar valores "[]" remanescentes (embora o filtro de título já deva pegar a maioria)
    activities.forEach((act) => {
      for (const key in act) {
        if ((act as any)[key] === "[]") {
          (act as any)[key] = "";
        }
      }
    });

    console.log(`  Total de atividades parseadas para o Dia ${dayNumber}: ${activities.length}`);
    if (activities.length > 0) {
      itineraryDays.push({
        day: dayNumber,
        date: dayDateFormatted,
        activities,
      } as IDay);
    } else {
      console.log(`  Nenhuma atividade válida encontrada para o Dia ${dayNumber}, o dia não será adicionado.`);
    }
  }

  const startDateFormatted = format(startDate, "dd/MM/yyyy", { locale: ptBR });
  const endDateFormatted = format(endDate, "dd/MM/yyyy", { locale: ptBR });

  // ... (resto da função para montar finalItineraryObject)
  const finalItineraryObject = {
    id: uuidv4(),
    slug: generatedSlug,
    title: `Roteiro de Viagem para ${tripData.destination}`,
    destination: tripData.destination,
    startDate: tripData.startDate, // String ISO de tripData
    endDate: tripData.endDate, // String ISO de tripData
    dates: `${startDateFormatted} - ${endDateFormatted}`,
    duration: `${tripDuration} dia(s)`,
    budget: tripData.budget,
    interests: tripData.interests,
    totalCost: tripData.budget,
    days: itineraryDays,
    rawContent: rawText,
    userId: tripData.userId,
  };
  console.log("Objeto final do itinerário (DIAS):\n", JSON.stringify(finalItineraryObject.days, null, 2));
  console.log("==== FIM processAIGeneratedTextToSchema ====");
  return finalItineraryObject;
}

// Sua rota POST continua aqui...
export async function POST(req: NextRequest) {
  // ... (seu código da rota POST, sem alterações necessárias aqui se processAIGeneratedTextToSchema for corrigido)
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
    // O log completo do rawItineraryText já está na função processAIGeneratedTextToSchema

    const slug = generateSlug(`${tripData.destination}-${Date.now()}`);

    console.log("Processando texto da IA para o schema...");
    const processedItineraryData = processAIGeneratedTextToSchema(rawItineraryText, tripData, slug);

    console.log("Dados processados para salvar (apenas os dias, para brevidade):\n", JSON.stringify(processedItineraryData.days, null, 2));

    const newItinerary = new ItineraryModel(processedItineraryData);
    await newItinerary.save();
    console.log("Itinerário salvo com slug:", newItinerary.slug, "e ID (custom):", newItinerary.id, "e _ID (mongo):", newItinerary._id);

    return NextResponse.json({ success: true, slug: newItinerary.slug, itinerary: newItinerary.toObject() }, { status: 201 });
  } catch (error: any) {
    console.error("Erro CRÍTICO ao criar itinerário (API):", error.message, error.stack);
    let errorMessage = "Falha ao criar itinerário.";
    if (error.isAxiosError && error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      errorMessage = `Erro da API da IA: ${error.response.data.error.message}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage, details: error.stack }, { status: 500 });
  }
}
