import { readSheet, appendRow } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rows = await readSheet('Returns Register', 'A4:K30');
      const data = rows.filter(r => r[1]).map(r => ({
        id: r[0], returnDate: r[1], saleDate: r[2], customer: r[3],
        phone: r[4], apartment: r[5], goods: r[6], qty: r[7],
        reason: r[8], refund: r[9], refundMode: r[10],
      }));
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'POST') {
    try {
      const { returnDate, saleDate, customer, phone, apartment, goods, qty, reason, refund, refundMode } = req.body;
      await appendRow('Returns Register', [
        '', returnDate, saleDate, customer, phone, apartment, goods, qty, reason, refund, refundMode
      ]);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
}
