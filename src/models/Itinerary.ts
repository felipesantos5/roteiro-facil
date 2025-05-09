import mongoose from "mongoose";

// Esquema para atividades
const ActivitySchema = new mongoose.Schema({
  id: String,
  period: String,
  title: String,
  description: String,
  location: String,
  cost: String,
  weather: String,
  icon: String, // Armazenaremos o nome do ícone como string
});

// Esquema para dias
const DaySchema = new mongoose.Schema({
  day: Number,
  date: String,
  activities: [ActivitySchema],
});

// Esquema principal do itinerário
const ItinerarySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  id: String,
  title: String,
  destination: String,
  startDate: String,
  endDate: String,
  dates: String,
  duration: String,
  budget: String,
  interests: [String],
  totalCost: String,
  days: [DaySchema],
  rawContent: String, // Conteúdo bruto gerado pela IA
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Itinerary || mongoose.model("Itinerary", ItinerarySchema);
