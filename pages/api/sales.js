import { readSheet, appendRow } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rows = await readSheet('Sales Register', 'A4:K1000');
      const data = rows
        .filter(r => r[1] && r[2])
        .map(r => ({
          id: r[0], date: r[1], customer: r[2], phone: r[3],
          goods: r[4], qty: r[5], revenue: r[6],
          avgCost: r[7], cogs: r[8], apartment: r[9], payment: r[10],
        }));

      const totalsRow = rows.find(r => r[5] && !r[2]);
      const totals = totalsRow ? { qty: totalsRow[5], revenue: totalsRow[6] } : null;

      res.json({ data, totals });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'POST') {
    try {
      const { date, customer, phone, goods, qty, revenue, apartment, payment } = req.body;
      const formatted = new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
      await appendRow('Sales Register', [
        '',         // A — #
        formatted,  // B — Date
        customer,   // C — Customer Name
        phone,      // D — Phone/Contact
        goods,      // E — Goods Name
        qty,        // F — Qty Sold
        revenue,    // G — Revenue (₹)
        '',         // H — Avg Buy Cost (formula)
        '',         // I — COGS (formula)
        apartment,  // J — Apartment
        payment,    // K — Payment
      ]);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
}
