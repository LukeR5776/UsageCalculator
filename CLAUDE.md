# Claude Code Guidelines for UsageCalculator Project

## Project Overview
**CO₂ Emissions Calculator** - A React + TypeScript + Vite web application that calculates carbon emissions from utility usage and provides personalized recommendations for reducing environmental impact.

### Core Features
- **Location-based calculations** using ZIP codes for regional emission factors
- **Multi-step form flow**: Location → Usage Input → Results Display
- **Professional dark theme** with shadcn-inspired design system
- **Custom SVG/CSS charts**: Pie charts, bar charts, line charts, scatter plots
- **Personalized recommendations** based on usage patterns
- **Monthly tracking** with historical data storage
- **Regional comparisons** and cost savings estimates

## Development Environment

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite 7
- **Styling**: Tailwind CSS v4 + Dark theme with CSS variables
- **Charts**: Custom SVG/CSS charts (high performance, no library dependencies)
- **UI Components**: shadcn/ui pattern with custom implementations
- **Build**: npm, TypeScript strict mode
- **Dev Server**: http://localhost:5173/

### File Structure (Updated)
```
src/
├── components/          # All React components
│   ├── ui/             # shadcn/ui components (card.tsx, chart.tsx)
│   ├── EmissionsChart.tsx    # Professional SVG/CSS charts
│   ├── EmissionsScatterPlot.tsx  # Working scatter plot
│   ├── LocationInput.tsx
│   ├── UsageInputForm.tsx  # Dark theme form styling
│   ├── EmissionsEngine.tsx
│   ├── RecommendationEngine.tsx
│   └── RegionalComparison.tsx
├── contexts/           # React Context (AppContext)
├── lib/               # Utilities and data
│   ├── types.ts
│   ├── calculations.ts
│   ├── locationService.ts
│   ├── emissionFactors.ts
│   └── utils.ts       # shadcn utility functions
└── index.css          # Dark theme CSS variables and styling
```

## Critical Rules & Patterns

### Rule #1: Delete Failed Code Attempts
**When troubleshooting fails, DELETE the attempted fix code completely.**

- ❌ Don't leave broken/non-working code in the project
- ❌ Don't comment out failed attempts
- ❌ Don't keep multiple versions of the same component
- ✅ DELETE failed code completely before trying a new approach
- ✅ Start fresh with a clean slate
- ✅ Keep the codebase minimal and functional

**Example:**
If a graph component doesn't render:
1. Try Fix #1 → Doesn't work
2. **DELETE** Fix #1 code completely
3. Try Fix #2 → Works
4. Keep only Fix #2

### Rule #2: Fix Infinite Re-render Issues
**Always remove callback functions from useEffect dependency arrays in engine components.**

❌ **Problem Pattern:**
```typescript
React.useEffect(() => {
  const result = calculateSomething(data);
  onResultGenerated(result);  // Callback triggers state update
}, [data, onResultGenerated]);  // ← This causes infinite loops
```

✅ **Solution:**
```typescript
React.useEffect(() => {
  const result = calculateSomething(data);
  onResultGenerated(result);
}, [data]);  // ← Remove callback from dependencies
```

**Affected Components:**
- `EmissionsEngine.tsx` - Fixed ✅
- `RecommendationEngine.tsx` - Fixed ✅

## Known Issues & Solutions

### Charts & Visualization
- **✅ Custom SVG/CSS charts work perfectly**: High performance, no library dependencies
- **✅ Professional shadcn-style design**: Dark theme compatible with proper CSS variables
- **❌ Recharts removed**: Library caused rendering issues and bundle bloat
- **Solution**: Custom charts using pure SVG and CSS provide better control and performance

### Build & Development
- **✅ Production builds work**: `npm run build` passes successfully
- **✅ TypeScript strict**: All type errors resolved
- **✅ Path aliases configured**: `@/` imports work in both dev and build
- **✅ Dark theme implementation**: Forced dark mode with CSS variables
- **Dev server**: Use fresh `npm run dev` if issues occur

### Theme & Styling
- **✅ Consistent dark theme**: All components use proper CSS variables
- **✅ Form elements themed**: Input fields, buttons, and cards match dark theme
- **✅ Professional appearance**: shadcn-inspired design with green accents
- **Bundle size optimized**: ~176KB gzipped (reduced from 182KB+)

## Component Architecture

### State Management
- **AppContext**: Centralized state with useReducer pattern
- **Step-based navigation**: Location → Usage → Results
- **Monthly data persistence**: Historical tracking

### Data Flow
1. User enters ZIP code → `LocationInput`
2. ZIP code resolves to emission factors → `locationService.ts`
3. User enters utility usage → `UsageInputForm`
4. Calculations performed → `calculations.ts`
5. Results displayed with charts and recommendations

### Form Optimization
```typescript
// UsageInputForm.tsx - Prevent re-renders
const estimatedUsage = useMemo(() => {
  // Calculation logic here
}, [/* stable dependencies */]);
```

## Testing & Quality Assurance

### Before Making Changes
1. **Read existing code structure** first
2. **Check if similar patterns exist** in the codebase
3. **Test at each step** - don't batch multiple changes

### Build Pipeline
```bash
npm run dev     # Development server (may need fresh restart)
npm run build   # Production build (must pass)
```

### Visual Testing
- Navigate through full app flow: ZIP code → Usage → Results
- Verify all charts render (pie, bar, line, scatter)
- Check console for errors (should be clean)
- Test with different usage values

## Dependencies & Libraries

### Working Libraries
- **Recharts**: All chart types work reliably
- **Lucide React**: Icons throughout the app
- **React**: Core functionality stable

### Problematic Libraries
- **shadcn/ui charts**: Rendering issues, CSS conflicts with Tailwind v4
- **Tailwind CSS plugins**: Some import issues with Vite

### Installation Notes
- **shadcn/ui**: Requires TypeScript path aliases in both `tsconfig.json` and `vite.config.ts`
- **@types/node**: Required for Vite path resolution

## Future Development Notes

### When Adding New Features
1. **Follow existing patterns** in the codebase
2. **Use working libraries** (direct Recharts, not shadcn charts)
3. **Test immediately** after each change
4. **Delete failed attempts** completely per Rule #1

### Performance Considerations
- Form inputs use `useMemo` to prevent unnecessary recalculations
- Charts use `ResponsiveContainer` for proper sizing
- Build output is optimized (~180KB gzipped)

### Code Style
- **No comments** unless explicitly requested
- **TypeScript strict mode** - all types must be proper
- **Consistent naming**: PascalCase for components, camelCase for functions
- **Clean imports**: Absolute paths with `@/` alias where possible

---

**Last Updated**: Session covering shadcn/ui implementation, infinite re-render fixes, and working scatter plot implementation.

*This file helps Claude maintain clean, functional code and avoid known pitfalls in future development sessions.*