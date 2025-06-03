import mongoose, { Document, Schema, Model } from "mongoose";

// Interface para Atividade (opcional, mas bom para tipagem)
export interface IActivity extends Document {
  id: string;
  period: string;
  title: string;
  description: string;
  location: string;
  cost: string;
  weather: string;
  icon: string; // Nome do ícone (ex: "Sun", "Moon")
}

// Interface para Dia (opcional)
export interface IDay extends Document {
  day: number;
  date: string;
  activities: IActivity[];
}

// Interface para Itinerário
export interface IItinerary extends Document {
  userId?: string; // Opcional, dependendo da sua lógica de autenticação
  slug: string;
  title: string;
  destination: string;
  startDate: string; // Recomendo armazenar como ISO string ou Date
  endDate: string; // Recomendo armazenar como ISO string ou Date
  dates: string; // String formatada (ex: "01/01/2024 - 05/01/2024")
  duration: string; // String (ex: "5 dias")
  budget: string;
  interests: string[];
  totalCost?: string; // Pode ser o mesmo que budget ou calculado
  days: IDay[];
  rawContent?: string;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  id: { type: String, required: true },
  period: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  cost: { type: String },
  weather: { type: String },
  icon: { type: String, required: true },
});

const DaySchema = new Schema<IDay>({
  day: { type: Number, required: true },
  date: { type: String, required: true }, // Ex: "01 de Janeiro"
  activities: [ActivitySchema],
});

const ItinerarySchema = new Schema<IItinerary>({
  userId: {
    type: String,
    index: true,
    // required: false, // Defina como true se for obrigatório
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: String, required: true }, // Ou Date
  endDate: { type: String, required: true }, // Ou Date
  dates: { type: String, required: true },
  duration: { type: String, required: true },
  budget: { type: String, required: true },
  interests: [{ type: String }],
  totalCost: { type: String },
  days: [DaySchema],
  rawContent: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Evita erro de sobreposição de modelo com HMR (Hot Module Replacement)
const ItineraryModel: Model<IItinerary> = mongoose.models.Itinerary || mongoose.model<IItinerary>("Itinerary", ItinerarySchema);

export default ItineraryModel;
