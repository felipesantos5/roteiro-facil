// pages/login.tsx
import { LoginButton } from '@/components/LoginButton'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Bem-vindo ao Roteiro Fácil</CardTitle>
          <CardDescription>Faça login para começar a planejar sua viagem</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButton />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Ao fazer login, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}