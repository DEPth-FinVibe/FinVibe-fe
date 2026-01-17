import type { Meta, StoryObj } from "@storybook/react";
import RelatedNews from "./RelatedNews";

const meta: Meta<typeof RelatedNews> = {
  title: "Components/RelatedNews",
  component: RelatedNews,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RelatedNews>;

export const Default: Story = {
  args: {
    sourceAndTime: "매일경제 · 2시간 전",
    title: "엔비디아 신규 AI 칩 공개... 국내 반도체 수혜 전망",
  },
};

export const WithClick: Story = {
  args: {
    sourceAndTime: "매일경제 · 2시간 전",
    title: "엔비디아 신규 AI 칩 공개... 국내 반도체 수혜 전망",
    onClick: () => {
      console.log("Related news clicked");
    },
  },
};

