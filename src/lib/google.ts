import { google } from 'googleapis';

export async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

export async function getSheetData() {
  const sheets = await getGoogleSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1', // Adjust as needed
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) return [];

  // Find column indices dynamically
  const headers = rows[0].map((h: string) => h.toLowerCase());

  let nameIndex = headers.findIndex(h => h.includes('name'));
  let tokenIndex = headers.findIndex(h => h.includes('token'));
  let statusIndex = headers.findIndex(h => h.includes('paid') || h.includes('status'));

  if (nameIndex === -1) nameIndex = 0;
  if (tokenIndex === -1) tokenIndex = 1;

  // Convert rows → JSON
  const data = rows.slice(1)
    .filter(row => row[nameIndex] && row[tokenIndex])
    .map(row => ({
      name: row[nameIndex],
      token: row[tokenIndex],
      status: statusIndex !== -1 ? row[statusIndex] : null, // <-- Add payment status
    }));

  return data;
}
