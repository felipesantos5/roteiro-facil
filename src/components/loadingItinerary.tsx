"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MapPin, Calendar, Compass, Route, Hotel, Utensils } from "lucide-react"

export default function GeneratingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      name: "Finding attractions",
      icon: Compass,
      description: "Discovering the best attractions based on your interests",
    },
    { name: "Planning accommodations", icon: Hotel, description: "Finding suitable places to stay within your budget" },
    {
      name: "Suggesting restaurants",
      icon: Utensils,
      description: "Selecting restaurants that match your preferences",
    },
    { name: "Optimizing routes", icon: Route, description: "Creating the most efficient routes between locations" },
    { name: "Finalizing itinerary", icon: Calendar, description: "Putting everything together in a day-by-day plan" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Redirect to itinerary page after completion
          return 100
        }

        // Update current step based on progress
        const newStep = Math.floor((prev / 100) * steps.length)
        if (newStep !== currentStep) {
          setCurrentStep(newStep)
        }

        return prev + 1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentStep, router, steps.length])

  const CurrentStepIcon = steps[currentStep]?.icon || Compass

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Creating Your Itinerary</CardTitle>
          <CardDescription>We're building your personalized travel plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              </div>
              <div className="bg-background rounded-full p-8">
                <CurrentStepIcon className="h-16 w-16 text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{steps[currentStep]?.name}</span>
              <span>{Math.min(progress, 100)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-center">{steps[currentStep]?.description}</p>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Paris, France</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>May 15 - May 20, 2025</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

