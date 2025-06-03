import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ItineraryModel from "@/models/Itinerary";

interface Params {
  slug: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: "Slug é obrigatório." }, { status: 400 });
  }

  try {
    await dbConnect();

    const itinerary = await ItineraryModel.findOne({ slug: slug as string }).lean(); // .lean() para retornar um objeto JS puro

    if (!itinerary) {
      return NextResponse.json({ error: "Itinerário não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, itinerary });
  } catch (error: any) {
    console.error("Erro ao buscar itinerário por slug:", error);
    return NextResponse.json({ error: error.message || "Falha ao buscar itinerário." }, { status: 500 });
  }
}
