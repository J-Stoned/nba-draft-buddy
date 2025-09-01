'use client'

import { DraftAssistant } from '@/components/draft-assistant'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🏀 NBA Draft Buddy
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Elite AI-powered draft recommendations to dominate your fantasy basketball league
          </p>
        </header>
        
        <DraftAssistant />
      </div>
    </main>
  )
}