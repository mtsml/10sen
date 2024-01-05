import type { Meta, StoryObj } from '@storybook/react';
import ArticleList from './ArticleList';

const meta = {
  title: 'Components/ArticleList',
  component: ArticleList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ArticleList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    articles: [] 
  }
};
