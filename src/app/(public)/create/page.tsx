"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPin, DollarSign, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from 'date-fns/locale'
import { MultiSelect } from "@/components/multiSelect"
import { useRouter } from 'next/navigation'
import Autosuggest from 'react-autosuggest'
import debounce from 'lodash/debounce'
import { v4 } from "uuid"

interface Suggestion {
  name: string;
  id: string;
}

interface Interest {
  label: string;
  value: string;
}

const getSuggestions = async (value: string): Promise<Suggestion[]> => {
  if (!value || value.length < 2) return []

  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY
    if (!apiKey) {
      console.error("A chave da API do OpenCage não está definida. Verifique suas variáveis de ambiente.")
      return []
    }

    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(value)}&key=${apiKey}&limit=5&no_annotations=1&language=pt`)

    if (!response.ok) {
      throw new Error(`Resposta da rede não foi ok, status: ${response.status}`)
    }

    const data = await response.json()
    return data.results.map((result: any) => ({
      name: result.formatted,
      id: result.annotations?.geohash || result.formatted
    }))
  } catch (error) {
    console.error('Erro ao buscar sugestões:', error)
    return []
  }
}

export default function CreateItineraryPage() {
  const [destination, setDestination] = useState<string>("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [date, setDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [budget, setBudget] = useState<number[]>([50])
  const router = useRouter()

  const interests: Interest[] = [
    { label: "Aventura ao ar livre", value: "aventura_ar_livre" },
    { label: "Gastronomia local", value: "gastronomia_local" },
    { label: "Pontos turísticos históricos", value: "pontos_historicos" },
    { label: "Museus e galerias de arte", value: "museus_arte" },
    { label: "Vida noturna e entretenimento", value: "vida_noturna" },
    { label: "Relaxamento e bem-estar", value: "relaxamento" },
    { label: "Esportes e atividades físicas", value: "esportes" },
    { label: "Compras e moda", value: "compras" },
    { label: "Natureza e ecoturismo", value: "natureza" },
    { label: "Experiências culturais locais", value: "cultura_local" },
    { label: "Fotografia e paisagens", value: "fotografia" },
    { label: "Festivais e eventos", value: "festivais" },
    { label: "Culinária e aulas de culinária", value: "aulas_culinaria" },
    { label: "Arquitetura e design urbano", value: "arquitetura" }
  ]

  const getBudgetLabel = (value: number): string => {
    if (value < 33) return "Econômico"
    if (value < 66) return "Moderado"
    return "Luxuoso"
  }

  const handleSubmit = (): void => {
    if (!destination || !date || !endDate || selectedInterests.length === 0) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    // Validação adicional para garantir que a data de término não seja anterior à data de início
    if (endDate < date) {
      alert("A data de término não pode ser anterior à data de início.")
      return;
    }

    const tripData = {
      destination,
      startDate: date,
      endDate,
      interests: selectedInterests,
      budget: getBudgetLabel(budget[0])
    }

    try {
      localStorage.setItem('tripData', JSON.stringify(tripData))
      router.push(`/itinerary/${v4()}`)
    } catch (error) {
      console.error("Erro ao salvar dados no localStorage:", error)
      alert("Ocorreu um erro ao salvar os dados. Por favor, tente novamente.")
    }
  }

  const debouncedGetSuggestions = useCallback(
    debounce(async (value: string) => {
      const fetchedSuggestions = await getSuggestions(value)
      setSuggestions(fetchedSuggestions)
    }, 300),
    []
  )

  const onSuggestionsFetchRequested = ({ value }: { value: string }): void => {
    debouncedGetSuggestions(value)
  }

  const onSuggestionsClearRequested = (): void => {
    setSuggestions([])
  }

  const onSuggestionSelected = (event: React.FormEvent<any>, { suggestion }: { suggestion: Suggestion }): void => {
    setDestination(suggestion.name)
  }

  const inputProps = {
    placeholder: 'Digite a cidade ou país',
    value: destination,
    onChange: (event: React.FormEvent<any>, { newValue }: { newValue: string }) => setDestination(newValue),
    className: "w-full pl-10 input",
    id: "destination"
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Crie seu Itinerário</h1>
        <p className="text-muted-foreground mb-8">
          Conte-nos sobre sua viagem e criaremos um itinerário personalizado para você.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Viagem</CardTitle>
            <CardDescription>Insira as informações básicas sobre sua próxima viagem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="destination">Destino</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  onSuggestionSelected={onSuggestionSelected}
                  getSuggestionValue={(suggestion: Suggestion) => suggestion.name}
                  renderSuggestion={(suggestion: Suggestion) => <div>{suggestion.name}</div>}
                  inputProps={inputProps}
                />
              </div>
            </div>

            {/* Intervalo de Datas */}
            <div className="space-y-2">
              <Label>Datas da Viagem</Label>
              <div className="flex flex-col gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PP", { locale: ptBR }) : <span>Data de início</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PP", { locale: ptBR }) : <span>Data de término</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => date < (new Date() || (date && date < new Date(new Date().setDate(new Date().getDate() - 1))))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Interesses */}
            <div className="space-y-2">
              <Label>Interesses</Label>
              <MultiSelect
                options={interests}
                selected={selectedInterests}
                onChange={setSelectedInterests}
                placeholder="Selecione seus interesses"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedInterests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interests.find((i) => i.value === interest)?.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Orçamento */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Orçamento</Label>
                <span className="text-muted-foreground">{getBudgetLabel(budget[0])}</span>
              </div>
              <div className="flex items-center gap-4">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Slider value={budget} onValueChange={setBudget} max={100} step={1} className="flex-1" />
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Cancelar</Link>
            </Button>
            <Button onClick={handleSubmit}>
              Gerar Itinerário <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}