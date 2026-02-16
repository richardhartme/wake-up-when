import { useState, useMemo } from 'react'
import type { Stage } from './utils/timeCalculations'
import { calculateWakeUpTime, calculateTotalMinutes } from './utils/timeCalculations'
import { useLocalStorage } from './hooks/useLocalStorage'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

const DEFAULT_STAGES: Stage[] = [
  { id: 4, name: 'Waking Up', duration: 20, enabled: true },
  { id: 3, name: 'Working Out', duration: 60, enabled: true },
  { id: 2, name: 'Getting Ready', duration: 55, enabled: true },
  { id: 1, name: 'Getting to the Station', duration: 20, enabled: true },
]

function App() {
  const [trainTime, setTrainTime] = useLocalStorage<string>('trainTime', '08:50')
  const [stages, setStages] = useLocalStorage<Stage[]>('stages', DEFAULT_STAGES)
  const [newStageName, setNewStageName] = useState<string>('')

  // Calculate wake-up time as derived state
  const wakeUpTime = useMemo(() => calculateWakeUpTime(trainTime, stages), [trainTime, stages])

  // Calculate total minutes as derived state
  const totalEnabledMinutes = useMemo(() => calculateTotalMinutes(stages), [stages])

  const addStage = () => {
    if (!newStageName.trim()) return

    const newStage: Stage = {
      id: Date.now(),
      name: newStageName,
      duration: 15,
      enabled: true,
    }

    setStages([...stages, newStage])
    setNewStageName('')
  }

  const removeStage = (id: number) => {
    setStages(stages.filter(stage => stage.id !== id))
  }

  const toggleStage = (id: number) => {
    setStages(stages.map(stage =>
      stage.id === id ? { ...stage, enabled: !stage.enabled } : stage
    ))
  }

  const updateStageDuration = (id: number, duration: string | number) => {
    const parsedDuration = typeof duration === 'number' ? duration : parseInt(duration, 10)
    setStages(stages.map(stage =>
      stage.id === id ? { ...stage, duration: isNaN(parsedDuration) ? 0 : parsedDuration } : stage
    ))
  }

  const updateStageName = (id: number, name: string) => {
    setStages(stages.map(stage =>
      stage.id === id ? { ...stage, name } : stage
    ))
  }

  const resetState = () => {
    setTrainTime('08:50')
    setStages(DEFAULT_STAGES)
    setNewStageName('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
        <main>

          <div className="text-center mb-4">
            <img src="/logo.png" alt="Wake up When" className="mx-auto my-6 h-36" />
            <p className="text-sm text-gray-500">Calculate what time you need to wake up to make your train</p>
          </div>

          {/* Wake-up Time Display */}
          <Card className="mb-4">
            <CardContent>
              <div className="pt-8 text-center">
                <p className="text-sm uppercase tracking-wide text-gray-500 mb-3">Wake up at</p>
                <div className="text-7xl font-light text-gray-900 mb-4 tracking-tight">
                  {wakeUpTime || '--:--'}
                </div>
                <p className="text-sm text-gray-600">
                  {totalEnabledMinutes} minutes total
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Train Time Input */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Train Departure Time</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Input
                type="time"
                value={trainTime}
                onChange={(e) => { setTrainTime(e.target.value); }}
                className="mx-auto w-88 px-1 py-0.5 text-sm text-center"
              />
            </CardContent>
          </Card>

        {/* Stages List */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Morning Stages</CardTitle>
          </CardHeader>
          <CardContent>
            {stages.map((stage) => (
              <div
                key={stage.id}
                className={`flex items-center gap-3 p-2 mb-2 rounded-xl transition-all ${
                  stage.enabled
                    ? 'bg-gray-50'
                    : 'bg-white opacity-50'
                }`}
              >
                {/* Enable/Disable Toggle */}
                <Checkbox
                  defaultChecked={stage.enabled}
                  onCheckedChange={() => { toggleStage(stage.id); }}
                />

                {/* Duration Input */}
                  <input
                    type="number"
                    value={stage.duration}
                    onChange={(e) => { updateStageDuration(stage.id, e.target.value); }}
                    className="w-8 px-1 py-0.5 text-sm text-center bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors rounded-none"
                    min="0"
                    disabled={!stage.enabled}
                  />
                  <span className="text-sm text-gray-600">min</span>

                {/* Stage Name */}
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => { updateStageName(stage.id, e.target.value); }}
                  className="px-1 py-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
                  disabled={!stage.enabled}
                />

                {/* Remove Button */}
                <button
                  onClick={() => { removeStage(stage.id); }}
                  className="p-2 shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Remove stage"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Add New Stage */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newStageName}
                  onChange={(e) => { setNewStageName(e.target.value); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addStage();
                    }
                  }}
                  placeholder="Add a new stage..."
                />
                <Button
                  onClick={addStage}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4 flex justify-center">
          <Button onClick={resetState}>Reset</Button>
        </div>

        {/* Footer */}
        <footer className="py-4 text-center">
          <a
            href="https://github.com/Hates/get-ready-timer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            View on GitHub
          </a>
        </footer>
      </main>
    </div>
  )
}

export default App
