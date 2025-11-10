# Wake up When

A Progressive Web App that calculates what time you need to wake up based on your train departure time and morning routine stages.

## What It Does

Enter your train departure time and define your morning routine stages (working out, getting ready, walking to the station, etc.). The app automatically calculates what time you need to wake up to catch your train on time.

## Features

- **Smart Time Calculation**: Automatically calculates wake-up time by subtracting all active stage durations from your train time
- **Customizable Stages**: Add, remove, edit, and reorder your morning routine stages with drag-and-drop
- **Enable/Disable Stages**: Toggle stages on/off without deleting them (e.g., skip workout on certain days)
- **Real-time Updates**: Wake-up time recalculates instantly as you adjust durations or toggle stages
- **Clean Interface**: Modern UI built with shadcn/ui components and Tailwind CSS
- **Progressive Web App**: Install on any device and use offline
- **Persistent State**: Your train time and stages are saved to localStorage

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Testing

```bash
npm test              # Run tests in watch mode
npm test -- --run     # Run tests once (CI mode)
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
```

### Linting

```bash
npm run lint          # Run ESLint (fails on warnings)
npm run lint:fix      # Auto-fix ESLint issues
```

### Build

```bash
npm run build         # Create production build
npm run preview       # Preview production build
```

## Usage

1. **Set Train Time**: Enter the time your train departs
2. **Manage Stages**:
   - Add new stages with the "Add a new stage" input
   - Edit stage names by clicking on them
   - Adjust durations using the minute inputs
   - Drag and drop to reorder stages
   - Remove stages with the X button
3. **Enable/Disable**: Check/uncheck stages to include or exclude them from the calculation
4. **View Result**: Your calculated wake-up time displays prominently at the top

## Default Stages

- Waking Up: 20 minutes
- Working Out: 60 minutes
- Getting Ready: 55 minutes
- Getting to the Station: 20 minutes

Default train time: 8:50 AM

## Tech Stack

- **React 19**: UI framework with TypeScript
- **TypeScript**: Strict type checking enabled
- **Vite**: Build tool and dev server
- **Tailwind CSS v4**: Utility-first styling with PostCSS
- **shadcn/ui**: Component library built on Radix UI
- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing
- **ESLint**: Code linting with TypeScript support
- **PWA**: Offline support and installability via vite-plugin-pwa

## Project Structure

```
wake-up-when/
├── src/
│   ├── App.tsx                      # Main application component
│   ├── App.test.tsx                 # Component tests
│   ├── main.tsx                     # Application entry point
│   ├── index.css                    # Global styles and theme variables
│   ├── components/
│   │   └── ui/                      # shadcn/ui components
│   ├── hooks/
│   │   ├── useLocalStorage.ts       # localStorage persistence hook
│   │   └── use-mobile.ts            # Mobile detection hook
│   ├── lib/
│   │   └── utils.ts                 # Utility functions (cn helper)
│   ├── utils/
│   │   ├── timeCalculations.ts      # Time calculation utilities
│   │   └── timeCalculations.test.ts # Utility tests
│   └── test/
│       └── setup.ts                 # Test configuration
├── public/                          # PWA icons and static assets
├── index.html                       # HTML template
├── vite.config.ts                   # Vite and PWA configuration
├── tsconfig.json                    # TypeScript configuration
├── components.json                  # shadcn/ui configuration
└── CLAUDE.md                        # AI assistant guidance
```

## License

ISC
