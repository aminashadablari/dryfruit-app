import { readSheet, appendRow } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rows = await readSheet('Inwards Register', 'A4:K30');
      const data = rows.filter(r => r[0]).map(r => ({
        id: r[0], date: r[1], supplier: r[2], goods: r[3],
        category: r[4], unit: r[5], qty: r[6], unitCost: r[7],
        gst: r[8], totalCost: r[10],
      }));
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'POST') {
    try {
      const { date, supplier, goods, category, unit, qty, unitCost, gst } = req.body;
      const total = parseFloat(qty) * parseFloat(unitCost);
      await appendRow('Inwards Register', [
        '', date, supplier, goods, category, unit, qty, unitCost, gst || 0, '', total
      ]);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
}
