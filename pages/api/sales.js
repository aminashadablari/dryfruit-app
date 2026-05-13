import { readSheet, appendRow } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rows = await readSheet('Sales Register', 'A4:K6');
      const data = rows
        .filter(r => r[0])
        .map(r => ({
          id: r[0], date: r[1], customer: r[2], phone: r[3],
          goods: r[4], qty: r[5], revenue: r[6], apartment: r[7],
          avgCost: r[8], cogs: r[9], payment: r[10],
        }));
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'POST') {
    try {
      const { date, customer, phone, goods, qty, revenue, apartment, payment } = req.body;
      await appendRow('Sales Register', [
        '', date, customer, phone, goods, qty, revenue, apartment, '', '', payment
      ]);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
}
