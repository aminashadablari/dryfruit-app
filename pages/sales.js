import { useEffect, useState } from 'react';

const today = () => new Date().toISOString().split('T')[0];

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [totals, setTotals] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: today(), customer: '', phone: '', goods: '',
    qty: '', revenue: '', apartment: '', payment: 'UPI'
  });

  const loadSales = () => {
    fetch('/api/sales')
      .then(r => r.json())
      .then(({ data, totals }) => {
        setSales(data);
        setTotals(totals);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadSales();
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
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ date: today(), customer: '', phone: '', goods: '', qty: '', revenue: '', apartment: '', payment: 'UPI' });
      setShowForm(false);
      loadSales();
    } else {
      alert('Failed to save. Try again.');
    }
    setSaving(false);
  };

  const sortedSales = [...sales].sort((a, b) => new Date(a.date) - new Date(b.date));

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

      {loading ? (
        <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
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
                  <td>{i + 1}</td>
                  <td>{s.date}</td>
                  <td>{s.customer}<br /><span style={{ fontSize: '0.7rem', color: '#64748b' }}>{s.phone}</span></td>
                  <td>{s.goods}</td>
                  <td>{s.qty} kg</td>
                  <td style={{ color: '#16c4ab', fontWeight: 600 }}>{s.revenue}</td>
                  <td>{s.apartment}</td>
                  <td><span className="badge badge-blue">{s.payment}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          {totals && (
            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: '2rem',
              padding: '0.75rem 1.25rem', marginTop: '0.5rem',
              borderTop: '2px solid #16c4ab',
              background: '#0f2137', borderRadius: '0 0 8px 8px'
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: 2 }}>TOTAL QTY</div>
                <div style={{ fontWeight: 700, color: '#e2e8f0' }}>{totals.qty} kg</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: 2 }}>TOTAL REVENUE</div>
                <div style={{ fontWeight: 700, color: '#16c4ab', fontSize: '1rem' }}>₹{totals.revenue}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
