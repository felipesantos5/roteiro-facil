import mongoose, { Document, Schema, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import uuid

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
  id: string; // <-- ADD THIS LINE
  userId?: string;
  slug: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  dates: string;
  duration: string;
  budget: string;
  interests: string[];
  totalCost?: string;
  days: IDay[];
  rawContent?: string;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  id: { type: String, required: true, default: () => uuidv4() }, // Added default for robustness
  period: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  cost: { type: String },
  weather: { type: String },
  icon: { type: String, required: false }, // Made icon optional if Default is handled in frontend
});

const DaySchema = new Schema<IDay>({
  day: { type: Number, required: true },
  date: { type: String, required: true },
  activities: [ActivitySchema],
});

const ItinerarySchema = new Schema<IItinerary>({
  id: {
    // <-- ADD THIS ENTIRE BLOCK
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(), // Ensures ID is always generated if not provided
    index: true,
  },
  userId: {
    type: String,
    index: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  dates: { type: String, required: true },
  duration: { type: String, required: true },
  budget: { type: String },
  interests: [{ type: String }],
  totalCost: { type: String },
  days: [DaySchema],
  rawContent: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ItineraryModel: Model<IItinerary> = mongoose.models.Itinerary || mongoose.model<IItinerary>("Itinerary", ItinerarySchema);

export default ItineraryModel;
