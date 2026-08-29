import fs from "node:fs/promises";
import path from "node:path";

const requiredEnv = [
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_API_TOKEN",
  "D1_DATABASE_ID",
];

const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length > 0) {
  console.error(`Missing env vars: ${missingEnv.join(", ")}`);
  process.exit(1);
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = process.env.D1_DATABASE_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const outputPath = path.resolve(process.cwd(), "src/generated/site-data.json");

const statements = [
  "SELECT id, url, name, year, tweet_url FROM article ORDER BY id",
  "SELECT id, name FROM artist ORDER BY id",
  "SELECT id, name, artist_id, video_id FROM song ORDER BY id",
  "SELECT article_id, song_id, sort_no FROM article_song_map ORDER BY article_id, sort_no",
];

const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ batch: statements.map((sql) => ({ sql })) }),
  }
);

if (!response.ok) {
  throw new Error(`D1 export failed with HTTP ${response.status}: ${await response.text()}`);
}

const payload = await response.json();
if (!payload.success || !Array.isArray(payload.result) || payload.result.length !== statements.length) {
  throw new Error(`D1 export returned an unexpected response: ${JSON.stringify(payload.errors ?? payload)}`);
}

const results = payload.result.map((result) => {
  if (!result.success || !Array.isArray(result.results)) {
    throw new Error(`D1 export query failed: ${JSON.stringify(result)}`);
  }
  return result.results;
});

const [articles, artists, songs, articleSongMaps] = results;

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(
  outputPath,
  `${JSON.stringify({ articles, artists, songs, articleSongMaps }, null, 2)}\n`,
  "utf8"
);

console.log(`Exported ${articles.length} articles, ${artists.length} artists, ${songs.length} songs, and ${articleSongMaps.length} mappings to ${outputPath}`);
