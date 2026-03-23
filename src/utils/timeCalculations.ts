export interface Stage {
  id: number
  name: string
  duration: number
  enabled: boolean
}

/**
 * Calculate wake-up time based on train time and stage durations
 * @param trainTime - Time in HH:MM format
 * @param stages - Array of stage objects with duration and enabled properties
 * @returns Wake-up time in HH:MM format
 */
export function calculateWakeUpTime(trainTime: string, stages: Stage[]): string {
  if (!trainTime) {
    return ''
  }

  // Parse train time with validation
  const timeParts = trainTime.split(':').map(Number)
  const hours = timeParts[0]
  const minutes = timeParts[1]

  // Validate time format
  if (hours === undefined || minutes === undefined || isNaN(hours) || isNaN(minutes)) {
    return ''
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return ''
  }

  let totalMinutes = hours * 60 + minutes

  // Subtract all enabled stage durations
  const totalStageMinutes = stages
    .filter(stage => stage.enabled)
    .reduce((sum, stage) => sum + stage.duration, 0)

  totalMinutes -= totalStageMinutes

  // Handle negative time (previous day)
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60
  }

  // Convert back to hours and minutes
  const wakeHours = Math.floor(totalMinutes / 60)
  const wakeMinutes = totalMinutes % 60

  return `${String(wakeHours).padStart(2, '0')}:${String(wakeMinutes).padStart(2, '0')}`
}

/**
 * Calculate total enabled minutes from stages
 * @param stages - Array of stage objects
 * @returns Total minutes
 */
export function calculateTotalMinutes(stages: Stage[]): number {
  return stages
    .filter(stage => stage.enabled)
    .reduce((sum, stage) => sum + stage.duration, 0)
}

function formatTime12h(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
  const hours = Math.floor(normalized / 60)
  const minutes = normalized % 60
  const period = hours < 12 ? 'am' : 'pm'
  const displayHours = hours % 12 === 0 ? 12 : hours % 12
  const displayMinutes = minutes === 0 ? '' : `:${String(minutes).padStart(2, '0')}`
  return `${displayHours}${displayMinutes}${period}`
}

/**
 * Calculate start and end times for each stage
 * @param trainTime - Time in HH:MM format
 * @param stages - Array of stage objects
 * @returns Array of {start, end} in 12h format, or null for disabled stages
 */
export function calculateStageTimes(
  trainTime: string,
  stages: Stage[]
): ({ start: string; end: string } | null)[] {
  if (!trainTime) return stages.map(() => null)

  const timeParts = trainTime.split(':').map(Number)
  const hours = timeParts[0]
  const minutes = timeParts[1]

  if (hours === undefined || minutes === undefined || isNaN(hours) || isNaN(minutes)) {
    return stages.map(() => null)
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return stages.map(() => null)
  }

  const trainMinutes = hours * 60 + minutes
  const totalEnabled = stages.filter(s => s.enabled).reduce((sum, s) => sum + s.duration, 0)
  let currentMinutes = trainMinutes - totalEnabled

  return stages.map(stage => {
    if (!stage.enabled) return null
    const start = formatTime12h(currentMinutes)
    const end = formatTime12h(currentMinutes + stage.duration)
    currentMinutes += stage.duration
    return { start, end }
  })
}
