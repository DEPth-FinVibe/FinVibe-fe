import type { Meta, StoryObj } from "@storybook/react";
import Stock from "./Stock";

const meta = {
  title: "Components/Stock",
  component: Stock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Stock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    stockName: "캔 파이트",
    stockDescription: "바이오파마(ADR)",
    price: "₩839",
    changeAmount: "+ ₩311",
    changePercent: "+59.03%",
  },
};

export const NegativeChange: Story = {
  args: {
    stockName: "삼성전자",
    stockDescription: "Samsung Electronics",
    price: "₩72,000",
    changeAmount: "- ₩1,500",
    changePercent: "-2.08%",
  },
};

export const WithoutDescription: Story = {
  args: {
    stockName: "애플",
    price: "₩180,000",
    changeAmount: "+ ₩5,000",
    changePercent: "+2.86%",
  },
};

export const WithClick: Story = {
  args: {
    stockName: "캔 파이트",
    stockDescription: "바이오파마(ADR)",
    price: "₩839",
    changeAmount: "+ ₩311",
    changePercent: "+59.03%",
    onClick: () => {
      console.log("Stock clicked");
    },
  },
};

export const TradingStock: Story = {
  args: {
    stockName: "주식명",
    price: "가격",
    changeAmount: "+ $###",
    changePercent: "+###%",
    type: "trading",
    onClose: () => {
      console.log("Close clicked");
    },
  },
};

export const ReservedStock: Story = {
  args: {
    stockName: "삼성전자",
    stockDescription: "Samsung Electronics",
    price: "₩72,000",
    changeAmount: "- ₩1,500",
    changePercent: "-2.08%",
    type: "reserved",
    imageUrl: undefined, // 이미지 없을 때 원형 플레이스홀더 표시
    onClose: () => {
      console.log("Close clicked");
    },
  },
};

export const TradingStockWithImage: Story = {
  args: {
    stockName: "애플",
    stockDescription: "Apple Inc.",
    price: "₩180,000",
    changeAmount: "+ ₩5,000",
    changePercent: "+2.86%",
    type: "trading",
    imageUrl: "https://via.placeholder.com/50",
    imageAlt: "애플 로고",
    onClose: () => {
      console.log("Close clicked");
    },
  },
};

export const FavoriteStock: Story = {
  args: {
    stockName: "캔 파이트",
    stockDescription: "바이오파마(ADR)",
    price: "₩839",
    changeAmount: "+ ₩311",
    changePercent: "+59.03%",
    type: "favorite",
    onHeartClick: () => {
      console.log("Heart clicked");
    },
  },
};

export const FavoriteStockWithImage: Story = {
  args: {
    stockName: "삼성전자",
    stockDescription: "Samsung Electronics",
    price: "₩72,000",
    changeAmount: "- ₩1,500",
    changePercent: "-2.08%",
    type: "favorite",
    imageUrl: "https://via.placeholder.com/50",
    imageAlt: "삼성전자 로고",
    onHeartClick: () => {
      console.log("Heart clicked");
    },
  },
};

