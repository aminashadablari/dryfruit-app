  import { useEffect, useState } from 'react';

const fmt = v => {
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
  if (isNaN(n)) return v;
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  const metrics = data ? [
    { label: 'Total Revenue', value: fmt(data.revenue), color: '#16c4ab', icon: '💰' },
    { label: 'Cost of Goods Sold', value: fmt(data.cogs), color: '#f59e0b', icon: '📦' },
    { label: 'Gross Profit', value: fmt(data.grossProfit), color: '#60a5fa', icon: '📈' },
    { label: 'Operating Expenses', value: fmt(data.opex), color: '#f87171', icon: '💸' },
    { label: 'Net Profit', value: fmt(data.netProfit), color: '#4ade80', icon: '⭐' },
    { label: 'Net Profit Margin', value: data.netMargin, color: '#a78bfa', icon: '🎯' },
  ] : [];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Georgia,serif', color: '#e2e8f0' }}>
          Business Dashboard
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>Live data from Google Sheets</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>Loading metrics...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {metrics.map((m, i) => (
            <div key={i} className="metric-card" style={{ borderTop: `3px solid ${m.color}` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#1a2f4e', borderRadius: 12, border: '1px solid #1e3a5f' }}>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
          💡 All figures are pulled live from your Google Sheet. To update data, use the register screens or edit the sheet directly.
        </p>
      </div>
    </div>
  );
}
