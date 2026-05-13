import { useEffect, useState } from 'react';

const today = () => new Date().toISOString().split('T')[0];
const REASONS = ['Damaged / Spoiled', 'Wrong Item Delivered', 'Quality Issue', 'Customer Changed Mind', 'Other'];

export default function Returns() {
  const [rows, setRows] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ returnDate: today(), saleDate: '', customer: '', phone: '', apartment: '', goods: '', qty: '', reason: '', refund: '', refundMode: 'UPI' });

  useEffect(() => {
    Promise.all([fetch('/api/returns').then(r => r.json()), fetch('/api/prices').then(r => r.json())])
      .then(([ret, p]) => { setRows(ret); setPrices(p); setLoading(false); });
  }, []);

  const goodsOptions = [...new Set(prices.map(p => p.goods))];
  const total = rows.reduce((s, r) => s + parseFloat(String(r.refund).replace(/[^0-9.]/g, '') || 0), 0);

  const handleSubmit = async () => {
    if (!form.customer || !form.goods) return alert('Fill required fields');
    setSaving(true);
    const res = await fetch('/api/returns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) {
      const updated = await fetch('/api/returns').then(r => r.json());
      setRows(updated);
      setForm({ returnDate: today(), saleDate: '', customer: '', phone: '', apartment: '', goods: '', qty: '', reason: '', refund: '', refundMode: 'UPI' });
      setShowForm(false);
    }
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Georgia,serif' }}>Returns Register</h1>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Refunds: <span style={{ color: '#f87171', fontWeight: 600 }}>₹{total.toFixed(2)}</span></p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Log Return</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#16c4ab' }}>New Return Entry</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div><label>Return Date</label><input type="date" value={form.returnDate} onChange={e => setForm(f => ({ ...f, returnDate: e.target.value }))} /></div>
            <div><label>Original Sale Date</label><input type="date" value={form.saleDate} onChange={e => setForm(f => ({ ...f, saleDate: e.target.value }))} /></div>
            <div><label>Customer Name *</label><input value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} placeholder="Name" /></div>
            <div><label>Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91..." /></div>
            <div><label>Apartment</label><input value={form.apartment} onChange={e => setForm(f => ({ ...f, apartment: e.target.value }))} placeholder="Block / Flat" /></div>
            <div><label>Goods Name *</label><select value={form.goods} onChange={e => setForm(f => ({ ...f, goods: e.target.value }))}><option value="">Select</option>{goodsOptions.map(g => <option key={g}>{g}</option>)}</select></div>
            <div><label>Qty Returned (kg)</label><input type="number" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} placeholder="0.25" /></div>
            <div><label>Return Reason</label><select value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}><option value="">Select</option>{REASONS.map(r => <option key={r}>{r}</option>)}</select></div>
            <div><label>Refund Amount (₹)</label><input type="number" value={form.refund} onChange={e => setForm(f => ({ ...f, refund: e.target.value }))} placeholder="0.00" /></div>
            <div><label>Refund Mode</label><select value={form.refundMode} onChange={e => setForm(f => ({ ...f, refundMode: e.target.value }))}><option>UPI</option><option>Cash</option><option>Adjusted in next order</option></select></div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
            <button className="btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save Return'}</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading...</div> : rows.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
          <p>No returns logged yet. Great sign!</p>
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>#</th><th>Return Date</th><th>Customer</th><th>Goods</th><th>Qty</th><th>Reason</th><th>Refund</th><th>Mode</th></tr></thead>
            <tbody>
              {[...rows].reverse().map((r, i) => (
                <tr key={i}>
                  <td>{r.id}</td><td>{r.returnDate}</td>
                  <td>{r.customer}<br /><span style={{ fontSize: '0.7rem', color: '#64748b' }}>{r.apartment}</span></td>
                  <td>{r.goods}</td><td>{r.qty} kg</td>
                  <td><span className="badge badge-red">{r.reason}</span></td>
                  <td style={{ color: '#f87171', fontWeight: 600 }}>₹{r.refund}</td>
                  <td><span className="badge badge-blue">{r.refundMode}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
