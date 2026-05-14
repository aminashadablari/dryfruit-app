import { readSheet, updateCell, appendRow } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rows = await readSheet('Selling Price Master', 'B4:D70');
      const data = rows.filter(r => r[0]).map((r, i) => ({
        goods: r[0], unit: r[1], price: r[2], rowIndex: i + 4,
      }));
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'PUT') {
    try {
      const { rowIndex, price } = req.body;
      await updateCell('Selling Price Master', `D${rowIndex}`, [[price]]);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'POST') {
    try {
      const { goods, unit, price } = req.body;
      await appendRow('Selling Price Master', ['', goods, unit, price]);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
}
