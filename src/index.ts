import express, { Request, Response } from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

// Códigos de reparación por sistema
const SYSTEM_CODES: Record<string, string> = {
  navigation: "NAV-01",
  communications: "COM-02",
  life_support: "LIFE-03",
  engines: "ENG-04",
  deflector_shield: "SHLD-05"
};
const SYSTEM_KEYS = Object.keys(SYSTEM_CODES);

// Variable en memoria para el último sistema dañado
let lastDamagedSystem: string | null = null;

// GET /status
app.get("/status", (req: Request, res: Response) => {
  lastDamagedSystem = SYSTEM_KEYS[Math.floor(Math.random() * SYSTEM_KEYS.length)];
  return res.json({ damaged_system: lastDamagedSystem });
});

// GET /repair-bay
app.get("/repair-bay", (req: Request, res: Response) => {
  if (!lastDamagedSystem || !SYSTEM_CODES[lastDamagedSystem]) {
    return res.status(400).send("Error: no damaged system registered. Call /status first.");
  }
  const code = SYSTEM_CODES[lastDamagedSystem];
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Repair</title>
</head>
<body>
  <div class="anchor-point">${code}</div>
</body>
</html>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(html);
});

// POST /teapot -> 418
app.post("/teapot", (req: Request, res: Response) => {
  return res.status(418).send("I'm a teapot");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

export default app;
