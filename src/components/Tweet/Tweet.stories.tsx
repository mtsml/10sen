import type { Meta, StoryObj } from '@storybook/react';
import Tweet from './Tweet';

const meta = {
  title: 'Components/Tweet',
  component: Tweet,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tweet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: "https://twitter.com/pine_nm/status/1738196348233711756"
  }
};

export const inValidUrl: Story = {
  args: {
    url: "https://x.com/pine_nm/status/1738196348233711756"
  }
};