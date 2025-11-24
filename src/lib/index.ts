import RealArticleAPI from "./ArticleAPI";
import MockArticleAPI from "./ArticleAPI.mock";
import RealSongAPI from "./SongAPI";
import MockSongAPI from "./SongAPI.mock";

const USE_MOCKS = process.env.USE_MOCKS === "true";

export const ArticleAPI = USE_MOCKS ? MockArticleAPI : RealArticleAPI;
export const SongAPI = USE_MOCKS ? MockSongAPI : RealSongAPI;
