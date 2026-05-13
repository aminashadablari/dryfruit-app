import { readSheet } from '../../lib/sheets';

export default async function handler(req, res) {
  try {
    const rows = await readSheet('Dashboard', 'B5:G5');
    const row = rows[0] || [];
    res.json({
      revenue: row[0] || '0',
      cogs: row[1] || '0',
      grossProfit: row[2] || '0',
      opex: row[3] || '0',
      netProfit: row[4] || '0',
      netMargin: row[5] || '0',
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
