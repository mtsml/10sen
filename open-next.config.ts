import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({
  // R2 binding (NEXT_INC_CACHE_R2_BUCKET) can be added later for production.
  // For local migration verification, use the default incremental cache.
});
