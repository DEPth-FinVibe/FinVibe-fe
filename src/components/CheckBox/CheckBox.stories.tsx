import type { Meta, StoryObj } from "@storybook/react";
import { CheckBox, PropertyOff, PropertyOn } from "@/components/CheckBox/CheckBox";

const meta = {
  title: "Components/CheckBox",
  component: CheckBox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const PropertyOffStory: Story = {
  render: () => <PropertyOff />,
};

export const PropertyOnStory: Story = {
  render: () => <PropertyOn />,
};

export const CustomTitle: Story = {
  args: {
    checked: false,
    title: "안정적 투자",
    description: "안정적인 수익을 위한 보수적 투자",
  },
};

