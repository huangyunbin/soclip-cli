import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export function getConfigPath(): string {
  return path.join(os.homedir(), ".soclip", "config.json");
}

export function getApiBase(): string {
  return process.env.SOCLIP_API_BASE || "https://api.soclip.dev";
}

export function getApiKey(): string | null {
  // 1. Environment variable has highest priority
  if (process.env.SOCLIP_API_KEY && process.env.SOCLIP_API_KEY.trim() !== "") {
    return process.env.SOCLIP_API_KEY.trim();
  }

  // 2. Fallback to ~/.soclip/config.json
  try {
    const configPath = getConfigPath();
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.apiKey === "string" && parsed.apiKey.trim() !== "") {
        return parsed.apiKey.trim();
      }
    }
  } catch {
    // Ignore read/parse errors
  }

  return null;
}

export function setApiKey(key: string): void {
  const configPath = getConfigPath();
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(configPath, JSON.stringify({ apiKey: key.trim() }, null, 2), "utf-8");
}
