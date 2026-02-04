export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Eres un oráculo espiritual. Genera mensajes breves, místicos y positivos. Máximo dos frases. No menciones tecnología ni inteligencia artificial."
          }
        ],
        temperature: 0.9
      })
    });

    const data = await response.json();
    const mensaje = data.choices?.[0]?.message?.content;

    if (!mensaje) {
      throw new Error("Respuesta vacía del oráculo");
    }

    return res.status(200).json({ mensaje });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      mensaje: "El oráculo guarda silencio por ahora."
    });
  }
}
