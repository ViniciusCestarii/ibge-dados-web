'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const handleClearQueryParameters = () => {
    window.location.href = '/'
    reset()
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h2 className="text-3xl font-bold text-destructive mb-4">
        Oops! Parece que deu algo de errado.
      </h2>
      <p className="text-lg mb-2">
        Desculpe pela inconveniência. Nossa equipe já foi notificada e estamos
        trabalhando para resolver o problema.
      </p>
      {error.digest && <p className="text-sm">Error Code: {error.digest}</p>}
      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        <Button onClick={() => reset()}>Tentar de novo</Button>
        <Button onClick={handleClearQueryParameters}>Limpar campos</Button>
      </div>
    </main>
  )
}
