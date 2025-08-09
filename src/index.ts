import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());
app.use(cookieParser());

const SYSTEM_CODES: Record<string, string> = {
  navigation: "NAV-01",
  communications: "COM-02",
  life_support: "LIFE-03",
  engines: "ENG-04",
  deflector_shield: "SHLD-05"
};
const SYSTEM_KEYS = Object.keys(SYSTEM_CODES);

// GET /status
app.get("/status", (req: Request, res: Response) => {
  // Si ya existe en cookies y es válido, lo devolvemos
  let damaged = req.cookies?.damaged_system;
  if (!damaged || !SYSTEM_CODES[damaged]) {
    damaged = SYSTEM_KEYS[Math.floor(Math.random() * SYSTEM_KEYS.length)];
    // cookie de corta duración (5 minutos -> el robot tiene 5 min)
    res.cookie("damaged_system", damaged, { maxAge: 5 * 60 * 1000, httpOnly: false });
  }
  return res.json({ damaged_system: damaged });
});

// GET /repair-bay
app.get("/repair-bay", (req: Request, res: Response) => {
  const damaged = req.cookies?.damaged_system as string | undefined;
  if (!damaged || !SYSTEM_CODES[damaged]) {
    return res.status(400).send("Error: no damaged system registered. Call /status first.");
  }
  const code = SYSTEM_CODES[damaged];
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

// arrancar local (en deploy serverless no hace falta)
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

export default app;
