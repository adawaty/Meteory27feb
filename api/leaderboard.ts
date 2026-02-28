import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return new Pool({ connectionString: url });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    res.setHeader("Cache-Control", "no-store");
    const pool = getPool();
    if (!pool) return res.status(503).json({ success: false, error: "Database not configured" });

    if (req.method === "GET") {
      const result = await pool.query(
        "SELECT id, name, score, created_at FROM leaderboard ORDER BY score DESC, created_at ASC LIMIT 50"
      );

      // Ensure the top seeded row is branded consistently
      const rows = result.rows.map((r: any) => {
        if (String(r.id) === "1") return { ...r, name: "MHDLABIB" };
        return r;
      });

      return res.status(200).json({ success: true, data: rows });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const name = (body?.name || "").toString().trim().slice(0, 40);
      const score = Number(body?.score);

      if (!name || !Number.isFinite(score)) {
        return res.status(400).json({ success: false, error: "name and score required" });
      }

      const safeScore = Math.max(0, Math.min(1_000_000, Math.floor(score)));

      const result = await pool.query(
        "INSERT INTO leaderboard (name, score) VALUES ($1,$2) RETURNING id, created_at",
        [name, safeScore]
      );

      return res.status(200).json({ success: true, data: result.rows[0] });
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ success: false, error: e?.message || "Server error" });
  }
}
