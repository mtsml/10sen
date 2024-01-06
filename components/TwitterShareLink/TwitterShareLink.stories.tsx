import type { Meta, StoryObj } from '@storybook/react';
import TwitterShareLink from './TwitterShareLink';

const meta = {
  title: 'Components/TwitterShareLink',
  component: TwitterShareLink,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TwitterShareLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "ツイート本文",
    url: "https://10sen.wiki",
    hashtags: ["ハッシュタグ"]
  }
};
