import { readSheet } from '../../lib/sheets';

export default async function handler(req, res) {
  try {
    const rows = await readSheet('Dashboard', 'B27:H40');
    const data = rows.filter(r => r[0]).map(r => ({
      goods: r[0], qtyPurchased: r[1], qtySold: r[2],
      balanceQty: r[3], purchaseCost: r[4], cogs: r[5], inventoryValue: r[6],
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
}
