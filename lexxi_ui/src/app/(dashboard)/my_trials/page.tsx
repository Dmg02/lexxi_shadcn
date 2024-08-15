'use client'

import { TrialTable } from "@/components/search/trialTable"
import { Trial } from "@/types/createTrial"

export default function MyTrialsPage() {
  // TODO: Replace this with actual data fetching logic
  const trials: Trial[] = []

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">My Trials</h1>
      {trials.length > 0 ? (
        <TrialTable data={trials} />
      ) : (
        <p>No trials available. Add a new trial to get started.</p>
      )}
    </div>
  )
}