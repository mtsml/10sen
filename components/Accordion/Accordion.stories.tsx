import type { Meta, StoryObj } from '@storybook/react';
import Accordion from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    header: <span>注意事項</span>,
    children: <p>Accordionのテキスト本文です。</p>
  }
};

export const Warning: Story = {
  args: {
    header: <span>遷移先と集計方法(続きを読む)</span>,
    type: "warning",
    children: <>
      <p>歌手名をクリックすると曲の一覧ページに遷移します。一覧ページは歌手名で曲を絞り込んだ状態で表示されます。</p>
      <p>歌手名の横に表示されている Post(s) はその歌手を紹介している<b>記事数</b>です。一つの記事で同じ歌手の曲を複数紹介している場合でも1回とカウントします。</p>
    </>
  }
};
