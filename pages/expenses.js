import { useEffect, useState } from 'react';

const today = () => new Date().toISOString().split('T')[0];
const CATS = ['Delivery & Freight', 'Packaging Material', 'Advertising & Marketing', 'Labour/Wages', 'Storage/Warehousing', 'Bank & Platform Charges', 'Miscellaneous'];

export default function Expenses() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ date: today(), payee: '', description: '', category: '', amount: '', payment: 'UPI' });

  useEffect(() => { fetch('/api/expenses').then(r => r.json()).then(d => { setRows(d); setLoading(false); }); }, []);

  const handleSubmit = async () => {
    if (!form.payee || !form.amount) return alert('Fill required fields');
    setSaving(true);
    const res = await fetch('/api/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) {
      const updated = await fetch('/api/expenses').then(r => r.json());
      setRows(updated);
      setForm({ date: today(), payee: '', description: '', category: '', amount: '', payment: 'UPI' });
      setShowForm(false);
    }
    setSaving(false);
  };

  const total = rows.reduce((s, r) => s + parseFloat(String(r.amount).replace(/[^0-9.]/g, '') || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Georgia,serif' }}>Expenses Register</h1>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Total: <span style={{ color: '#f87171', fontWeight: 600 }}>₹{total.toFixed(2)}</span></p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Expense</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#16c4ab' }}>New Expense</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div><label>Date</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div><label>Payee *</label><input value={form.payee} onChange={e => setForm(f => ({ ...f, payee: e.target.value }))} placeholder="Vendor / Person" /></div>
            <div><label>Description</label><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief note" /></div>
            <div><label>Category</label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}><option value="">Select</option>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label>Amount (₹) *</label><input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" /></div>
            <div><label>Payment Mode</label><select value={form.payment} onChange={e => setForm(f => ({ ...f, payment: e.target.value }))}><option>UPI</option><option>Cash</option><option>Bank Transfer</option></select></div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
            <button className="btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save Expense'}</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading...</div> : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>#</th><th>Date</th><th>Payee</th><th>Description</th><th>Category</th><th>Amount</th><th>Payment</th></tr></thead>
            <tbody>
              {[...rows].reverse().map((r, i) => (
                <tr key={i}>
                  <td>{r.id}</td><td>{r.date}</td><td>{r.payee}</td><td>{r.description}</td>
                  <td><span className="badge badge-blue">{r.category}</span></td>
                  <td style={{ color: '#f87171', fontWeight: 600 }}>₹{r.amount}</td>
                  <td><span className="badge badge-green">{r.payment}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
