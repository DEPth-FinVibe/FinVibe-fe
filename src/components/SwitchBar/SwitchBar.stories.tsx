import type { Meta, StoryObj } from "@storybook/react";
import SwitchBar, { NEWS_TABS, type NewsTabType } from "./SwitchBar";
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

const SwitchBarWithState = (args: any) => {
  const [activeTab, setActiveTab] = useState<NewsTabType>(args.activeTab || "news");
  return (
    <SwitchBar
      {...args}
      tabs={NEWS_TABS}
      activeTab={activeTab}
      onChange={(tab) => {
        setActiveTab(tab as NewsTabType);
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
