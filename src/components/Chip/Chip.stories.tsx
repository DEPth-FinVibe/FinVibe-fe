import type { Meta, StoryObj } from "@storybook/react";
import Chip from "./Chip";
import { fn } from "@storybook/test";

const meta = {
  title: "Components/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "neutral", "primary", "secondary"],
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "산업",
    variant: "default",
  },
};

export const Neutral: Story = {
  args: {
    label: "중립",
    variant: "neutral",
  },
};

export const PrimaryWithClose: Story = {
  args: {
    label: "삼성전자",
    variant: "primary",
    onClose: fn(),
  },
};

export const Secondary: Story = {
  args: {
    label: "삼성전자",
    variant: "secondary",
  },
};

export const DifficultyBeginner: Story = {
  args: {
    label: "초급",
    variant: "secondary",
  },
};
