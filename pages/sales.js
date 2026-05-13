import { useEffect, useState } from 'react';

const today = () => new Date().toISOString().split('T')[0];

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ date: today(), customer: '', phone: '', goods: '', qty: '', revenue: '', apartment: '', payment: 'UPI' });

  useEffect(() => {
    // FIX: fetch independently so a prices failure doesn't block sales from showing
    fetch('/api/sales')
      .then(r => r.json())
      .then(s => { setSales(s); setLoading(false); })
      .catch(() => setLoading(false));

    fetch('/api/prices')
      .then(r => r.json())
      .then(p => setPrices(p))
      .catch(() => {});
  }, []);

  const goodsOptions = [...new Set(prices.map(p => p.goods))];

  const handleGoodsChange = (goods, qty) => {
    const match = prices.find(p => p.goods === goods && parseFloat(p.unit) === parseFloat(qty));
    const revenue = match ? match.price : '';
    setForm(f => ({ ...f, goods, qty: qty || f.qty, revenue }));
  };

  const handleSubmit = async () => {
    if (!form.customer || !form.goods || !form.qty) return alert('Please fill all required fields');
    setSaving(true);
    const res = await fetch('/api/sales', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) {
      const updated = await fetch('/api/sales').then(r => r.json());
      setSales(updated);
      setForm({ date: today(), customer: '', phone: '', goods: '', qty: '', revenue: '', apartment: '', payment: 'UPI' });
      setShowForm(false);
    }
    setSaving(false);
  };

  // FIX: sort A→Z by customer name instead of reverse()
  const sortedSales = [...sales].sort((a, b) =>
    (a.customer || '').trim().localeCompare((b.customer || '').trim())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Georgia,serif' }}>Sales Register</h1>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{sales.length} transactions</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Sale</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#16c4ab' }}>New Sale</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div><label>Date *</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div><label>Customer Name *</label><input value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} placeholder="Name" /></div>
            <div><label>Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91..." /></div>
            <div><label>Apartment</label><input value={form.apartment} onChange={e => setForm(f => ({ ...f, apartment: e.target.value }))} placeholder="Block / Flat" /></div>
            <div>
              <label>Goods Name *</label>
              <select value={form.goods} onChange={e => handleGoodsChange(e.target.value, form.qty)}>
                <option value="">Select item</option>
                {goodsOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label>Qty (kg) *</label>
              <select value={form.qty} onChange={e => handleGoodsChange(form.goods, e.target.value)}>
                <option value="">Select qty</option>
                {prices.filter(p => p.goods === form.goods).map(p => (
                  <option key={p.unit} value={p.unit}>{p.unit} kg</option>
                ))}
              </select>
            </div>
            <div><label>Revenue (₹)</label><input value={form.revenue} onChange={e => setForm(f => ({ ...f, revenue: e.target.value }))} placeholder="Auto-filled" /></div>
            <div>
              <label>Payment Mode</label>
              <select value={form.payment} onChange={e => setForm(f => ({ ...f, payment: e.target.value }))}>
                <option>UPI</option><option>Cash</option><option>Bank Transfer</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
            <button className="btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save Sale'}</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading...</div> : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>#</th><th>Date</th><th>Customer</th><th>Goods</th>
                <th>Qty</th><th>Revenue</th><th>Apartment</th><th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {sortedSales.map((s, i) => (
                <tr key={i}>
                  <td>{i + 1}</td><td>{s.date}</td>
                  <td>{s.customer}<br /><span style={{ fontSize: '0.7rem', color: '#64748b' }}>{s.phone}</span></td>
                  <td>{s.goods}</td><td>{s.qty} kg</td>
                  <td style={{ color: '#16c4ab', fontWeight: 600 }}>{s.revenue}</td>
                  <td>{s.apartment}</td>
                  <td><span className="badge badge-blue">{s.payment}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
