"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Globe,
  Calendar,
  Share2,
  Star,
  Menu,
  X,
  ChevronRight,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-500 to-blue-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Planeje sua Próxima Aventura no Brasil com a Inteligência Artificial
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Descubra roteiros personalizados, economize tempo e aproveite ao máximo suas viagens.
            </p>
            <div className="pt-4">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg px-8 py-6 rounded-lg shadow-lg transform transition hover:scale-105">
                Comece Agora Gratuitamente
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Mapa interativo do Brasil"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white/30"
              >
                <Play className="mr-2 h-5 w-5" /> Ver demonstração
              </Button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Planeje sua viagem em apenas três passos simples e desfrute de uma experiência personalizada.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <MapPin className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Informe seus Destinos e Interesses</h3>
              <p className="text-gray-600">
                Conte-nos para onde você quer ir e o que gosta de fazer. Quanto mais detalhes, melhor será seu roteiro.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Globe className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Deixe a IA Criar um Roteiro Personalizado</h3>
              <p className="text-gray-600">
                Nossa inteligência artificial analisa milhares de opções para criar o roteiro perfeito para você.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-6">
                <Share2 className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalize e Compartilhe seu Roteiro</h3>
              <p className="text-gray-600">
                Ajuste seu roteiro conforme necessário e compartilhe com amigos e familiares com apenas um clique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Funcionalidades Principais</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra como o Roteiro Fácil pode transformar sua experiência de planejamento de viagens.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Personalização com IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Roteiros criados sob medida para você, considerando seus interesses, tempo disponível e orçamento.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Planejamento Rápido e Fácil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Crie roteiros completos em minutos, sem precisar pesquisar por horas em diferentes sites.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Recomendação de Atrações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Descubra os melhores lugares para visitar com base nas avaliações de outros viajantes.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Integração com Mapas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Visualize seu roteiro no mapa e obtenha direções detalhadas para cada atração.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                  <Share2 className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Compartilhamento Fácil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Compartilhe seus roteiros com amigos e familiares por e-mail, WhatsApp ou redes sociais.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Calendário Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Organize suas atividades de forma otimizada, considerando horários de funcionamento e tempo de
                  deslocamento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">O Que Nossos Usuários Dizem</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Milhares de viajantes já transformaram suas experiências com o Roteiro Fácil.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-gray-50 border-none">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt="Maria Silva"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Maria Silva</CardTitle>
                    <CardDescription>São Paulo, SP</CardDescription>
                  </div>
                </div>
                <div className="flex text-yellow-500 mb-2">
                  <Star className="fill-current h-5 w-5" />
                  <Star className="fill-current h-5 w-5" />
                  <Star className="fill-current h-5 w-5" />
                  <Star className="fill-current h-5 w-5" />
                  <Star className="fill-current h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  "O Roteiro Fácil me ajudou a planejar uma viagem incrível para o Rio de Janeiro. Economizei muito
                  tempo e descobri lugares que eu nunca teria encontrado sozinha."
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-gray-50 border-none">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt="Carlos Oliveira"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Carlos Oliveira</CardTitle>
                    <CardDescription>Belo Horizonte, MG</CardDescription>
                  </div>
                </div>
                <div className="flex text-yellow-500 mb-2">
                  <Star className="fill-current h-5 w-5" />
                  <Star className="fill-current h-5 w-5" />
                  <Star className="fill-current h-5 w-5" />
                  <Star className="fill-current h-5 w-5" />
                  <Star className="fill-current h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  "Incrível como a IA conseguiu criar um roteiro perfeito para minha família. Visitamos a Amazônia e
                  tudo foi planejado com precisão, respeitando nosso ritmo e interesses."
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-gray-50 border-none">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt="Ana Ferreira"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Ana Ferreira</CardTitle>
                    <CardDescription>Recife, PE</CardDescription>
                  </div>
                </div>
                <div className="flex text-yellow-500 mb-2">
                  <Star className="fill-current h-5 w-5" />
                  <Star className="fill-current h-5 w-5" />
                  <Star className="fill-current h-5 w-5" />
                  <Star className="fill-current h-5 w-5" />
                  <Star className="fill-current h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  "Como guia turístico, uso o Roteiro Fácil para criar experiências personalizadas para meus clientes. A
                  ferramenta é intuitiva e as recomendações são sempre excelentes."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Planos e Preços</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha o plano ideal para suas necessidades de viagem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Básico</CardTitle>
                <CardDescription>Ideal para quem está começando</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Grátis</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Até 2 roteiros por mês</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Recomendações básicas</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Compartilhamento limitado</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Suporte por e-mail</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Começar Grátis</Button>
              </CardFooter>
            </Card>

            {/* Adventurer Plan */}
            <Card className="border-2 border-green-600 relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <Badge className="bg-green-600">Mais Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Aventureiro</CardTitle>
                <CardDescription>Para viajantes frequentes</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$29,90</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Roteiros ilimitados</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Recomendações personalizadas</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Compartilhamento ilimitado</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Suporte prioritário</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Acesso a roteiros exclusivos</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700">Assinar Agora</Button>
              </CardFooter>
            </Card>

            {/* Globetrotter Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Globetrotter</CardTitle>
                <CardDescription>Para quem quer o melhor</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$49,90</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Tudo do plano Aventureiro</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Acesso a guias locais</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Descontos exclusivos</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Suporte 24/7</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Acesso antecipado a novos recursos</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Assinar Agora</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Feature Comparison */}
          <div className="mt-16 max-w-5xl mx-auto">
            <Tabs defaultValue="features">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="features">Comparação de Recursos</TabsTrigger>
                <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
              </TabsList>
              <TabsContent value="features" className="mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left">Recurso</th>
                        <th className="p-3 text-center">Básico</th>
                        <th className="p-3 text-center">Aventureiro</th>
                        <th className="p-3 text-center">Globetrotter</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="p-3">Número de roteiros</td>
                        <td className="p-3 text-center">2 por mês</td>
                        <td className="p-3 text-center">Ilimitado</td>
                        <td className="p-3 text-center">Ilimitado</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-3">Recomendações personalizadas</td>
                        <td className="p-3 text-center">Básicas</td>
                        <td className="p-3 text-center">Avançadas</td>
                        <td className="p-3 text-center">Premium</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-3">Compartilhamento</td>
                        <td className="p-3 text-center">Limitado</td>
                        <td className="p-3 text-center">Ilimitado</td>
                        <td className="p-3 text-center">Ilimitado</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-3">Suporte</td>
                        <td className="p-3 text-center">E-mail</td>
                        <td className="p-3 text-center">Prioritário</td>
                        <td className="p-3 text-center">24/7</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-3">Acesso a guias locais</td>
                        <td className="p-3 text-center">-</td>
                        <td className="p-3 text-center">-</td>
                        <td className="p-3 text-center">✓</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-3">Descontos exclusivos</td>
                        <td className="p-3 text-center">-</td>
                        <td className="p-3 text-center">-</td>
                        <td className="p-3 text-center">✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="faq" className="mt-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold">Posso cancelar minha assinatura a qualquer momento?</h3>
                  <p className="text-gray-600">
                    Sim, você pode cancelar sua assinatura a qualquer momento. Não há contratos de longo prazo.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Como funciona o período de teste?</h3>
                  <p className="text-gray-600">
                    Oferecemos um período de teste de 7 dias para os planos Aventureiro e Globetrotter. Você pode
                    cancelar a qualquer momento durante esse período sem ser cobrado.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Posso mudar de plano depois?</h3>
                  <p className="text-gray-600">
                    Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em
                    vigor imediatamente.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        className="py-16 md:py-24 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/placeholder.svg?height=600&width=1200')" }}
      >
        <div className="absolute inset-0 bg-blue-900/80"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Comece a Planejar sua Próxima Aventura Agora!</h2>
            <p className="text-xl mb-8 text-white/90">
              Junte-se a milhares de viajantes que já descobriram o Brasil de uma forma mais fácil e personalizada.
            </p>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg px-8 py-6 rounded-lg shadow-lg transform transition hover:scale-105">
              Experimente Grátis
            </Button>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center"
          onClick={() => alert("Chatbot aberto!")}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </>
  )
}

function Play({ className, ...props }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

