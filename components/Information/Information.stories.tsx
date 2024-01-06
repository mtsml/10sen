import type { Meta, StoryObj } from '@storybook/react';
import Information from './Information';

const meta = {
  title: 'Components/Information',
  component: Information,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Information>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <p>informationテキストです。</p>
  }
};
