import { readSheet } from '../../lib/sheets';

export default async function handler(req, res) {
  try {
    const rows = await readSheet('Selling Price Master', 'B4:D70');
    const data = rows.filter(r => r[0]).map(r => ({
      goods: r[0], unit: r[1], price: r[2],
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
}
