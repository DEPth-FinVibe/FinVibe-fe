import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { Header } from "./Header";
import BackIcon from "@/assets/back.svg?react";
import CloseIcon from "@/assets/close.svg?react";

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    onLeftClick: { action: "left clicked" },
    onRightClick: { action: "right clicked" },
  },
  args: {
    onLeftClick: fn(),
    onRightClick: fn(),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "회원가입",
    leftIcon: <BackIcon />,
  },
};

export const WithBothIcons: Story = {
  args: {
    title: "정보 입력",
    leftIcon: <BackIcon />,
    rightIcon: <CloseIcon />,
  },
};

export const TitleOnly: Story = {
  args: {
    title: "설정",
  },
};

export const IconOnly: Story = {
  args: {
    leftIcon: <BackIcon />,
    rightIcon: <CloseIcon />,
  },
};
