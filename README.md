# soclip

**TikTok / YouTube / Instagram video download API — as a CLI.**

Give it a social video URL, get direct media links and metadata back. No yt-dlp to host, no proxies, no scraping stack.

[Website](https://soclip.dev) · [Docs](https://soclip.dev/docs) · [Get 500 free credits](https://soclip.dev) · [npm](https://www.npmjs.com/package/soclip-cli)

[![npm](https://img.shields.io/npm/v/soclip-cli.svg)](https://www.npmjs.com/package/soclip-cli)
[![license](https://img.shields.io/npm/l/soclip-cli.svg)](./LICENSE)
[![node](https://img.shields.io/node/v/soclip-cli.svg)](https://www.npmjs.com/package/soclip-cli)

```bash
npm i -g soclip-cli
soclip config set-key <your-api-key>          # key from https://soclip.dev
soclip "https://www.tiktok.com/@user/video/…" --quality best
```

Package name is `soclip-cli`. The command it installs is `soclip`.
Machine-readable docs for agents: <https://soclip.dev/llms.txt>

## Why not yt-dlp

yt-dlp is excellent on a laptop. In a worker, a bot, or an MCP tool it means maintaining extractors, IP rotation, and breakage. soclip is the same job as an HTTP API: URL in, JSON + direct links out. `$0.002` per call, 500 free credits, credits never expire.

## Setup API Key

Get your API key at [https://soclip.dev](https://soclip.dev) (GitHub login), then save it:

```bash
soclip config set-key <your-api-key>
```

This writes to `~/.soclip/config.json`.

Alternatively, set the `SOCLIP_API_KEY` environment variable:

```bash
export SOCLIP_API_KEY="your-api-key"
```

### Key resolution order

The CLI uses the first key it finds:

1. **`SOCLIP_API_KEY` environment variable** — highest priority, overrides the config file
2. `~/.soclip/config.json`

Handy for CI or for running one command against a different account without
touching your saved config.

## Usage & Examples

### 1. Extract Video Summary & Available Qualities

```bash
soclip "https://www.tiktok.com/@scout2015/video/6718335390841801990"
```

**Output:**
```text
Title:     Scout's favorite game!
Source:    tiktok
Duration:  15s
Thumbnail: https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/123456789.jpg

Qualities (2):
  - 1080p [1080x1920]
  - 720p [720x1280]

Use --quality best|worst|<height> to get a direct link, or --json for the full response.
```

### 2. Output Direct Video Link (`--quality`)

```bash
soclip "https://www.tiktok.com/@scout2015/video/6718335390841801990" --quality best
```

**Output:**
```text
https://v16-webapp-prime.tiktok.com/video/tos/useast2a/tos-useast2a-ve-0068c001/ogB...
```

Accepted values:

| Value      | Meaning                             |
| ---------- | ----------------------------------- |
| `best`     | Highest available resolution        |
| `worst`    | Lowest available resolution         |
| `<height>` | A number, e.g. `720` or `1080`      |

> **Numeric matching is nearest-match, not exact.** If you ask for `720` and the
> video only offers 480p and 1080p, you get 480p — no error, no warning. Run
> `--json` first if you need to know which resolutions actually exist.

### 2b. Download the file

Direct links redirect to a CDN and the signed URL carries no usable filename, so
follow redirects with `-L` and name the output explicitly with `-o`:

```bash
curl -L -o video.mp4 "$(soclip "<url>" --quality best)"
```

> Do **not** use `curl -O` here. Without `-L` it saves a 0-byte file (it stores
> the redirect, not the video), and `-O` cannot derive a filename from a signed
> CDN URL.

### 3. Check Account Balance

```bash
soclip balance
```

**Output:**
```text
Balance: 100 credits
```

### Optional: Full JSON Output

```bash
soclip "https://www.tiktok.com/@scout2015/video/6718335390841801990" --json
```

## Supported Platforms

- **TikTok** (Videos, Slides)
- **YouTube** (Shorts, Standard Videos)
- **Instagram** (Reels, Posts)
- **X / Twitter** (Videos, GIFs)
- **Douyin, Bilibili, Kuaishou**, and more.

## HTTP API

Same account, same key:

```bash
curl -X POST https://api.soclip.dev/v1/media \
  -H "Authorization: Bearer sc_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

Landing pages: [TikTok](https://soclip.dev/api/tiktok-video-download-api) · [YouTube](https://soclip.dev/api/youtube-video-download-api) · [Instagram](https://soclip.dev/api/instagram-video-download-api)

## Pricing

1 credit = $0.001. Each successful media extraction costs 2 credits ($0.002). Credits never expire. Get started with free trial credits at [https://soclip.dev](https://soclip.dev).

## MCP (Claude Desktop / Cursor)

```json
{
  "mcpServers": {
    "soclip": {
      "command": "npx",
      "args": ["-y", "soclip-mcp"],
      "env": { "SOCLIP_API_KEY": "sc_live_your_api_key" }
    }
  }
}
```

If you already ran `soclip config set-key`, the `env` block can be omitted.

## Documentation

- Full docs: <https://soclip.dev/docs>
- Plain-text docs for AI agents: <https://soclip.dev/llms.txt>
- MCP package: [`soclip-mcp`](https://www.npmjs.com/package/soclip-mcp)

## License

MIT License &copy; 2026 [soclip](https://soclip.dev)
