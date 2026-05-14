import { useEffect, useState } from 'react';

export default function Prices() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ goods: '', unit: '', price: '' });
  const [addingSaving, setAddingSaving] = useState(false);

  const loadPrices = () => {
    setLoading(true);
    fetch('/api/prices').then(r => r.json()).then(d => { setRows(d); setLoading(false); });
  };

  useEffect(() => { loadPrices(); }, []);

  const handleEdit = (row) => {
    setEditingRow(row.rowIndex);
    setEditPrice(String(row.price).replace(/[^0-9.]/g, ''));
  };

  const handleSave = async (rowIndex) => {
    setSaving(true);
    const res = await fetch('/api/prices', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rowIndex, price: editPrice }),
    });
    if (res.ok) { setEditingRow(null); loadPrices(); }
    else alert('Failed to save. Try again.');
    setSaving(false);
  };

  const handleAddItem = async () => {
    if (!newItem.goods || !newItem.unit || !newItem.price) return alert('Fill all fields');
    setAddingSaving(true);
    const res = await fetch('/api/prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      setNewItem({ goods: '', unit: '', price: '' });
      setShowAddForm(false);
      loadPrices();
    } else alert('Failed to add. Try again.');
    setAddingSaving(false);
  };

  const filtered = rows.filter(r => r.goods?.toLowerCase().includes(search.toLowerCase()));
  const grouped = filtered.reduce((acc, r) => {
    if (!acc[r.goods]) acc[r.goods] = [];
    acc[r.goods].push(r);
    return acc;
  }, {});

  const goodsOptions = [...new Set(rows.map(r => r.goods))];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Georgia,serif' }}>Selling Price Master</h1>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Click ✏️ to edit any price — updates Google Sheet instantly</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>+ Add Item / Pack Size</button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#16c4ab' }}>Add New Item or Pack Size</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label>Goods Name *</label>
              <input
                list="goods-list"
                value={newItem.goods}
                onChange={e => setNewItem(n => ({ ...n, goods: e.target.value }))}
                placeholder="New or existing item"
              />
              <datalist id="goods-list">
                {goodsOptions.map(g => <option key={g} value={g} />)}
              </datalist>
            </div>
            <div>
              <label>Pack Size (kg) *</label>
              <input
                type="number"
                value={newItem.unit}
                onChange={e => setNewItem(n => ({ ...n, unit: e.target.value }))}
                placeholder="e.g. 0.25, 0.5, 1, 2"
                step="0.25"
              />
            </div>
            <div>
              <label>Selling Price (₹) *</label>
              <input
                type="number"
                value={newItem.price}
                onChange={e => setNewItem(n => ({ ...n, price: e.target.value }))}
                placeholder="e.g. 500"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
            <button className="btn-primary" onClick={handleAddItem} disabled={addingSaving}>
              {addingSaving ? 'Saving...' : 'Save Item'}
            </button>
            <button className="btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search goods..." style={{ maxWidth: 300 }} />
      </div>

      {loading ? <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {Object.entries(grouped).map(([goods, items]) => (
            <div key={goods} className="card">
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '0.75rem', fontFamily: 'Georgia,serif' }}>
                {goods}
              </div>
              {items.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.5rem 0', borderBottom: i < items.length - 1 ? '1px solid #1e3a5f' : 'none'
                }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{item.unit} kg</span>
                  {editingRow === item.rowIndex ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>₹</span>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        style={{ width: 80, padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                        autoFocus
                      />
                      <button onClick={() => handleSave(item.rowIndex)} disabled={saving}
                        style={{ background: '#0e7c6a', border: 'none', borderRadius: 6, color: 'white', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                        {saving ? '...' : '✓'}
                      </button>
                      <button onClick={() => setEditingRow(null)}
                        style={{ background: '#1e3a5f', border: 'none', borderRadius: 6, color: '#94a3b8', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16c4ab' }}>₹{String(item.price).replace(/[^0-9.]/g, '')}</span>
                      <button onClick={() => handleEdit(item)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#64748b', padding: '2px 4px' }}
                        title="Edit price">✏️</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: '#1a2f4e', borderRadius: 8, border: '1px solid #1e3a5f', fontSize: '0.75rem', color: '#64748b' }}>
        ⚠️ Updating a price here changes it for all future sales. Past sales already recorded are not affected.
      </div>
    </div>
  );
}
