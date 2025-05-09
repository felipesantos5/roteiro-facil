"use client"

import React, { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Download,
  Edit,
  DollarSign,
  Sun,
  Sunset,
  Moon,
  AlertTriangle,
} from "lucide-react"
import { generateItinerary } from "@/app/pages/api/generateItinerary"
import { format, parseISO, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import GeneratingPage from "@/components/loadingItinerary"
import ShareModal from "@/components/ShareModal"

interface Activity {
  id: string;
  period: string;
  title: string;
  description: string;
  location: string;
  cost: string;
  weather: string;
  icon: React.ElementType;
}

interface Day {
  day: number;
  date: string;
  activities: Activity[];
}

interface Itinerary {
  id: string;
  title: string;
  dates: string;
  duration: string;
  destination: string;
  totalCost: string;
  days: Day[];
}

function ItineraryContent({ id }: { id: string }) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const baseURL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const shareUrl = `${baseURL}/itinerary/${id}`; // Ajuste conforme necessário
  const shareTitle = `Confira meu itinerário de viagem para ${itinerary?.destination}!`;

  useEffect(() => {
    const fetchItinerary = async () => {
      setLoading(true)
      setError(null)
      try {
        const tripData = JSON.parse(localStorage.getItem('tripData') || '{}')
        if (!tripData || Object.keys(tripData).length === 0) {
          throw new Error('No trip data found in localStorage. Please, generate a trip first.')
        }
        const generatedItinerary = await generateItinerary(tripData)
        const processedItinerary = processGeneratedText(generatedItinerary, tripData, id)
        setItinerary(processedItinerary)
      } catch (err: any) {
        console.error('Error fetching itinerary:', err)
        setError(err.message || 'Failed to generate itinerary. Please try again.')
        setItinerary(null)
      } finally {
        setLoading(false)
      }
    }

    fetchItinerary()
  }, [id])

  const processGeneratedText = (text: string, tripData: any, id: string): Itinerary => {
    // Divide o texto em seções por dia
    const days: Day[] = text.split(/#### Dia/).slice(1).map((dayText, index) => {
      const [dayHeader, ...activitySections] = dayText.split('**🕐');
      const dayMatch = dayHeader.match(/(\d+)\s?$$(.*?)$$:/);

      // Extrai número e data do dia
      const dayNumber = dayMatch ? parseInt(dayMatch[1]) : index + 1;
      const dayDate = dayMatch ? dayMatch[2].trim() : format(addDays(parseISO(tripData.startDate), index), 'd \'de\' MMMM', { locale: ptBR });

      // Processa as atividades de cada dia
      const activities = activitySections
        .map(section => {
          const lines = section.split('\n').filter(line => line.trim()); // Remove linhas vazias

          // Extrai dados sobre a atividade
          const period = lines.shift()?.replace(':', '').trim() || 'Período não especificado';
          const title = lines.find(line => line.startsWith('🎌'))?.replace('🎌', '').trim() || 'Atividade não especificada';
          const description = lines.find(line => line.startsWith('✏️'))?.replace('✏️', '').trim() || 'Descrição não disponível.';
          const location = lines.find(line => line.startsWith('📍'))?.replace('📍', '').trim() || 'Localização não informada';
          const cost = lines.find(line => line.startsWith('💰'))?.replace('💰', '').trim() || 'Custo não especificado';
          const weather = lines.find(line => line.startsWith('🌤️'))?.replace('🌤️', '').trim() || 'Clima não disponível';

          // Determina o ícone com base no período
          let icon: React.ElementType = Sun;
          if (period.toLowerCase().includes('tarde')) {
            icon = Sunset;
          } else if (period.toLowerCase().includes('noite')) {
            icon = Moon;
          }

          return {
            id: `a${Math.random().toString(36).substr(2, 9)}`, // Gera um ID único
            period,
            title,
            description,
            location,
            cost,
            weather,
            icon,
          };
        })
        .filter(activity => activity.title !== 'Atividade não especificada'); // Remove atividades inválidas

      return { day: dayNumber, date: dayDate, activities };
    });

    // Formata as datas da viagem
    const startDateFormatted = format(parseISO(tripData.startDate), 'dd/MM/yyyy', { locale: ptBR });
    const endDateFormatted = format(parseISO(tripData.endDate), 'dd/MM/yyyy', { locale: ptBR });

    return {
      id,
      title: `Roteiro de Viagem para ${tripData.destination}`,
      dates: `${startDateFormatted} - ${endDateFormatted}`,
      duration: `${days.length} dias`,
      destination: tripData.destination,
      totalCost: tripData.budget,
      days,
    };
  };

  if (loading) {
    return <GeneratingPage />
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <AlertTriangle className="inline-block h-6 w-6 mr-2 align-middle" />
        {error}
      </div>
    )
  }

  if (!itinerary) {
    return <div className="text-center py-4">Falha ao gerar o itinerário. Por favor, tente novamente.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{itinerary.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{itinerary.destination}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{itinerary.dates}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{itinerary.duration}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>Orçamento: {itinerary.totalCost}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleShareClick}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" asChild>
            <Link href={`/edit/${itinerary.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
        </div>

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          url={shareUrl}
          title={shareTitle}
        />
      </div>



      <div className="space-y-8">
        {itinerary.days.map((day) => (
          <div key={day.day} id={`day-${day.day}`}>
            <div className="flex items-center mb-4">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mr-3">
                {day.day}
              </div>
              <div>
                <h2 className="text-xl font-bold">Dia {day.day}</h2>
                <p className="text-muted-foreground">{day.date}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {day.activities.filter(activity => activity.title !== 'Atividade não especificada').map((activity) => (
                <Card key={activity.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{activity.title}</CardTitle>
                      <activity.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardDescription>{activity.period}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{activity.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{activity.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>{activity.cost}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Sun className="h-4 w-4 mr-1" />
                      <span>{activity.weather}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ItineraryWrapper params={params} />
    </Suspense>
  )
}

function ItineraryWrapper({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  return <ItineraryContent id={resolvedParams.id} />;
}