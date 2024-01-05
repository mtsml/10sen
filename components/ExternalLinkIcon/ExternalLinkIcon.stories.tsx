import type { Meta, StoryObj } from '@storybook/react';
import ExternalLinkIcon from './ExternalLinkIcon';

const meta = {
  title: 'Components/ExternalLinkIcon',
  component: ExternalLinkIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ExternalLinkIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "https://10sen.wiki"
  }
};
