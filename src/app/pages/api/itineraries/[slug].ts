import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb"; //
import ItineraryModel from "@/models/Itinerary"; //

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (req.method === "GET") {
    try {
      await dbConnect();

      const itinerary = await ItineraryModel.findOne({ slug: slug as string });

      if (!itinerary) {
        return res.status(404).json({ error: "Itinerário não encontrado." });
      }

      res.status(200).json({ itinerary });
    } catch (error: any) {
      console.error("Erro ao buscar itinerário:", error);
      res.status(500).json({ error: error.message || "Falha ao buscar itinerário." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
