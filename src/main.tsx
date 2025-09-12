import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SimpleApp from './SimpleApp.tsx'

// Simple error boundary component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '600px',
      margin: '50px auto',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#dc2626', marginBottom: '15px' }}>⚠️ CO₂ Emissions Calculator</h1>
      <p style={{ marginBottom: '15px' }}>The application encountered an error while loading.</p>
      <details>
        <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>Error Details</summary>
        <pre style={{
          background: '#f3f4f6',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto'
        }}>{error.message}</pre>
      </details>
      <p style={{ marginTop: '20px' }}>
        <a href="standalone.html" style={{ color: '#16a34a', textDecoration: 'underline' }}>
          Try the standalone version →
        </a>
      </p>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif; margin-top: 50px;">
      <h1 style="color: #dc2626;">Error: Root element not found</h1>
      <p>The application could not start.</p>
      <a href="standalone.html" style="color: #16a34a;">Try the standalone version</a>
    </div>
  `;
} else {
  try {
    console.log('Initializing CO₂ Emissions Calculator...');
    
    createRoot(rootElement).render(
      <StrictMode>
        <SimpleApp />
      </StrictMode>
    );
    
    console.log('✅ Application loaded successfully!');
  } catch (error) {
    console.error('❌ Failed to render app:', error);
    
    createRoot(rootElement).render(
      <ErrorFallback error={error as Error} />
    );
  }
}
