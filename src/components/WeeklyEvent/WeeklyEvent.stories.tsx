import type { Meta, StoryObj } from "@storybook/react";
import { WeeklyEvent } from "@/components/WeeklyEvent/WeeklyEvent";

const meta = {
  title: "Components/WeeklyEvent",
  component: WeeklyEvent,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "주간 이벤트를 표시하는 컴포넌트입니다. 제목, 설명, 날짜 선택, 보상 정보, 참가 버튼을 포함합니다.",
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
      description: "이벤트 제목",
    },
    description: {
      control: { type: "text" },
      description: "이벤트 설명",
    },
    dateLabel: {
      control: { type: "text" },
      description: "날짜 텍스트 (예: '이번 주말')",
    },
    reward: {
      control: { type: "text" },
      description: "보상 정보 (예: '1등 : 1000 XP + 전설 배지')",
    },
  },
} satisfies Meta<typeof WeeklyEvent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "주말 투자 토너먼트",
    description: "주말 동안 가장 높은 수익률을 달성한 상위 10명에게 특별 보상",
    dateLabel: "이번 주말",
    reward: "1등 : 1000 XP + 전설 배지",
    onParticipate: () => console.log("참가하기 클릭"),
  },
};

export const WithoutReward: Story = {
  args: {
    title: "주말 투자 토너먼트",
    description: "주말 동안 가장 높은 수익률을 달성한 상위 10명에게 특별 보상",
    dateLabel: "이번 주말",
    onParticipate: () => console.log("참가하기 클릭"),
  },
};

export const WithoutDescription: Story = {
  args: {
    title: "주말 투자 토너먼트",
    dateLabel: "이번 주말",
    reward: "1등 : 1000 XP + 전설 배지",
    onParticipate: () => console.log("참가하기 클릭"),
  },
};

