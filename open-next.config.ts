import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig({});

(config as typeof config & { buildCommand: string }).buildCommand = "next build";

export default config;
