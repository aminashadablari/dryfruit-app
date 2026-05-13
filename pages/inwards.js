import { useEffect, useState } from 'react';

const today = () => new Date().toISOString().split('T')[0];

export default function Inwards() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ date: today(), supplier: '', goods: '', category: '', unit: 'Kg', qty: '', unitCost: '', gst: '0' });

  useEffect(() => { fetch('/api/inwards').then(r => r.json()).then(d => { setRows(d); setLoading(false); }); }, []);

  const handleSubmit = async () => {
    if (!form.goods || !form.qty || !form.unitCost) return alert('Fill all required fields');
    setSaving(true);
    const res = await fetch('/api/inwards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) {
      const updated = await fetch('/api/inwards').then(r => r.json());
      setRows(updated);
      setForm({ date: today(), supplier: '', goods: '', category: '', unit: 'Kg', qty: '', unitCost: '', gst: '0' });
      setShowForm(false);
    }
    setSaving(false);
  };

  const categories = ['Nuts', 'Dates', 'Figs', 'Apricot w Seed', 'Caschew', 'Grocery'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Georgia,serif' }}>Inwards Register</h1>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{rows.length} purchase entries</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Purchase</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#16c4ab' }}>New Purchase Entry</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div><label>Date *</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div><label>Supplier *</label><input value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} placeholder="Vendor name" /></div>
            <div><label>Goods Name *</label><input value={form.goods} onChange={e => setForm(f => ({ ...f, goods: e.target.value }))} placeholder="e.g. Walnut" /></div>
            <div>
              <label>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">Select</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label>Unit</label><select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}><option>Kg</option><option>g</option><option>Pcs</option></select></div>
            <div><label>Qty Purchased *</label><input type="number" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} placeholder="e.g. 5" /></div>
            <div><label>Unit Cost (₹) *</label><input type="number" value={form.unitCost} onChange={e => setForm(f => ({ ...f, unitCost: e.target.value }))} placeholder="per kg" /></div>
            <div><label>GST %</label><input type="number" value={form.gst} onChange={e => setForm(f => ({ ...f, gst: e.target.value }))} placeholder="0" /></div>
          </div>
          {form.qty && form.unitCost && (
            <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: '#0e7c6a20', borderRadius: 8, fontSize: '0.8rem' }}>
              Total Cost: <strong style={{ color: '#16c4ab' }}>₹{(parseFloat(form.qty) * parseFloat(form.unitCost)).toFixed(2)}</strong>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
            <button className="btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save Entry'}</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading...</div> : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>#</th><th>Date</th><th>Supplier</th><th>Goods</th><th>Category</th><th>Qty</th><th>Unit Cost</th><th>Total Cost</th></tr></thead>
            <tbody>
              {[...rows].reverse().map((r, i) => (
                <tr key={i}>
                  <td>{r.id}</td><td>{r.date}</td><td>{r.supplier}</td><td>{r.goods}</td>
                  <td><span className="badge badge-blue">{r.category}</span></td>
                  <td>{r.qty} {r.unit}</td>
                  <td>₹{r.unitCost}</td>
                  <td style={{ color: '#f59e0b', fontWeight: 600 }}>₹{r.totalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
