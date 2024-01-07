import type { Meta, StoryObj } from '@storybook/react';
import SongList from './SongList';

const meta = {
  title: 'Components/SongList',
  component: SongList,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SongList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    songs: [
      { song_id: 1, song_name: "楽曲タイトル1", artist_name: "歌手名A" },
      { song_id: 1, song_name: "楽曲タイトル2", artist_name: "歌手名B" },
      { song_id: 1, song_name: "楽曲タイトル3", artist_name: "歌手名C" }
    ]
  }
};

export const WithArticlesCnt: Story = {
  args: {
    songs: [
      { song_id: 1, song_name: "楽曲タイトル1", artist_name: "歌手名A", articles_cnt: 11, rank: 1 },
      { song_id: 1, song_name: "楽曲タイトル2", artist_name: "歌手名B", articles_cnt: 9, rank: 2 },
      { song_id: 1, song_name: "楽曲タイトル3", artist_name: "歌手名C", articles_cnt: 9, rank: 2 },
      { song_id: 1, song_name: "楽曲タイトル4", artist_name: "歌手名D", articles_cnt: 3, rank: 3 },
      { song_id: 1, song_name: "楽曲タイトル5", artist_name: "歌手名E", articles_cnt: 2, rank: 4 },
      { song_id: 1, song_name: "楽曲タイトル6", artist_name: "歌手名F", articles_cnt: 1, rank: 5 }
    ]
  }
};
