import type { Meta, StoryObj } from "@storybook/react";
import SwitchBar from "./SwitchBar";
import type { TabType, SwitchBarProps } from "./SwitchBar";
import { fn } from "@storybook/test";
import { useState } from "react";

const meta = {
  title: "Components/SwitchBar",
  component: SwitchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    activeTab: {
      control: "radio",
      options: ["news", "discussion"],
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof SwitchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SwitchBarWithState = (args: SwitchBarProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(args.activeTab || "news");
  return (
    <SwitchBar
      {...args}
      activeTab={activeTab}
      onChange={(tab) => {
        setActiveTab(tab);
        args.onChange?.(tab);
      }}
      className="w-[978px]"
    />
  );
};

export const Interactive: Story = {
  render: (args) => <SwitchBarWithState {...args} />,
  args: {
    activeTab: "news",
  },
};
