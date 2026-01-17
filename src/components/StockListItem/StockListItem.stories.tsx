import type { Meta, StoryObj } from "@storybook/react";
import StockListItem from "./StockListItem";

const meta: Meta<typeof StockListItem> = {
  title: "Components/StockListItem",
  component: StockListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StockListItem>;

export const Favorited: Story = {
  args: {
    stockName: "삼성전자",
    stockCode: "005930",
    tradingVolume: "12.5M",
    price: "₩70,542",
    changeRate: "+2.23%",
    isFavorited: true,
    onFavoriteToggle: () => console.log("즐겨찾기 토글"),
  },
};

export const NotFavorited: Story = {
  args: {
    stockName: "주식 종목 이름",
    stockCode: "종목 코드",
    tradingVolume: "12.5M",
    price: "₩실시간 가격",
    changeRate: "+2.23%",
    isFavorited: false,
    onFavoriteToggle: () => console.log("즐겨찾기 토글"),
  },
};

export const NegativeChange: Story = {
  args: {
    stockName: "주식 종목 이름",
    stockCode: "종목 코드",
    tradingVolume: "12.5M",
    price: "₩실시간 가격",
    changeRate: "-2.23%",
    isFavorited: false,
    onFavoriteToggle: () => console.log("즐겨찾기 토글"),
  },
};

