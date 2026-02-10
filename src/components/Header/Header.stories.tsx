import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Header } from "./Header";

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    activeMenu: {
      control: "select",
      options: [
        "홈",
        "투자 시뮬레이터",
        "AI 투자 학습",
        "뉴스 & 토론",
        "챌린지",
      ],
    },
  },
  args: {
    onMenuClick: fn(),
    onNotificationClick: fn(),
    onProfileClick: fn(),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopGNB: Story = {
  args: {
    activeMenu: "홈",
  },
};

export const NavigatorActive: Story = {
  args: {
    activeMenu: "투자 시뮬레이터",
  },
};
