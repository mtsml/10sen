import type { Meta, StoryObj } from '@storybook/react';
import YouTube from './YouTube';

const meta = {
  title: 'Components/YouTube',
  component: YouTube,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof YouTube>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    videoId: "qSA1Qwgy5iw"
  }
};
