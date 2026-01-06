import type { Meta, StoryObj } from "@storybook/react";
import NewsCard from "./NewsCard";

const meta = {
  title: "Components/NewsCard",
  component: NewsCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    sentiment: {
      control: "select",
      options: ["success", "error", "neutral"],
    },
  },
} satisfies Meta<typeof NewsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: "산업",
    sentiment: "success",
    time: "2시간 전",
    title: "반도체 시장 회복세, 삼성전자와 SK하이닉스 주가 급등",
    description: "AI 및 데이터센터 수요 증가로 인해 메모리 반도체 가격이 상승하고 있습니다. 전문가들은 이러한 추세가 2025년까지 지속될 것으로 전망하고 있습니다.",
    aiAnalysis: "긍정적인 시장 전망으로 기술주 투자 기회가 될 수 있습니다.",
    likeCount: 124,
    commentCount: 45,
  },
};

export const NegativeSentiment: Story = {
  args: {
    category: "경제",
    sentiment: "error",
    time: "1시간 전",
    title: "금리 인상 가능성에 시장 변동성 확대",
    description: "미국 연준의 추가 금리 인상 시사로 인해 글로벌 증시가 하락 압력을 받고 있습니다. 투자자들의 관망세가 짙어지고 있습니다.",
    aiAnalysis: "단기적인 시장 변동성 확대가 예상되므로 리스크 관리가 필요합니다.",
    likeCount: 85,
    commentCount: 32,
  },
};

