// Tailwind CSS configuration file
// Tailwind is a utility-first CSS framework that provides pre-built CSS classes
/** @type {import('tailwindcss').Config} */
export default {
  // Specify which files Tailwind should scan for class usage
  // This enables "tree-shaking" - only CSS for classes you actually use gets included
  content: [
    "./index.html",                     // Scan the main HTML file
    "./src/**/*.{js,ts,jsx,tsx}",      // Scan all JavaScript/TypeScript files in src folder
  ],

  // Theme configuration to customize Tailwind's default design system
  theme: {
    extend: {
      // Custom color palette that matches the environmental theme of the app
      colors: {
        // Primary color (green) - used for main buttons, accents, and branding
        primary: {
          50: '#f0fdf4',    // Very light green (backgrounds)
          100: '#dcfce7',   // Light green (hover states)
          500: '#22c55e',   // Medium green (main brand color)
          600: '#16a34a',   // Darker green (buttons, emphasis)
          700: '#15803d',   // Dark green (text, borders)
        },
        // Secondary color (gray) - used for text, borders, and neutral elements
        secondary: {
          50: '#f8fafc',    // Very light gray (backgrounds)
          100: '#f1f5f9',   // Light gray (cards, sections)
          500: '#64748b',   // Medium gray (secondary text)
          600: '#475569',   // Dark gray (primary text)
        }
      }
    },
  },

  // No additional plugins are used in this project
  // Plugins can add extra functionality like forms, typography, etc.
  plugins: [],
}