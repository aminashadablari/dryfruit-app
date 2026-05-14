import { readSheet, appendRow } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rows = await readSheet('Sales Register', 'A4:K1000');
      const data = rows
        .filter(r => r[1] && r[2] && r[2].trim() !== '')
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

      // Date format fix
      const [year, month, day] = date.split('-');
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const formatted = `${parseInt(day)}-${monthNames[parseInt(month)-1]}-${year.slice(2)}`;

      // Auto-increment # column
      const existingRows = await readSheet('Sales Register', 'A4:A1000');
      const lastNum = existingRows.filter(r => r[0] && !isNaN(r[0])).length;
      const nextNum = lastNum + 1;

      await appendRow('Sales Register', [
        nextNum,    // A — #
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
