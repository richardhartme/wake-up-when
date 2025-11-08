import { useState, useMemo } from 'react'
import type { Stage } from './utils/timeCalculations'
import { calculateWakeUpTime, calculateTotalMinutes } from './utils/timeCalculations'
import { useLocalStorage } from './hooks/useLocalStorage'

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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newStages = [...stages]
    const draggedStage = newStages[draggedIndex]

    // Ensure draggedStage exists
    if (!draggedStage) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    // Remove from old position
    newStages.splice(draggedIndex, 1)
    // Insert at new position
    newStages.splice(dropIndex, 0, draggedStage)

    setStages(newStages)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      {/* Two Column Layout */}
      <div className="flex flex-col md:flex-row min-h-screen max-w-7xl w-full">
        {/* Left Column - Logo */}
        <aside className="md:w-1/3 lg:w-1/4 p-6 md:p-8 flex items-start justify-center md:sticky md:top-0 md:h-screen">
          <div className="text-center">
            <img src="/logo.png" alt="Wake up When" className="mx-auto mt-4 mb-4" />
            <p className="text-sm text-gray-500">Calculate what time you need to wake up to make your train</p>
          </div>
        </aside>

        {/* Right Column - Main Content */}
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-12 md:px-8 max-w-4xl">
        {/* Wake-up Time Display */}
        <div className="bg-white rounded-2xl border border-gray-200 p-12 mb-6">
          <div className="text-center">
            <p className="text-sm uppercase tracking-wide text-gray-500 mb-3">Wake up at</p>
            <div className="text-7xl font-light text-gray-900 mb-4 tracking-tight">
              {wakeUpTime || '--:--'}
            </div>
            <p className="text-sm text-gray-600">
              {totalEnabledMinutes} minutes total
            </p>
          </div>
        </div>

        {/* Train Time Input */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Train Departure Time
          </label>
          <input
            type="time"
            value={trainTime}
            onChange={(e) => { setTrainTime(e.target.value); }}
            className="w-full px-4 py-3 text-xl font-light text-center border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
          />
        </div>

        {/* Stages List */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Morning Stages</h3>

          <div className="space-y-2">
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                draggable
                onDragStart={() => { handleDragStart(index); }}
                onDragOver={(e) => { handleDragOver(e, index); }}
                onDragLeave={handleDragLeave}
                onDrop={(e) => { handleDrop(e, index); }}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-move ${
                  stage.enabled
                    ? 'bg-gray-50'
                    : 'bg-white opacity-50'
                } ${
                  draggedIndex === index ? 'opacity-50 scale-95' : ''
                } ${
                  dragOverIndex === index && draggedIndex !== index ? 'ring-2 ring-gray-900' : ''
                }`}
              >
                {/* Drag Handle */}
                <div className="text-gray-400 cursor-move" title="Drag to reorder">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <circle cx="4" cy="4" r="1.5"/>
                    <circle cx="4" cy="8" r="1.5"/>
                    <circle cx="4" cy="12" r="1.5"/>
                    <circle cx="8" cy="4" r="1.5"/>
                    <circle cx="8" cy="8" r="1.5"/>
                    <circle cx="8" cy="12" r="1.5"/>
                  </svg>
                </div>

                {/* Enable/Disable Toggle */}
                <input
                  type="checkbox"
                  checked={stage.enabled}
                  onChange={() => { toggleStage(stage.id); }}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
                />

                {/* Duration Input */}
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={stage.duration}
                    onChange={(e) => { updateStageDuration(stage.id, e.target.value); }}
                    className="w-12 text-sm text-center bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 transition-colors rounded-none px-1 py-0.5"
                    min="0"
                    disabled={!stage.enabled}
                  />
                  <span className="text-sm text-gray-600">min</span>
                </div>

                {/* Stage Name */}
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => { updateStageName(stage.id, e.target.value); }}
                  className="flex-1 px-1 py-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
                  disabled={!stage.enabled}
                />

                {/* Remove Button */}
                <button
                  onClick={() => { removeStage(stage.id); }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Remove stage"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Add New Stage */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={newStageName}
                onChange={(e) => { setNewStageName(e.target.value); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addStage();
                  }
                }}
                placeholder="Add a new stage..."
                className="flex-1 px-4 py-2 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-400"
              />
              <button
                onClick={addStage}
                className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 py-4 text-center">
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
    </div>
  )
}

export default App
