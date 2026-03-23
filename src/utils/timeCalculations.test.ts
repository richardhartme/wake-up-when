import { describe, it, expect } from 'vitest'
import { calculateWakeUpTime, calculateTotalMinutes, calculateStageTimes, type Stage } from './timeCalculations'

describe('calculateWakeUpTime', () => {
  it('calculates wake-up time correctly for simple case', () => {
    const trainTime = '09:00'
    const stages: Stage[] = [
      { id: 1, name: 'Stage 1', duration: 20, enabled: true },
      { id: 2, name: 'Stage 2', duration: 30, enabled: true },
    ]

    const result = calculateWakeUpTime(trainTime, stages)
    expect(result).toBe('08:10')
  })

  it('handles disabled stages correctly', () => {
    const trainTime = '09:00'
    const stages: Stage[] = [
      { id: 1, name: 'Stage 1', duration: 20, enabled: true },
      { id: 2, name: 'Stage 2', duration: 30, enabled: false },
      { id: 3, name: 'Stage 3', duration: 10, enabled: true },
    ]

    const result = calculateWakeUpTime(trainTime, stages)
    expect(result).toBe('08:30')
  })

  it('handles time wrapping to previous day', () => {
    const trainTime = '01:00'
    const stages: Stage[] = [
      { id: 1, name: 'Stage 1', duration: 120, enabled: true },
    ]

    const result = calculateWakeUpTime(trainTime, stages)
    expect(result).toBe('23:00')
  })

  it('returns empty string for empty train time', () => {
    const result = calculateWakeUpTime('', [])
    expect(result).toBe('')
  })

  it('handles multiple stages correctly', () => {
    const trainTime = '08:50'
    const stages: Stage[] = [
      { id: 1, name: 'Getting to the Station', duration: 20, enabled: true },
      { id: 2, name: 'Getting Ready', duration: 55, enabled: true },
      { id: 3, name: 'Working Out', duration: 60, enabled: true },
      { id: 4, name: 'Waking Up', duration: 20, enabled: true },
    ]

    const result = calculateWakeUpTime(trainTime, stages)
    expect(result).toBe('06:15')
  })
})

describe('calculateTotalMinutes', () => {
  it('calculates total minutes for enabled stages', () => {
    const stages: Stage[] = [
      { id: 1, name: 'Stage 1', duration: 20, enabled: true },
      { id: 2, name: 'Stage 2', duration: 30, enabled: true },
    ]

    const result = calculateTotalMinutes(stages)
    expect(result).toBe(50)
  })

  it('ignores disabled stages', () => {
    const stages: Stage[] = [
      { id: 1, name: 'Stage 1', duration: 20, enabled: true },
      { id: 2, name: 'Stage 2', duration: 30, enabled: false },
      { id: 3, name: 'Stage 3', duration: 10, enabled: true },
    ]

    const result = calculateTotalMinutes(stages)
    expect(result).toBe(30)
  })

  it('returns 0 for empty array', () => {
    const result = calculateTotalMinutes([])
    expect(result).toBe(0)
  })

  it('returns 0 when all stages are disabled', () => {
    const stages: Stage[] = [
      { id: 1, name: 'Stage 1', duration: 20, enabled: false },
      { id: 2, name: 'Stage 2', duration: 30, enabled: false },
    ]

    const result = calculateTotalMinutes(stages)
    expect(result).toBe(0)
  })
})

describe('calculateStageTimes', () => {
  it('calculates start and end times for two stages', () => {
    // train at 6:30am, 60min + 30min = 90min total, wake up at 5am
    const trainTime = '06:30'
    const stages: Stage[] = [
      { id: 1, name: 'Stage 1', duration: 60, enabled: true },
      { id: 2, name: 'Stage 2', duration: 30, enabled: true },
    ]

    const result = calculateStageTimes(trainTime, stages)
    expect(result[0]).toEqual({ start: '5am', end: '6am' })
    expect(result[1]).toEqual({ start: '6am', end: '6:30am' })
  })

  it('returns null for disabled stages', () => {
    const trainTime = '09:00'
    const stages: Stage[] = [
      { id: 1, name: 'Stage 1', duration: 20, enabled: true },
      { id: 2, name: 'Stage 2', duration: 30, enabled: false },
      { id: 3, name: 'Stage 3', duration: 10, enabled: true },
    ]

    const result = calculateStageTimes(trainTime, stages)
    expect(result[0]).not.toBeNull()
    expect(result[1]).toBeNull()
    expect(result[2]).not.toBeNull()
  })

  it('returns all nulls for invalid train time', () => {
    const stages: Stage[] = [
      { id: 1, name: 'Stage 1', duration: 20, enabled: true },
    ]

    const result = calculateStageTimes('', stages)
    expect(result).toEqual([null])
  })
})
