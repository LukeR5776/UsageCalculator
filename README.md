# CO₂ Emissions Calculator

A modern web application that calculates CO₂ emissions from utility usage (electricity, natural gas, and water) and provides personalized recommendations for reducing environmental impact.

## Features

- **📍 Location-Based Calculations**: Uses ZIP code to determine regional emission factors
- **⚡ Multi-Utility Support**: Track electricity, natural gas, and water usage
- **📊 Interactive Visualizations**: Charts and graphs showing emission breakdowns and trends
- **🏘️ Regional Comparisons**: Compare your emissions to regional averages
- **💡 Personalized Recommendations**: Get tailored tips to reduce emissions and save money
- **📈 Historical Tracking**: Monitor your emissions over time
- **🎨 Modern UI**: Sleek, responsive design with smooth animations

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context + useReducer

## Architecture

The application is built with a highly modular architecture for easy collaboration:

```
src/
├── components/          # Reusable UI components
├── modules/            # Feature-specific modules
│   ├── input/         # Usage input components
│   ├── calculations/  # CO₂ calculation logic
│   ├── visualization/ # Charts and graphs
│   ├── comparison/    # Regional comparison
│   └── recommendations/ # Tips system
├── services/          # API and data services
├── utils/             # Shared utilities
├── hooks/             # Custom React hooks
├── contexts/          # React contexts
└── types/             # TypeScript interfaces
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UsageCalc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Usage

1. **Enter Location**: Start by entering your ZIP code to get location-specific emission factors
2. **Input Usage Data**: Enter your monthly utility usage or let the app estimate from bill amounts
3. **View Results**: See your CO₂ emissions with interactive charts and regional comparisons
4. **Get Recommendations**: Receive personalized tips to reduce emissions and save money
5. **Track Over Time**: Add multiple months to see trends and track progress

## Performance Features

- **Code Splitting**: Optimized bundle splitting for faster loading
- **Memoized Calculations**: Efficient recalculation of emissions
- **Responsive Design**: Works seamlessly on all device sizes
- **Fast Rendering**: Optimized React components with minimal re-renders

## Contributing

The modular architecture makes it easy for multiple developers to work simultaneously:

- Each feature is in its own module
- Shared utilities are centralized
- TypeScript ensures type safety
- Component separation prevents conflicts

## License

MIT License - feel free to use and modify for your projects.
