"use client"; // Necessário para hooks como useState, useEffect, useRouter

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; // Hooks do App Router
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Share2, Download, Edit, DollarSign, Sun, Sunset, Moon, AlertTriangle, Compass, Hotel, Utensils, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns"; // parseISO já é suficiente se as datas são ISO
import { ptBR } from "date-fns/locale";
import GeneratingPage from "@/components/loadingItinerary";
import ShareModal from "@/components/ShareModal";
import { IItinerary, IDay, IActivity } from "@/models/Itinerary"; // Importando interfaces

// Mapa de ícones para renderização dinâmica
const iconMap: { [key: string]: React.ElementType } = {
  Sun: Sun,
  Sunset: Sunset,
  Moon: Moon,
  Compass: Compass,
  Hotel: Hotel,
  Utensils: Utensils,
  // Adicione outros ícones conforme necessário
  Default: MapPin, // Um ícone padrão
};

// Tipagem para o objeto de itinerário que esperamos da API
interface FetchedItinerary extends Omit<IItinerary, "days"> {
  days: Array<
    Omit<IDay, "activities"> & {
      activities: Array<Omit<IActivity, "icon"> & { icon: string }>; // icon como string da API
    }
  >;
}

// Tipagem para o itinerário processado no frontend
interface DisplayItinerary extends Omit<FetchedItinerary, "days"> {
  days: Array<
    Omit<IDay, "activities"> & {
      activities: IActivity[]; // icon como React.ElementType
    }
  >;
}

export default function ItineraryPage() {
  const params = useParams(); // Hook para obter parâmetros da rota
  const slug = typeof params.slug === "string" ? params.slug : undefined;
  const router = useRouter();

  const [itinerary, setItinerary] = useState<DisplayItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) {
      // Se não houver slug (ex: rota acessada incorretamente), pode redirecionar ou mostrar erro
      setError("Slug do itinerário não fornecido.");
      setLoading(false);
      return;
    }

    const fetchItineraryData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/itineraries/${slug}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Erro ao buscar dados do itinerário." }));
          throw new Error(errorData.error || `Erro ${response.status} ao buscar itinerário.`);
        }

        const data = await response.json();

        if (data.success && data.itinerary) {
          const fetchedItinerary: FetchedItinerary = data.itinerary;

          // Processar ícones de string para componentes React
          const processedDays = fetchedItinerary.days.map((day) => ({
            ...day,
            activities: day.activities.map((activity) => ({
              ...activity,
              icon: iconMap[activity.icon] || iconMap.Default, // Mapear string do ícone para componente
            })),
          }));
          setItinerary({ ...fetchedItinerary, days: processedDays });
        } else {
          throw new Error(data.error || "Formato de resposta inesperado da API.");
        }
      } catch (err: any) {
        console.error("Erro ao buscar dados do itinerário:", err);
        setError(err.message || "Falha ao carregar o itinerário. Tente novamente.");
        setItinerary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraryData();
  }, [slug]);

  const handleShareClick = () => setIsShareModalOpen(true);

  const baseURL = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const shareUrl = itinerary ? `${baseURL}/itinerary/${itinerary.slug}` : "";
  const shareTitle = itinerary ? `Confira meu itinerário de viagem para ${itinerary.destination}!` : "Confira este itinerário!";

  if (loading) {
    return <GeneratingPage />; // Ou um componente de loading mais simples
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Erro ao Carregar Itinerário</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <Button onClick={() => router.push("/create")}>Criar Novo Roteiro</Button>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Itinerário Não Encontrado</h2>
        <p className="text-muted-foreground mb-6">Não foi possível encontrar o itinerário solicitado.</p>
        <Button onClick={() => router.push("/create")}>Criar Novo Roteiro</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6 mb-8">
        <div className="flex-grow">
          <h1 className="text-2xl sm:text-3xl font-bold break-words">{itinerary.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-muted-foreground text-sm sm:text-base">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 shrink-0" />
              <span>{itinerary.destination}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 shrink-0" />
              <span>{itinerary.dates}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 shrink-0" />
              <span>{itinerary.duration}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 shrink-0" />
              <span>Orçamento: {itinerary.budget}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 shrink-0">
          <Button variant="outline" size="sm" onClick={handleShareClick}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert("Funcionalidade de exportar PDF pendente.")}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          {/* Ajustar o link de edição se necessário */}
          <Button size="sm" asChild>
            <Link href={`/create?edit=${itinerary.slug}`}>
              {" "}
              {/* Exemplo: levar slug para edição */}
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      {isShareModalOpen && <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} url={shareUrl} title={shareTitle} />}

      {itinerary.days && itinerary.days.length > 0 ? (
        <div className="space-y-8">
          {itinerary.days.map((day) => (
            <div key={day.day} id={`day-${day.day}`}>
              <div className="flex items-center mb-4 sticky top-0 bg-background py-2 z-10 border-b">
                {" "}
                {/* Tornando o header do dia sticky */}
                <div className="bg-primary text-primary-foreground w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mr-3 shrink-0">{day.day}</div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Dia {day.day}</h2>
                  <p className="text-muted-foreground text-sm sm:text-base">{day.date}</p>
                </div>
              </div>

              {day.activities && day.activities.length > 0 ? (
                <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {day.activities.map((activity) => {
                    const IconComponent = activity.icon || iconMap.Default;
                    return (
                      <Card key={activity.id} className="flex flex-col">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base sm:text-lg">{activity.title || "Atividade sem título"}</CardTitle>
                            <IconComponent className="h-5 w-5 text-primary shrink-0 mt-1" />
                          </div>
                          <CardDescription className="text-xs sm:text-sm">{activity.period}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow text-sm sm:text-base space-y-1.5">
                          {activity.description && <p className="mb-2">{activity.description}</p>}
                          {activity.location && (
                            <div className="flex items-start text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                              <span>{activity.location}</span>
                            </div>
                          )}
                          {activity.cost && (
                            <div className="flex items-center text-muted-foreground">
                              <DollarSign className="h-4 w-4 mr-2 shrink-0" />
                              <span>{activity.cost}</span>
                            </div>
                          )}
                          {activity.weather && (
                            <div className="flex items-center text-muted-foreground">
                              <Sun className="h-4 w-4 mr-2 shrink-0" /> {/* Ícone genérico de clima */}
                              <span>{activity.weather}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground italic ml-12">Nenhuma atividade planejada para este período do dia.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Compass className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Roteiro em Branco</h2>
          <p className="text-muted-foreground">Este itinerário ainda não possui atividades planejadas.</p>
          <Button onClick={() => router.push(`/create?edit=${itinerary.slug}`)} className="mt-6">
            <Edit className="mr-2 h-4 w-4" /> Adicionar Atividades
          </Button>
        </div>
      )}
    </div>
  );
}
