const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago"); // destructurado correcto

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa el cliente correctamente
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-7308570929682511-011700-662fffa5cdcb0e4daa863921b08f8167-3140992182'
});

app.post("/crear-pago", async (req, res) => {
  const { precio, obra } = req.body;

  try {
    const preference = new Preference(client);

    const body = {
      items: [
        {
          title: obra,
          unit_price: Number(precio),
          quantity: 1,
          currency_id: "MXN"
        }
      ],
      marketplace_fee: Number(precio) * 0.15,
      back_urls: {
        success: "https://www.google.com",
        failure: "https://www.google.com",
        pending: "https://www.google.com"
      },
      auto_return: "approved",
      binary_mode: true
    };

    const response = await preference.create({ body });
    res.json({ init_point: response.init_point });

  } catch (error) {
    console.error("ERROR DETALLADO:", error);
    res.status(500).json({ error: "Error creando preferencia" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Servidor sandbox activo en puerto ${PORT}`));
