'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const [wachtwoord, setWachtwoord] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wachtwoord }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Onjuist wachtwoord. Probeer het opnieuw.')
      }
    } catch {
      setError('Er is een fout opgetreden.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PawsNL Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Voer je wachtwoord in om door te gaan</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="wachtwoord" className="block text-sm font-medium text-gray-700 mb-1.5">
                Wachtwoord
              </label>
              <input
                id="wachtwoord"
                type="password"
                required
                value={wachtwoord}
                onChange={(e) => setWachtwoord(e.target.value)}
                className="input"
                placeholder="••••••••"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'Inloggen...' : 'Inloggen'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
