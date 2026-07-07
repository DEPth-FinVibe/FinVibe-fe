import type { Meta, StoryObj } from "@storybook/react";
import SwitchBar, { type SwitchBarProps } from "./SwitchBar";
import { NEWS_TABS, type NewsTabType } from "./SwitchBar.constants";
import { fn } from "@storybook/test";
import { useState } from "react";

const meta = {
  title: "Components/SwitchBar",
  component: SwitchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof SwitchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SwitchBarWithState = (args: Partial<SwitchBarProps<NewsTabType>>) => {
  const [activeTab, setActiveTab] = useState<NewsTabType>(args.activeTab || "news");
  return (
    <SwitchBar
      tabs={NEWS_TABS}
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
  render: (args) => (
    <SwitchBarWithState {...(args as Partial<SwitchBarProps<NewsTabType>>)} />
  ),
  args: {
    activeTab: "news",
    tabs: NEWS_TABS,
  },
};
