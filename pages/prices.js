import { useEffect, useState } from 'react';

export default function Prices() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetch('/api/prices').then(r => r.json()).then(d => { setRows(d); setLoading(false); }); }, []);

  const filtered = rows.filter(r => r.goods?.toLowerCase().includes(search.toLowerCase()));
  const grouped = filtered.reduce((acc, r) => {
    if (!acc[r.goods]) acc[r.goods] = [];
    acc[r.goods].push(r);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Georgia,serif' }}>Selling Price Master</h1>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Read-only view — edit prices directly in Google Sheets</p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search goods..." style={{ maxWidth: 300 }} />
      </div>

      {loading ? <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {Object.entries(grouped).map(([goods, items]) => (
            <div key={goods} className="card">
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '0.75rem', fontFamily: 'Georgia,serif' }}>{goods}</div>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: i < items.length - 1 ? '1px solid #1e3a5f' : 'none' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{item.unit} kg</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16c4ab' }}>₹{item.price}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: '#1a2f4e', borderRadius: 8, border: '1px solid #1e3a5f', fontSize: '0.75rem', color: '#64748b' }}>
        💡 To update prices, open your Google Sheet → Selling Price Master → edit Column D. Changes reflect here automatically.
      </div>
    </div>
  );
}
