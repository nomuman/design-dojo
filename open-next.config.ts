import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig({
	// For best results consider enabling R2 caching
	// See https://opennext.js.org/cloudflare/caching for more details
	// incrementalCache: r2IncrementalCache
});

// @ts-ignore buildCommand is not in the type definition but is used at runtime by @opennextjs/aws
config.buildCommand = "next build";

export default config;
