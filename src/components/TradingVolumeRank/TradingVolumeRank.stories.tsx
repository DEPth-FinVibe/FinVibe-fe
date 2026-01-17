import type { Meta, StoryObj } from "@storybook/react";
import TradingVolumeRank from "./TradingVolumeRank";

const meta = {
  title: "Components/TradingVolumeRank",
  component: TradingVolumeRank,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TradingVolumeRank>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rank: 2,
    stockName: "테슬라",
    ticker: "TSLA",
    currentPrice: "445,600원",
    changeRate: "+5.67%",
    tradingVolume: "980억",
  },
};

export const NegativeChange: Story = {
  args: {
    rank: 3,
    stockName: "삼성전자",
    ticker: "005930",
    currentPrice: "72,000원",
    changeRate: "-2.34%",
    tradingVolume: "850억",
  },
};

export const WithClick: Story = {
  args: {
    rank: 1,
    stockName: "애플",
    ticker: "AAPL",
    currentPrice: "180,000원",
    changeRate: "+3.45%",
    tradingVolume: "1,200억",
    onClick: () => {
      console.log("Trading volume rank clicked");
    },
  },
};

