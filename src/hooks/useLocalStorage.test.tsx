import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  it('initializes with provided value when storage is empty', async () => {
    const { result } = renderHook(() => useLocalStorage('trainTime', '08:50'))

    expect(result.current[0]).toBe('08:50')

    await waitFor(() => {
      expect(window.localStorage.getItem('trainTime')).toBe('"08:50"')
    })
  })

  it('prefers stored value and updates storage when setter is called', async () => {
    window.localStorage.setItem('stage-data', JSON.stringify({ enabled: true }))

    const { result } = renderHook(() =>
      useLocalStorage<{ enabled: boolean }>('stage-data', { enabled: false })
    )

    expect(result.current[0]).toEqual({ enabled: true })

    act(() => {
      result.current[1]({ enabled: false })
    })

    await waitFor(() => {
      expect(window.localStorage.getItem('stage-data')).toBe('{"enabled":false}')
    })
  })

  it('falls back to initial value when stored data is invalid JSON', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    window.localStorage.setItem('invalid-json', 'not-json')

    const { result } = renderHook(() => useLocalStorage('invalid-json', 'fallback'))

    expect(result.current[0]).toBe('fallback')
    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(consoleErrorSpy.mock.calls[0][0]).toContain('invalid-json')

    consoleErrorSpy.mockRestore()
  })
})
