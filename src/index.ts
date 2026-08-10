#!/usr/bin/env node
import { Command } from "commander";
import { setApiKey } from "./config";
import { fetchMedia, fetchBalance } from "./api";
import { selectQualityMedia } from "./quality";
import pkg from "../package.json";

const program = new Command();

program
  .name("soclip")
  .description("CLI tool to extract social video media direct links and metadata")
  .version(pkg.version);

// Subcommand: balance
program
  .command("balance")
  .description("Check account remaining credits balance")
  .action(async () => {
    const { data } = await fetchBalance();
    if (!data.success) {
      console.error(`Error: ${data.error || "Failed to fetch balance"}`);
      process.exit(1);
    }
    console.log(`Balance: ${data.credits ?? 0} credits`);
  });

// Subcommand: config set-key <key>
const configCmd = program.command("config").description("Configure soclip CLI options");

configCmd
  .command("set-key <key>")
  .description("Set API key in ~/.soclip/config.json")
  .action((key: string) => {
    if (!key || key.trim() === "") {
      console.error("Error: Key cannot be empty");
      process.exit(1);
    }
    setApiKey(key);
    console.log("API key saved to ~/.soclip/config.json");
  });

// Default command / url positional argument
program
  .argument("[url]", "Social video URL (TikTok, YouTube, Instagram, X, etc.)")
  .option("--json", "Output complete raw JSON response from backend")
  .option("--quality <quality>", "Output a single direct link line (best, worst, or height e.g. 720)")
  .action(async (url: string | undefined, options: { json?: boolean; quality?: string }) => {
    // If no arguments or command passed, show help
    if (!url) {
      program.help();
      return;
    }

    const { data } = await fetchMedia(url);

    if (!data.success) {
      console.error(`Error: ${data.error || "Failed to process video link"}`);
      process.exit(1);
    }

    // Option: --json
    if (options.json) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    const mediaData = data.data || {};
    const medias = Array.isArray(mediaData.medias) ? mediaData.medias : [];

    // Option: --quality <quality>
    if (options.quality) {
      const selected = selectQualityMedia(medias, options.quality);
      if (!selected || !selected.url) {
        console.error("Error: No media direct link found for specified quality.");
        process.exit(1);
      }
      // Output single line direct link ONLY
      console.log(selected.url);
      return;
    }

    // Default human-readable output
    console.log(`Title:     ${mediaData.title || "N/A"}`);
    console.log(`Source:    ${mediaData.source || "N/A"}`);
    // API 返回时长单位不稳定：有时毫秒（28004）有时秒（28），>1000 视为毫秒。
    const durationSec =
      typeof mediaData.duration === "number"
        ? Math.round(mediaData.duration > 1000 ? mediaData.duration / 1000 : mediaData.duration)
        : mediaData.duration;
    console.log(`Duration:  ${durationSec ? `${durationSec}s` : "N/A"}`);
    if (mediaData.thumbnail) {
      console.log(`Thumbnail: ${mediaData.thumbnail}`);
    }

    if (medias.length > 0) {
      // Direct links are thousands of characters long, so the default view only
      // lists what is available. Use --quality to print an actual URL.
      console.log(`\nQualities (${medias.length}):`);
      for (const m of medias) {
        const label = m.label || m.quality || `${m.height || "?"}p`;
        const res = m.width && m.height ? ` [${m.width}x${m.height}]` : "";
        console.log(`  - ${label}${res}`);
      }
      console.log("\nUse --quality best|worst|<height> to get a direct link, or --json for the full response.");
    }
  });

program.parse(process.argv);
