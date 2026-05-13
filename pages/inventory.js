import { useEffect, useState } from 'react';

export default function Inventory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/inventory').then(r => r.json()).then(d => { setRows(d); setLoading(false); }); }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Georgia,serif' }}>Inventory Balance</h1>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Live stock levels from your Google Sheet</p>
      </div>

      {loading ? <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading...</div> : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Goods Name</th><th>Qty Purchased</th><th>Qty Sold</th>
                <th>Balance Qty</th><th>Purchase Cost</th><th>COGS</th><th>Inventory Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const balance = parseFloat(String(r.balanceQty).replace(/[^0-9.]/g, '') || 0);
                const low = balance < 0.5;
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.goods}</td>
                    <td>{r.qtyPurchased}</td>
                    <td>{r.qtySold}</td>
                    <td><span className={`badge ${low ? 'badge-red' : 'badge-green'}`}>{r.balanceQty} kg</span></td>
                    <td>₹{r.purchaseCost}</td>
                    <td style={{ color: '#f59e0b' }}>₹{r.cogs}</td>
                    <td style={{ color: '#16c4ab', fontWeight: 600 }}>₹{r.inventoryValue}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#1a2f4e', borderRadius: 8, border: '1px solid #1e3a5f', fontSize: '0.75rem', color: '#64748b' }}>
        🔴 Red badge = stock below 0.5 kg — consider restocking
      </div>
    </div>
  );
}
