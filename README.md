# soclip-cli

> Official CLI tool to extract social video media direct links and metadata from TikTok, YouTube, Instagram, X/Twitter, and more via [soclip.dev](https://soclip.dev).

## Installation

```bash
npm install -g soclip-cli
```

> Package name is `soclip-cli`. The command it installs is `soclip`.
> Docs for `soclip-cli@0.2.0` — last updated 2026-08-07.
> Machine-readable docs for AI agents: <https://soclip.dev/llms.txt>

## Setup API Key

Get your API key at [https://soclip.dev](https://soclip.dev), then save it:

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

## Pricing

1 credit = $0.001. Each successful media extraction costs 2 credits ($0.002). Credits never expire. Get started with free trial credits at [https://soclip.dev](https://soclip.dev).

## Documentation

- Full docs: <https://soclip.dev/docs>
- Plain-text docs for AI agents: <https://soclip.dev/llms.txt>
- MCP server for Claude Desktop / Cursor: [`soclip-mcp`](https://www.npmjs.com/package/soclip-mcp)

## License

MIT License &copy; 2026 [soclip](https://soclip.dev)
