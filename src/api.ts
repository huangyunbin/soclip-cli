import { getApiBase, getApiKey } from "./config";

export interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  credits_used?: number;
  credits_remaining?: number;
  credits?: number;
  data?: T;
}

export async function fetchMedia(url: string): Promise<{ status: number; data: ApiResponse }> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("Error: API key not configured.");
    console.error("Please set the SOCLIP_API_KEY environment variable or get a key at https://soclip.dev and run:");
    console.error("  soclip config set-key <your-api-key>");
    process.exit(1);
  }

  const baseUrl = getApiBase();
  try {
    const res = await fetch(`${baseUrl}/v1/media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ url }),
    });

    const json = (await res.json().catch(() => ({}))) as ApiResponse;

    if (res.status === 402) {
      console.error("Error: Payment Required (Insufficient credits). Please top up your balance at https://soclip.dev");
      process.exit(1);
    }

    return { status: res.status, data: json };
  } catch (err: any) {
    console.error(`Error: Request failed (${err.message || err})`);
    process.exit(1);
  }
}

export async function fetchBalance(): Promise<{ status: number; data: ApiResponse }> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("Error: API key not configured.");
    console.error("Please set the SOCLIP_API_KEY environment variable or get a key at https://soclip.dev and run:");
    console.error("  soclip config set-key <your-api-key>");
    process.exit(1);
  }

  const baseUrl = getApiBase();
  try {
    const res = await fetch(`${baseUrl}/v1/balance`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const json = (await res.json().catch(() => ({}))) as ApiResponse;
    return { status: res.status, data: json };
  } catch (err: any) {
    console.error(`Error: Request failed (${err.message || err})`);
    process.exit(1);
  }
}
