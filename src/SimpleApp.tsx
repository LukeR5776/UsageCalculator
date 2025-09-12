import React, { useState } from 'react';

interface Usage {
  electricity: number;
  gas: number;
  water: number;
}

interface Emissions {
  electricity: number;
  gas: number;
  water: number;
  total: number;
}

const EMISSION_FACTORS = {
  electricity: 0.92, // lbs CO2 per kWh
  gas: 11.7,        // lbs CO2 per therm
  water: 0.0044     // lbs CO2 per gallon
};

export default function SimpleApp() {
  const [step, setStep] = useState<'location' | 'usage' | 'results'>('location');
  const [zipCode, setZipCode] = useState('');
  const [usage, setUsage] = useState<Usage>({ electricity: 0, gas: 0, water: 0 });
  const [emissions, setEmissions] = useState<Emissions | null>(null);

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.length === 5 && /^\d{5}$/.test(zipCode)) {
      setStep('usage');
    } else {
      alert('Please enter a valid 5-digit ZIP code');
    }
  };

  const calculateEmissions = () => {
    const electricityEmissions = usage.electricity * EMISSION_FACTORS.electricity;
    const gasEmissions = usage.gas * EMISSION_FACTORS.gas;
    const waterEmissions = usage.water * EMISSION_FACTORS.water;
    const total = electricityEmissions + gasEmissions + waterEmissions;

    setEmissions({
      electricity: electricityEmissions,
      gas: gasEmissions,
      water: waterEmissions,
      total
    });
    setStep('results');
  };

  const reset = () => {
    setStep('location');
    setZipCode('');
    setUsage({ electricity: 0, gas: 0, water: 0 });
    setEmissions(null);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4, #dbeafe, #e0e7ff)',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '30px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '10px'
    },
    subtitle: {
      color: '#6b7280'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '16px',
      marginBottom: '10px'
    },
    button: {
      background: '#16a34a',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      width: '100%'
    },
    grid: {
      display: 'grid',
      gap: '20px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    },
    resultTotal: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#16a34a',
      textAlign: 'center' as const,
      margin: '20px 0'
    },
    breakdown: {
      marginTop: '30px'
    },
    breakdownItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      background: '#f8fafc',
      borderRadius: '8px',
      marginBottom: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🌍</div>
          <h1 style={styles.title}>CO₂ Emissions Calculator</h1>
          <p style={styles.subtitle}>Calculate your environmental impact from utilities</p>
        </div>

        {step === 'location' && (
          <form onSubmit={handleZipSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                ZIP Code
              </label>
              <input
                style={styles.input}
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="12345"
                maxLength={5}
              />
            </div>
            <button type="submit" style={styles.button}>
              Continue
            </button>
          </form>
        )}

        {step === 'usage' && (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Enter Your Monthly Usage</h2>
            
            <div style={styles.grid}>
              <div>
                <h3 style={{ color: '#16a34a', marginBottom: '15px' }}>⚡ Electricity</h3>
                <label style={{ display: 'block', marginBottom: '8px' }}>Usage (kWh)</label>
                <input
                  style={styles.input}
                  type="number"
                  value={usage.electricity || ''}
                  onChange={(e) => setUsage({...usage, electricity: parseFloat(e.target.value) || 0})}
                  placeholder="800"
                />
              </div>
              
              <div>
                <h3 style={{ color: '#f97316', marginBottom: '15px' }}>🔥 Natural Gas</h3>
                <label style={{ display: 'block', marginBottom: '8px' }}>Usage (therms)</label>
                <input
                  style={styles.input}
                  type="number"
                  value={usage.gas || ''}
                  onChange={(e) => setUsage({...usage, gas: parseFloat(e.target.value) || 0})}
                  placeholder="50"
                />
              </div>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>💧 Water</h3>
              <label style={{ display: 'block', marginBottom: '8px' }}>Usage (gallons)</label>
              <input
                style={styles.input}
                type="number"
                value={usage.water || ''}
                onChange={(e) => setUsage({...usage, water: parseFloat(e.target.value) || 0})}
                placeholder="7000"
              />
            </div>
            
            <button
              style={{ ...styles.button, marginTop: '30px' }}
              onClick={calculateEmissions}
            >
              Calculate Emissions
            </button>
          </div>
        )}

        {step === 'results' && emissions && (
          <div>
            <h2 style={{ textAlign: 'center' }}>Your Carbon Footprint</h2>
            <div style={styles.resultTotal}>
              {emissions.total.toFixed(1)} lbs CO₂
            </div>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Monthly emissions from utilities</p>
            
            <div style={styles.breakdown}>
              <div style={styles.breakdownItem}>
                <div>
                  <strong>⚡ Electricity</strong>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>
                    {emissions.total > 0 ? ((emissions.electricity / emissions.total) * 100).toFixed(1) : 0}% of total
                  </div>
                </div>
                <div style={{ fontWeight: 'bold' }}>{emissions.electricity.toFixed(1)} lbs</div>
              </div>
              
              <div style={styles.breakdownItem}>
                <div>
                  <strong>🔥 Natural Gas</strong>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>
                    {emissions.total > 0 ? ((emissions.gas / emissions.total) * 100).toFixed(1) : 0}% of total
                  </div>
                </div>
                <div style={{ fontWeight: 'bold' }}>{emissions.gas.toFixed(1)} lbs</div>
              </div>
              
              <div style={styles.breakdownItem}>
                <div>
                  <strong>💧 Water</strong>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>
                    {emissions.total > 0 ? ((emissions.water / emissions.total) * 100).toFixed(1) : 0}% of total
                  </div>
                </div>
                <div style={{ fontWeight: 'bold' }}>{emissions.water.toFixed(1)} lbs</div>
              </div>
            </div>
            
            <button
              style={{ ...styles.button, marginTop: '30px' }}
              onClick={reset}
            >
              Calculate Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}