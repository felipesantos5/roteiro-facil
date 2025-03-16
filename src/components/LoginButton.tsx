// components/LoginButton.tsx
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from "@/components/ui/button"
// import { Icons } from "@/components/ui/icons"

export function LoginButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Login failed:', error)
      // Aqui você pode adicionar um tratamento de erro mais robusto, como exibir uma mensagem ao usuário
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogin} disabled={isLoading} size="lg" className="w-full">
      {isLoading ? (
        <p className="mr-2 h-4 w-4 animate-spin">spiner</p>
      ) : (
        <p className="mr-2 h-4 w-4" >google</p>
      )}
      Entrar com Google
    </Button>
  )
}