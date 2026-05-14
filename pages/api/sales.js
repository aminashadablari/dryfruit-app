import { readSheet, appendRow, updateCell } from '../../lib/sheets';
import { getSheets, SHEET_ID } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rows = await readSheet('Sales Register', 'A4:K1000');
      const data = rows
        .filter(r => r[1] && r[2] && r[2].trim() !== '')
        .map((r, i) => ({
          rowIndex: i + 4, // actual sheet row number (starts at row 4)
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

      const [year, month, day] = date.split('-');
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const formatted = `${parseInt(day)}-${monthNames[parseInt(month)-1]}-${year.slice(2)}`;

      const existingRows = await readSheet('Sales Register', 'A4:A1000');
      const lastNum = existingRows.filter(r => r[0] && !isNaN(r[0])).length;
      const nextNum = lastNum + 1;

      await appendRow('Sales Register', [
        nextNum, formatted, customer, phone, goods, qty, revenue, '', '', apartment, payment
      ]);

      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'PUT') {
    try {
      const { rowIndex, date, customer, phone, goods, qty, revenue, apartment, payment } = req.body;

      const [year, month, day] = date.split('-');
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      // handle both date formats
      let formatted = date;
      if (date.includes('-') && date.length === 10) {
        formatted = `${parseInt(day)}-${monthNames[parseInt(month)-1]}-${year.slice(2)}`;
      }

      await updateCell('Sales Register', `B${rowIndex}:K${rowIndex}`, [[
        formatted, customer, phone, goods, qty, revenue, '', '', apartment, payment
      ]]);

      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'DELETE') {
    try {
      const { rowIndex } = req.body;
      const sheets = getSheets();

      // Get sheet ID for Sales Register tab
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
      const sheet = spreadsheet.data.sheets.find(s => s.properties.title === 'Sales Register');
      const sheetId = sheet.properties.sheetId;

      // Delete the row
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: rowIndex - 1, // 0-indexed
                endIndex: rowIndex        // exclusive
              }
            }
          }]
        }
      });

      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
}
