# Wake up When

A Progressive Web App that calculates what time you need to wake up based on your train departure time and morning routine stages.

## What It Does

Enter your train departure time and define your morning routine stages (working out, getting ready, walking to the station, etc.). The app automatically calculates what time you need to wake up to catch your train on time.

## Features

- **Smart Time Calculation**: Automatically calculates wake-up time by subtracting all active stage durations from your train time
- **Customizable Stages**: Add, remove, edit, and reorder your morning routine stages
- **Enable/Disable Stages**: Toggle stages on/off without deleting them (e.g., skip workout on certain days)
- **Real-time Updates**: Wake-up time recalculates instantly as you adjust durations or toggle stages
- **Clean Interface**: Minimal, modern design focused on usability
- **Progressive Web App**: Install on any device and use offline

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
npm test -- --run     # Run tests once
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
   - Reorder stages with the up/down arrows
   - Remove stages with the X button
3. **Enable/Disable**: Check/uncheck stages to include or exclude them from the calculation
4. **View Result**: Your calculated wake-up time displays prominently at the top

## Default Stages

- Walking to Station: 20 minutes
- Getting Ready: 55 minutes
- Working Out: 60 minutes
- Waking up: 20 minutes

Default train time: 8:50 AM

## Tech Stack

- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Vitest**: Unit testing
- **React Testing Library**: Component testing
- **PWA**: Offline support and installability

## Project Structure

```
wake-up-when/
├── src/
│   ├── App.jsx                      # Main application component
│   ├── App.test.jsx                 # Component tests
│   ├── main.jsx                     # Application entry point
│   ├── index.css                    # Global styles
│   ├── utils/
│   │   ├── timeCalculations.js      # Time calculation utilities
│   │   └── timeCalculations.test.js # Utility tests
│   └── test/
│       └── setup.js                 # Test configuration
├── public/                          # PWA icons and static assets
├── index.html                       # HTML template
├── vite.config.js                   # Vite and PWA configuration
└── tailwind.config.js               # Tailwind CSS configuration
```

## License

ISC
