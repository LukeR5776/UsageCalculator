// Import React's StrictMode component which helps catch bugs during development
import { StrictMode } from 'react'
// Import createRoot from React DOM - this is the new way to render React apps (React 18+)
import { createRoot } from 'react-dom/client'
// Import our global CSS styles
import './index.css'
// Import our main App component
import App from './App.tsx'

// Find the HTML element where our React app will be mounted
// This corresponds to <div id="root"></div> in index.html
const rootElement = document.getElementById('root');

// Safety check: make sure the root element exists in the HTML
if (!rootElement) {
  throw new Error('Root element not found');
}

// Try to render the React application
try {
  // Create a React root and render our app inside it
  createRoot(rootElement).render(
    // StrictMode helps identify potential problems in the application during development
    // It doesn't affect the production build but provides helpful warnings
    <StrictMode>
      {/* Render our main App component */}
      <App />
    </StrictMode>,
  );
} catch (error) {
  // If rendering fails for any reason, log the error and show a fallback message
  console.error('Failed to render app:', error);

  // Display a simple HTML error message directly in the root element
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>CO₂ Emissions Calculator</h1>
      <p>Loading failed. Please check the console for errors.</p>
      <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
  `;
}
