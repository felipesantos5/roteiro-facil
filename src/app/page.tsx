import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=500&width=1200"
            alt="Travel destinations"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Plan Your Perfect Trip</h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Create personalized travel itineraries with ease. Discover new places, optimize your time, and make the most
            of your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/create">Create New Itinerary</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
            >
              <Link href="/saved">View Saved Itineraries</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-4 py-8 -mt-8 relative z-20">
        <div className="bg-background rounded-xl shadow-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search destinations (e.g., Paris, Tokyo, New York)" className="pl-10 py-6 text-lg" />
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {["Paris", "Tokyo", "New York", "Rome"].map((city) => (
            <Link href={`/create?destination=${city}`} key={city}>
              <Card className="overflow-hidden h-64 group">
                <div className="relative h-full">
                  <Image
                    src={`/placeholder.svg?height=300&width=400&text=${city}`}
                    alt={city}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <CardContent className="text-white p-4">
                      <h3 className="text-xl font-bold">{city}</h3>
                      <p className="flex items-center mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        Explore {city}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent and Upcoming Trips */}
      {/* <section className="container mx-auto px-4 py-12 bg-muted/50 rounded-lg my-12">
        <h2 className="text-3xl font-bold mb-6">Your Trips</h2>
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["Barcelona Weekend", "Japan Summer Trip"].map((trip) => (
                <Card key={trip} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                      <Image
                        src={`/placeholder.svg?height=200&width=200&text=${trip.split(" ")[0]}`}
                        alt={trip}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-6">
                      <h3 className="text-xl font-bold mb-2">{trip}</h3>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>May 15 - May 20, 2025</span>
                      </div>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>5 days</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/itinerary/${trip.toLowerCase().replace(" ", "-")}`}>View</Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/edit/${trip.toLowerCase().replace(" ", "-")}`}>Edit</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                    <Image
                      src="/placeholder.svg?height=200&width=200&text=London"
                      alt="London Trip"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <h3 className="text-xl font-bold mb-2">London Business Trip</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Jan 10 - Jan 15, 2025</span>
                    </div>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>5 days</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/itinerary/london-business-trip">View</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/create?duplicate=london-business-trip">Duplicate</Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="saved">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                    <Image
                      src="/placeholder.svg?height=200&width=200&text=Greece"
                      alt="Greece Trip"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <h3 className="text-xl font-bold mb-2">Greek Islands Tour</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span>Draft - Not scheduled</span>
                    </div>
                    <p className="text-muted-foreground mb-4">Island hopping in Santorini, Mykonos, and Crete</p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/itinerary/greek-islands-tour">View</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/edit/greek-islands-tour">Continue Planning</Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section> */}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Plan with Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Recommendations</h3>
            <p className="text-muted-foreground">
              Get personalized recommendations based on your interests, budget, and travel style.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Time Optimization</h3>
            <p className="text-muted-foreground">
              Optimize your routes and save time with our intelligent scheduling algorithm.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Flexible Planning</h3>
            <p className="text-muted-foreground">
              Easily adjust your plans, add or remove activities, and customize your itinerary.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

