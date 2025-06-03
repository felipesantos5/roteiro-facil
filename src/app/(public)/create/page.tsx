"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, DollarSign, ChevronRight, Loader2 } from "lucide-react"; // Adicionado Loader2
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MultiSelect } from "@/components/multiSelect";
import { useRouter } from "next/navigation";
import Autosuggest from "react-autosuggest";
import debounce from "lodash/debounce";
// import { v4 } from "uuid"; // Não é mais necessário para ID de path aqui

interface Suggestion {
  name: string;
  id: string;
}

interface Interest {
  label: string;
  value: string;
}

const getSuggestions = async (value: string): Promise<Suggestion[]> => {
  if (!value || value.length < 2) return [];
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
    if (!apiKey) {
      console.error("A chave da API do OpenCage não está definida. Verifique suas variáveis de ambiente.");
      return [];
    }
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(value)}&key=${apiKey}&limit=5&no_annotations=1&language=pt`);
    if (!response.ok) {
      throw new Error(`Resposta da rede não foi ok, status: ${response.status}`);
    }
    const data = await response.json();
    return data.results.map((result: any) => ({
      name: result.formatted,
      id: result.annotations?.geohash || result.formatted,
    }));
  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
    return [];
  }
};

export default function CreateItineraryPage() {
  const [destination, setDestination] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [date, setDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<number[]>([50]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

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
    { label: "Arquitetura e design urbano", value: "arquitetura" },
  ];

  const getBudgetLabel = (value: number): string => {
    if (value < 33) return "Econômico";
    if (value < 66) return "Moderado";
    return "Luxuoso";
  };

  const handleSubmit = async (): Promise<void> => {
    if (!destination) {
      alert("Por favor, informe o destino.");
      return;
    }
    if (!date) {
      alert("Por favor, selecione a data de início.");
      return;
    }
    if (!endDate) {
      alert("Por favor, selecione a data de término.");
      return;
    }
    if (selectedInterests.length === 0) {
      alert("Por favor, selecione ao menos um interesse.");
      return;
    }
    if (endDate < date) {
      alert("A data de término não pode ser anterior à data de início.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const tripData = {
      destination,
      startDate: date.toISOString(),
      endDate: endDate.toISOString(),
      interests: selectedInterests,
      budget: getBudgetLabel(budget[0]),
    };

    try {
      const response = await fetch("/api/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        let errorBody = "Erro desconhecido ao criar itinerário.";
        try {
          const errJson = await response.json();
          errorBody = errJson.error || JSON.stringify(errJson);
        } catch (e) {
          errorBody = await response.text(); // Fallback se não for JSON
        }
        console.error("API Error Response Text:", errorBody);
        throw new Error(`Erro da API (${response.status}): ${errorBody.substring(0, 300)}`);
      }

      const result = await response.json();
      if (result.error) {
        // Checagem adicional caso o status seja OK mas haja erro no corpo
        throw new Error(result.error);
      }

      if (result.slug) {
        router.push(`/itinerary/${result.slug}`);
      } else {
        throw new Error("Slug não retornado pela API.");
      }
    } catch (error: any) {
      console.error("Erro ao criar itinerário (cliente):", error);
      setSubmitError(error.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const debouncedGetSuggestions = useCallback(
    debounce(async (value: string) => {
      const fetchedSuggestions = await getSuggestions(value);
      setSuggestions(fetchedSuggestions);
    }, 300),
    []
  );

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => debouncedGetSuggestions(value);
  const onSuggestionsClearRequested = () => setSuggestions([]);
  const onSuggestionSelected = (event: React.FormEvent<any>, { suggestion }: { suggestion: Suggestion }) => {
    setDestination(suggestion.name);
  };

  const inputProps = {
    placeholder: "Digite a cidade ou país",
    value: destination,
    onChange: (event: React.FormEvent<any>, { newValue }: { newValue: string }) => setDestination(newValue),
    className: "w-full pl-10 input pr-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring", // Melhorando estilo
    id: "destination",
  };

  // Estilos para o react-autosuggest (exemplo básico)
  const theme = {
    container: "relative",
    input: inputProps.className, // Reutiliza a classe do inputProps
    suggestionsContainer: "absolute z-10 w-full border border-gray-300 bg-white rounded-md shadow-lg mt-1",
    suggestionsList: `list-none p-0 m-0 max-h-60 overflow-y-auto`,
    suggestion: "p-2 hover:bg-gray-100 cursor-pointer",
    suggestionHighlighted: "bg-gray-200",
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Crie seu Itinerário</h1>
        <p className="text-muted-foreground mb-8">Conte-nos sobre sua viagem e criaremos um itinerário personalizado para você.</p>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Viagem</CardTitle>
            <CardDescription>Insira as informações básicas sobre sua próxima viagem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="destination">Destino</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  onSuggestionSelected={onSuggestionSelected}
                  getSuggestionValue={(suggestion: Suggestion) => suggestion.name}
                  renderSuggestion={(suggestion: Suggestion) => <div>{suggestion.name}</div>}
                  inputProps={inputProps}
                  theme={theme} // Aplicando o tema
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Datas da Viagem</Label>
              <div className="grid sm:grid-cols-2 gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ptBR }) : <span>Data de início</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: ptBR }) : <span>Data de término</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus disabled={(d) => (date ? d < date : d < new Date(new Date().setHours(0, 0, 0, 0)))} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Interesses</Label>
              <MultiSelect options={interests} selected={selectedInterests} onChange={setSelectedInterests} placeholder="Selecione seus interesses" />
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedInterests.map((interestValue) => {
                  const interestObj = interests.find((i) => i.value === interestValue);
                  return (
                    <Badge key={interestValue} variant="secondary" className="font-normal">
                      {interestObj?.label || interestValue}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="budget-slider">Orçamento</Label>
                <span className="text-muted-foreground">{getBudgetLabel(budget[0])}</span>
              </div>
              <div className="flex items-center gap-4">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Slider id="budget-slider" value={budget} onValueChange={setBudget} max={100} step={1} className="flex-1" />
                <DollarSign className="h-4 w-4 text-muted-foreground opacity-50" />
                <DollarSign className="h-4 w-4 text-muted-foreground opacity-25" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Cancelar</Link>
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  Gerar Itinerário <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
          {submitError && <p className="text-red-500 mt-4 text-center px-6 pb-4">{submitError}</p>}
        </Card>
      </div>
    </div>
  );
}
