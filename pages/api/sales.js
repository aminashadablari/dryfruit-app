import { readSheet, appendRow } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rows = await readSheet('Sales Register', 'A4:K1000');
      const data = rows
        .filter(r => r[0])
        .map(r => ({
          id: r[0], date: r[1], customer: r[2], phone: r[3],
          goods: r[4], qty: r[5], revenue: r[6],
          avgCost: r[7], cogs: r[8], apartment: r[9], payment: r[10],
        }));
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'POST') {
    try {
      const { date, customer, phone, goods, qty, revenue, apartment, payment } = req.body;
      await appendRow('Sales Register', [
        '',         // A — # (serial, leave blank)
        date,       // B — Date
        customer,   // C — Customer Name
        phone,      // D — Phone/Contact
        goods,      // E — Goods Name
        qty,        // F — Qty Sold
        revenue,    // G — Revenue (₹)
        '',         // H — Avg Buy Cost (AVERAGEIF formula, don't touch)
        '',         // I — COGS (formula, don't touch)
        apartment,  // J — Apartment
        payment,    // K — Payment
      ]);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
}
