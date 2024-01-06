import type { Meta, StoryObj } from '@storybook/react';
import ExternalLinkIcon from './ExternalLinkIcon';

const meta = {
  title: 'Components/ExternalLinkIcon',
  component: ExternalLinkIcon,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <>
        <span>左側のテキスト</span>
        <Story />
        <span>右側のテキスト</span>
      </>
    )
  ]
} satisfies Meta<typeof ExternalLinkIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoLink: Story = {};

export const ActiveLink: Story = {
  args: {
    href: "https://10sen.wiki"
  }
};

export const PaddingRight: Story = {
  args: {
    paddingRight: true
  }
};

export const PaddingLeft: Story = {
  args: {
    paddingLeft: true
  }
};

export const PaddingRightAndLeft: Story = {
  args: {
    paddingRight: true,
    paddingLeft: true
  }
};
