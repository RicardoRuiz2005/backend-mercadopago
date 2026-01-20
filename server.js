const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN CON EL TOKEN DE TU CLIENTA
const client = new MercadoPagoConfig({ 
  accessToken: process.env.ACCESS_TOKEN
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
      // TU COMISIÓN DEL 15%
      marketplace_fee: Number(precio) * 0.15, 
      
      back_urls: {
        success: "https://www.google.com", 
        failure: "https://www.google.com",
        pending: "https://www.google.com"
      },
      auto_return: "approved",
      binary_mode: true // Evita estados pendientes; o aprueba o rechaza.
    };

    const response = await preference.create({ body });
    res.json({ init_point: response.init_point });

  } catch (error) {
    // Si hay un error aquí, aparecerá en tu terminal de VS Code
    console.error("ERROR DETALLADO:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor activo en puerto ${PORT}`);
});