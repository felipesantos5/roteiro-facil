"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <div className="bg-yellow-500 text-white py-2 px-4 text-center sticky top-0 z-50">
        <p className="text-sm md:text-base font-medium">
          Desconto de 20% nos Planos Aventureiro e Globetrotter por Tempo Limitado!
          <Button variant="link" className="text-white font-bold ml-2 underline">
            Aproveite Agora
          </Button>
        </p>
      </div>

      {/* Header */}
      <header className="bg-white py-4 px-6 shadow-sm sticky top-8 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Roteiro Fácil Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
            </div>
            <h1 className="text-2xl font-bold text-green-600">Roteiro Fácil</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-700 hover:text-green-600 font-medium">
              Funcionalidades
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-green-600 font-medium">
              Planos
            </Link>
            <Link href="#testimonials" className="text-gray-700 hover:text-green-600 font-medium">
              Depoimentos
            </Link>
            <Link href="#" className="text-gray-700 hover:text-green-600 font-medium">
              Blog
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-green-600 font-medium">
              Contato
            </Link>
            <Button className="bg-green-600 hover:bg-green-700 text-white font-medium" asChild>
              <Link href="/create">Criar Roteiro</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-30 py-4 px-6">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Funcionalidades
              </Link>
              <Link
                href="#pricing"
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Planos
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Depoimentos
              </Link>
              <Link
                href="#"
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="#contact"
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <Button className="bg-green-600 hover:bg-green-700 text-white font-medium w-full">Criar Roteiro</Button>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}