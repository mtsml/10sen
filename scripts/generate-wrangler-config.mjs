import fs from "node:fs";
import path from "node:path";

const databaseName = process.env.D1_DATABASE_NAME;
const databaseId = process.env.D1_DATABASE_ID;
const workerName = process.env.CLOUDFLARE_WORKER_NAME || "10sen";
const compatibilityDate = process.env.CLOUDFLARE_COMPATIBILITY_DATE || "2026-02-07";

if (!databaseName || !databaseId) {
  console.error("Missing env vars: D1_DATABASE_NAME and D1_DATABASE_ID are required.");
  process.exit(1);
}

const outputPath = path.resolve(process.cwd(), ".wrangler.deploy.toml");

const toml = `name = "${workerName}"
main = ".open-next/worker.js"
compatibility_date = "${compatibilityDate}"
compatibility_flags = ["nodejs_compat"]

[observability.logs]
enabled = true

[assets]
directory = ".open-next/assets"
binding = "ASSETS"

[[d1_databases]]
binding = "DB"
database_name = "${databaseName}"
database_id = "${databaseId}"
`;

fs.writeFileSync(outputPath, toml, "utf8");
console.log(`Generated ${outputPath}`);
