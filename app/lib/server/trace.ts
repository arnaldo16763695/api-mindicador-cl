import fs from "fs";
import path from "path";
import type { TraceEntry } from "@/types/mindicador";

const LOG_DIR = path.join(process.cwd(), "server", "logs");
export const TRACE_FILE = path.join(LOG_DIR, "http_trace.json");

export async function logTrace(entry: TraceEntry): Promise<void> {
  try {
    await fs.promises.mkdir(LOG_DIR, { recursive: true });
    await fs.promises.appendFile(TRACE_FILE, JSON.stringify(entry) + "\n", "utf8");
  } catch {
    // ignorar errores 
  }
}

export async function sendWebhook(entry: TraceEntry): Promise<void> {
  const url = process.env.WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch {
    // ignorar errores 
  }
}
