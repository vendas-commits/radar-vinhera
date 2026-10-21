// Radar Vinhera / VinhoBR. Base de importadoras compartilhada.
// Preserva compatibilidade com os arquivos JSON existentes no volume Railway /data.
import { join } from "node:path";
import { mkdir } from "node:fs/promises";
const DATA_DIR = process.env.DATA_DIR || "/data";
const keys = ["catalog", "costs", "offers"] as const;
type Dataset = typeof keys[number];
const headers = { "cache-control": "no-store" };
async function read(k: Dataset): Promise<Record<string, string>[]> {
  try {
    const value = await Bun.file(join(DATA_DIR, k + ".json")).json();
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}
async function lastUpdated() {
  try { return await Bun.file(join(DATA_DIR, "updated.txt")).text(); }
  catch { return "Não informado"; }
}
const page = Bun.file(new URL("./public/index.html", import.meta.url));
Bun.serve({
  port: Number(process.env.PORT || 3000),
  async fetch(req) {
    const path = new URL(req.url).pathname;
    if (path === "/health") return new Response("ok");
    if (path === "/api/data" && req.method === "GET") {
      const [catalog, costs, offers, updated] = await Promise.all([
        read("catalog"), read("costs"), read("offers"), lastUpdated()
      ]);
      return Response.json({ catalog, costs, offers, updated }, { headers });
    }
    if (path.startsWith("/api/data/") && req.method === "POST") {
      const k = path.slice("/api/data/".length);
      if (!keys.includes(k as Dataset)) return new Response("Base inválida", { status: 400 });
      try {
        const rows = await req.json();
        if (!Array.isArray(rows) || rows.length > 20000 || rows.some(x => !x || typeof x !== "object" || Array.isArray(x)))
          return new Response("CSV inválido", { status: 400 });
        await mkdir(DATA_DIR, { recursive: true });
        await Bun.write(join(DATA_DIR, k + ".json"), JSON.stringify(rows));
        await Bun.write(join(DATA_DIR, "updated.txt"), new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));
        return Response.json({ ok: true, count: rows.length });
      } catch (e) { return new Response("Falha ao salvar: " + String(e), { status: 500 }); }
    }
    if (path === "/" || path === "/index.html") return new Response(page, { headers: { ...headers, "content-type": "text/html; charset=utf-8" } });
    return new Response("Não encontrado", { status: 404 });
  }
});
