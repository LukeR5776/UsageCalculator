import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SimpleApp from './SimpleApp.tsx'

// Simple styles
const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h1>Error: Root element not found</h1>
      <p>The application could not start because the root element is missing.</p>
    </div>
  `;
} else {
  try {
    console.log('Starting Simple CO₂ Calculator...');
    createRoot(rootElement).render(
      <StrictMode>
        <SimpleApp />
      </StrictMode>,
    );
    console.log('Simple app rendered successfully!');
  } catch (error) {
    console.error('Failed to render simple app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">CO₂ Emissions Calculator</h1>
        <p>The application encountered an error while loading.</p>
        <details style="margin-top: 20px;">
          <summary>Error Details</summary>
          <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px; margin-top: 10px;">${error}</pre>
        </details>
        <p style="margin-top: 20px;">
          <a href="standalone.html" style="color: #16a34a;">Try the standalone version</a>
        </p>
      </div>
    `;
  }
}