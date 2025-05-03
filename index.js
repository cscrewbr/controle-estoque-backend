const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
app.use(cors());
app.use(express.json());

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const planilhaId = '11V2k5txES6TyP-fw5yCVjrbxySCmkV86g5cQmT7jQEc';

app.post('/entrada', async (req, res) => {
  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
  const { produto, quantidade, valor, fornecedor, data, observacao } = req.body;

  await sheets.spreadsheets.values.append({
    spreadsheetId: planilhaId,
    range: 'Entrada!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[produto, quantidade, valor, fornecedor, data, observacao]],
    },
  });

  res.send({ status: 'ok' });
});

app.post('/saida', async (req, res) => {
  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
  const { produto, quantidade, destino, responsavel, data } = req.body;

  await sheets.spreadsheets.values.append({
    spreadsheetId: planilhaId,
    range: 'Saída!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[produto, quantidade, destino, responsavel, data]],
    },
  });

  res.send({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('API Estoque Online - OK');
});

app.listen(3000, () => console.log('API rodando na porta 3000'));
