import type { Meta, StoryObj } from '@storybook/react';
import LinkWithArrow from './LinkWithArrow';

const meta = {
  title: 'Components/LinkWithArrow',
  component: LinkWithArrow,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LinkWithArrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "/year/2023",
    text: "Linkテキストです。"
  }
};
