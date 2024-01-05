import type { Meta, StoryObj } from '@storybook/react';
import SongList from './SongList';

const meta = {
  title: 'Components/SongList',
  component: SongList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SongList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    songs: [] 
  }
};
