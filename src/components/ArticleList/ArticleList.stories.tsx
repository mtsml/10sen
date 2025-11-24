import type { Meta, StoryObj } from '@storybook/react';
import ArticleList from './ArticleList';

const meta = {
  title: 'Components/ArticleList',
  component: ArticleList,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ArticleList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    articles: [
      { id: 1, url: "https://10sen.wiki", name: "10選記事のタイトル1"},
      { id: 2, url: "https://10sen.wiki", name: "10選記事のタイトル2"},
      { id: 3, url: "https://10sen.wiki", name: "10選記事のタイトル3"}
    ]
  }
};

export const WithRelatedSongs: Story = {
  args: {
    articles: [
      { id: 1, url: "https://10sen.wiki", name: "10選記事のタイトル1", songs_name: "楽曲名A / 楽曲名B / 楽曲名C"},
      { id: 2, url: "https://10sen.wiki", name: "10選記事のタイトル2", songs_name: "楽曲名A / 楽曲名B"},
      { id: 3, url: "https://10sen.wiki", name: "10選記事のタイトル3", songs_name: "楽曲名A"}
    ]
  }
};
