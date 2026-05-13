import { readSheet, appendRow } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rows = await readSheet('Expenses Register', 'A4:G30');
      const data = rows.filter(r => r[0]).map(r => ({
        id: r[0], date: r[1], payee: r[2], description: r[3],
        category: r[4], amount: r[5], payment: r[6],
      }));
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'POST') {
    try {
      const { date, payee, description, category, amount, payment } = req.body;
      await appendRow('Expenses Register', ['', date, payee, description, category, amount, payment]);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
}
