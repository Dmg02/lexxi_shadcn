'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from 'lucide-react'
import { columns } from '@/components/search/columns'
import { Trial } from '@/types/createTrial'
import { AddTrialDrawer } from '@/components/search/add-trial-drawer'

export default function MyTrialsPage() {
  const [trials, setTrials] = useState<Trial[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const addTrial = (newTrial: Trial) => {
    setTrials([...trials, newTrial])
    setIsDrawerOpen(false)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Trial</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsDrawerOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Trial
          </Button>
        </CardContent>
      </Card>

      <AddTrialDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddTrial={addTrial}
      />
    </div>
  )
}