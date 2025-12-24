const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');

const app = express();
app.use(cors());
app.use(express.json());

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY
});

app.post('/create-transaction', async (req, res) => {
  try {
    const param = {
      transaction_details: {
        order_id: req.body.order_id,
        gross_amount: req.body.gross_amount
      },
      customer_details: req.body.customer_details,
      item_details: req.body.item_details,
      credit_card: { secure: true }
    };

    const trx = await snap.createTransaction(param);
    res.json({ token: trx.token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Server running on', PORT));
