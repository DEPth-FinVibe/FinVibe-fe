import type { Meta, StoryObj } from "@storybook/react";
import { ChallengeStatus } from "@/components/ChallengeStatus/ChallengeStatus";

const meta = {
  title: "Components/ChallengeStatus",
  component: ChallengeStatus,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "챌린지 현황을 표시하는 컴포넌트입니다. 제목, 난이도, 진행률, 종료일, 보상, 상태 정보를 포함합니다.",
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
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: {
      control: { type: "text" },
      description: "챌린지 제목",
    },
    description: {
      control: { type: "text" },
      description: "챌린지 설명",
    },
    difficulty: {
      control: { type: "select" },
      options: ["쉬움", "보통", "어려움"],
      description: "난이도",
    },
    completedDays: {
      control: { type: "number", min: 0, max: 30, step: 1 },
      description: "완료한 일수",
    },
    totalDays: {
      control: { type: "number", min: 1, max: 30, step: 1 },
      description: "총 일수",
    },
    daysUntilEnd: {
      control: { type: "number", min: 0, step: 1 },
      description: "종료까지 남은 일수",
    },
    rewardXp: {
      control: { type: "number", min: 0, step: 1 },
      description: "보상 XP",
    },
    isPinned: {
      control: { type: "boolean" },
      description: "핀 표시 여부",
    },
  },
} satisfies Meta<typeof ChallengeStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "7일 연속 투자",
    description: "일주일 동안 매일 최소 1회 거래하기",
    difficulty: "쉬움",
    completedDays: 7,
    totalDays: 7,
    daysUntilEnd: 3,
    rewardXp: 100,
    isPinned: false,
  },
};

export const InProgress: Story = {
  args: {
    title: "30일 투자 습관 만들기",
    description: "30일 동안 매일 투자 관련 학습하기",
    difficulty: "보통",
    completedDays: 15,
    totalDays: 30,
    daysUntilEnd: 15,
    rewardXp: 500,
    isPinned: true,
  },
};

export const HardChallenge: Story = {
  args: {
    title: "100일 투자 마라톤",
    description: "100일 동안 매일 투자 일지 작성하기",
    difficulty: "어려움",
    completedDays: 45,
    totalDays: 100,
    daysUntilEnd: 55,
    rewardXp: 2000,
    isPinned: false,
  },
};
