import type { Meta, StoryObj } from "@storybook/react";
import StockChartHeader from "./StockChartHeader";

const meta = {
  title: "Components/StockChartHeader",
  component: StockChartHeader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StockChartHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    indexName: "코스닥",
    currentValue: "686.72",
    changeAmount: "-106.47",
    changeRate: "-4.27%",
  },
};

export const Positive: Story = {
  args: {
    indexName: "코스피",
    currentValue: "2,450.12",
    changeAmount: "+45.67",
    changeRate: "+1.90%",
  },
};

export const WithClick: Story = {
  args: {
    indexName: "코스닥",
    currentValue: "686.72",
    changeAmount: "-106.47",
    changeRate: "-4.27%",
    onClick: () => {
      console.log("Stock chart header clicked");
    },
  },
};

