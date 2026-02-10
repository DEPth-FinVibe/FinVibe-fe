import type { Meta, StoryObj } from "@storybook/react";
import { MyChallengeHistoryItem } from "@/components/MyChallengeHistoryItem/MyChallengeHistoryItem";

const meta = {
  title: "Components/MyChallengeHistoryItem",
  component: MyChallengeHistoryItem,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "나의 챌린지 내역을 표시하는 컴포넌트입니다. 제목, 진행률바, 퍼센트, 남은 일수, 종목명을 포함합니다.",
      },
      canvas: {
        sourceState: "shown",
      },
      viewport: {
        defaultViewport: "desktop",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: {
      control: { type: "text" },
      description: "챌린지 제목",
    },
    progress: {
      control: { type: "number", min: 0, max: 100, step: 1 },
      description: "진행률 (0-100)",
    },
    remainingDays: {
      control: { type: "number", min: 0, step: 1 },
      description: "남은 일수",
    },
    stockName: {
      control: { type: "text" },
      description: "종목명 (칩에 표시)",
    },
  },
} satisfies Meta<typeof MyChallengeHistoryItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "7일 연속 출석",
    progress: 70,
    remainingDays: 2,
    stockName: "삼성전자",
  },
};

export const HighProgress: Story = {
  args: {
    title: "7일 연속 출석",
    progress: 90,
    remainingDays: 1,
    stockName: "삼성전자",
  },
};

export const LowProgress: Story = {
  args: {
    title: "7일 연속 출석",
    progress: 30,
    remainingDays: 5,
    stockName: "삼성전자",
  },
};

export const WithoutStockName: Story = {
  args: {
    title: "7일 연속 출석",
    progress: 70,
    remainingDays: 2,
  },
};

export const Completed: Story = {
  args: {
    title: "7일 연속 출석",
    progress: 100,
    remainingDays: 0,
    stockName: "삼성전자",
  },
};

