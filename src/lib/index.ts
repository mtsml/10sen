import MockArticleAPI from "./ArticleAPI.mock";
import MockSongAPI from "./SongAPI.mock";
const USE_MOCKS = process.env.USE_MOCKS === "true";
const USE_STATIC_DATA = process.env.STATIC_EXPORT === "true";

if (!USE_STATIC_DATA && !USE_MOCKS) {
  throw new Error("This site is statically generated. Run \"npm run cf:build\" or set USE_MOCKS=true for local development.");
}

const staticData = USE_STATIC_DATA ? require("./StaticDataAPI") as typeof import("./StaticDataAPI") : undefined;

export const ArticleAPI = USE_STATIC_DATA ? staticData!.StaticArticleAPI : MockArticleAPI;
export const SongAPI = USE_STATIC_DATA ? staticData!.StaticSongAPI : MockSongAPI;
