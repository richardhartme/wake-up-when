import { useState, useEffect } from 'react'

function App() {
  const [trainTime, setTrainTime] = useState('08:50')
  const [stages, setStages] = useState([
    { id: 4, name: 'Waking Up', duration: 20, enabled: true },
    { id: 3, name: 'Working Out', duration: 60, enabled: true },
    { id: 2, name: 'Getting Ready', duration: 55, enabled: true },
    { id: 1, name: 'Walking to Station', duration: 20, enabled: true },
  ])
  const [newStageName, setNewStageName] = useState('')
  const [wakeUpTime, setWakeUpTime] = useState('')
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  // Calculate wake-up time whenever train time or stages change
  useEffect(() => {
    calculateWakeUpTime()
  }, [trainTime, stages])

  const calculateWakeUpTime = () => {
    if (!trainTime) {
      setWakeUpTime('')
      return
    }

    // Parse train time
    const [hours, minutes] = trainTime.split(':').map(Number)
    let totalMinutes = hours * 60 + minutes

    // Subtract all enabled stage durations
    const totalStageMinutes = stages
      .filter(stage => stage.enabled)
      .reduce((sum, stage) => sum + (parseInt(stage.duration) || 0), 0)

    totalMinutes -= totalStageMinutes

    // Handle negative time (previous day)
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60
    }

    // Convert back to hours and minutes
    const wakeHours = Math.floor(totalMinutes / 60)
    const wakeMinutes = totalMinutes % 60

    setWakeUpTime(`${String(wakeHours).padStart(2, '0')}:${String(wakeMinutes).padStart(2, '0')}`)
  }

  const addStage = () => {
    if (!newStageName.trim()) return

    const newStage = {
      id: Date.now(),
      name: newStageName,
      duration: 15,
      enabled: true,
    }

    setStages([...stages, newStage])
    setNewStageName('')
  }

  const removeStage = (id) => {
    setStages(stages.filter(stage => stage.id !== id))
  }

  const toggleStage = (id) => {
    setStages(stages.map(stage =>
      stage.id === id ? { ...stage, enabled: !stage.enabled } : stage
    ))
  }

  const updateStageDuration = (id, duration) => {
    setStages(stages.map(stage =>
      stage.id === id ? { ...stage, duration: parseInt(duration) || 0 } : stage
    ))
  }

  const updateStageName = (id, name) => {
    setStages(stages.map(stage =>
      stage.id === id ? { ...stage, name } : stage
    ))
  }

  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newStages = [...stages]
    const draggedStage = newStages[draggedIndex]

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

  const totalEnabledMinutes = stages
    .filter(stage => stage.enabled)
    .reduce((sum, stage) => sum + (parseInt(stage.duration) || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="">
        <div className="max-w-3xl text-center mx-auto px-4 py-6 sm:px-6">
          <h1 className="text-3xl font-semibold text-gray-900">Wake up When</h1>
          <p className="text-sm text-gray-500 mt-1">Calculate your wake-up time</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-2 sm:px-6">
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
            onChange={(e) => setTrainTime(e.target.value)}
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
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
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
                  onChange={() => toggleStage(stage.id)}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
                />

                {/* Stage Name */}
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => updateStageName(stage.id, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
                  disabled={!stage.enabled}
                />

                {/* Duration Input and Preset Buttons */}
                <div className="flex items-center gap-1">
                  {/* Preset Time Buttons */}
                  {stage.enabled && (
                    <div className="flex gap-1">
                      {[20, 40, 60].map((minutes) => (
                        <button
                          key={minutes}
                          onClick={() => updateStageDuration(stage.id, minutes)}
                          className="px-2 py-1 text-xs text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-100 hover:border-gray-300 transition-colors"
                          title={`Set to ${minutes} minutes`}
                        >
                          {minutes}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    <input
                      type="number"
                      value={stage.duration}
                      onChange={(e) => updateStageDuration(stage.id, e.target.value)}
                      className="w-12 text-sm text-center bg-transparent border-0 focus:outline-none focus:ring-0"
                      min="0"
                      disabled={!stage.enabled}
                    />
                    <span className="text-xs text-gray-500">min</span>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeStage(stage.id)}
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
                onChange={(e) => setNewStageName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addStage()}
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
      </main>
    </div>
  )
}

export default App
