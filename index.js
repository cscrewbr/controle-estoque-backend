const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const credentials = require("./credenciais.json");

const app = express();
app.use(cors());
app.use(express.json());

const spreadsheetId = "11V2k5txES6TyP-fw5yCVjrbxySCmkV86g5cQmT7jQEc";

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}

app.post("/entrada", async (req, res) => {
  try {
    const sheets = await getSheetsClient();
    const valores = [
      [
        req.body.produto,
        req.body.quantidade,
        req.body.valor,
        req.body.fornecedor,
        req.body.data,
        req.body.observacao,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Entrada!A1",
      valueInputOption: "USER_ENTERED",
      resource: { values: valores },
    });

    res.status(200).send("Entrada registrada");
  } catch (error) {
    console.error("Erro ao registrar entrada:", error);
    res.status(500).send("Erro ao registrar entrada");
  }
});

app.post("/saida", async (req, res) => {
  try {
    const sheets = await getSheetsClient();
    const valores = [
      [
        req.body.produto,
        req.body.quantidade,
        req.body.destino,
        req.body.responsavel,
        req.body.data,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Saída!A1",
      valueInputOption: "USER_ENTERED",
      resource: { values: valores },
    });

    res.status(200).send("Saída registrada");
  } catch (error) {
    console.error("Erro ao registrar saída:", error);
    res.status(500).send("Erro ao registrar saída");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
