import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('Wake up When')).toBeInTheDocument()
  })

  it('displays the default train time', () => {
    render(<App />)
    const timeInput = screen.getByDisplayValue('08:50')
    expect(timeInput).toHaveAttribute('type', 'time')
  })

  it('displays default stages', () => {
    render(<App />)
    expect(screen.getByDisplayValue('Walking to Station')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Getting Ready')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Working Out')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Waking up')).toBeInTheDocument()
  })

  it('calculates and displays wake-up time', () => {
    render(<App />)
    // With default settings (8:50 train, 155 minutes total)
    // Wake up time should be 06:15
    expect(screen.getByText('06:15')).toBeInTheDocument()
  })

  it('displays total preparation time', () => {
    render(<App />)
    expect(screen.getByText('155 minutes total')).toBeInTheDocument()
  })

  it('allows adding a new stage', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('Add a new stage...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    await user.type(input, 'New Stage')
    await user.click(addButton)

    expect(screen.getByDisplayValue('New Stage')).toBeInTheDocument()
  })

  it('allows updating stage duration', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Find the first duration input (Walking to Station - 20 minutes)
    const durationInputs = screen.getAllByRole('spinbutton')
    const firstDuration = durationInputs[0]

    await user.clear(firstDuration)
    await user.type(firstDuration, '30')

    // Total should now be 165 (was 155 + 10)
    expect(screen.getByText('165 minutes total')).toBeInTheDocument()
  })

  it('allows disabling a stage', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Find all checkboxes and uncheck the first one (Walking to Station - 20 min)
    const checkboxes = screen.getAllByRole('checkbox')
    const firstCheckbox = checkboxes[0]

    await user.click(firstCheckbox)

    // Total should now be 135 (155 - 20)
    expect(screen.getByText('135 minutes total')).toBeInTheDocument()
  })
})
