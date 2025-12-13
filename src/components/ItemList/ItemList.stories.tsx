import type { Meta, StoryObj } from '@storybook/react';
import ItemList from './ItemList';

const meta = {
  title: 'Components/ItemList',
  component: ItemList,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ItemList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    items: [
      { id: 1, name: "楽曲タイトル1 / 歌手名A" },
      { id: 2, name: "楽曲タイトル2 / 歌手名B" },
      { id: 3, name: "楽曲タイトル3 / 歌手名C" }
    ],
    makeHref: (item) => `/song/${encodeURIComponent(item.id)}`
  }
};

export const WithArticlesCnt: Story = {
  args: {
    items: [
      { id: 1, name: "楽曲タイトル1 / 歌手名A", articles_cnt: 11, rank: 1 },
      { id: 2, name: "楽曲タイトル2 / 歌手名B", articles_cnt: 9, rank: 2 },
      { id: 3, name: "楽曲タイトル3 / 歌手名C", articles_cnt: 9, rank: 2 },
      { id: 4, name: "楽曲タイトル4 / 歌手名D", articles_cnt: 3, rank: 3 },
      { id: 5, name: "楽曲タイトル5 / 歌手名E", articles_cnt: 2, rank: 4 },
      { id: 6, name: "楽曲タイトル6 / 歌手名F", articles_cnt: 1, rank: 5 }
    ],
    makeHref: (item) => `/song/${encodeURIComponent(item.id)}`
  }
};

export const Search: Story = {
  args: {
    items: [
      { id: 1, name: "楽曲タイトル1 / 歌手名A" },
      { id: 2, name: "楽曲タイトル2 / 歌手名B" },
      { id: 3, name: "楽曲タイトル3 / 歌手名C" }
    ],
    makeHref: (item) => `/song/${encodeURIComponent(item.id)}`,
    search: true
  }
};
