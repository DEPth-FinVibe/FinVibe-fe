import type { Meta, StoryObj } from "@storybook/react";
import { CourseItem } from "@/components/Progress/CourseItem";

const meta = {
  title: "Components/Progress/CourseItem",
  component: CourseItem,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "학습코스 아이템 컴포넌트입니다. 체크박스, 제목, 레벨 뱃지, 진행률 바를 포함합니다.",
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
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", overflowX: "auto" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: {
      control: { type: "text" },
      description: "코스 제목",
    },
    description: {
      control: { type: "text" },
      description: "코스 설명",
    },
    level: {
      control: { type: "select" },
      options: ["초급", "중급", "고급"],
      description: "코스 레벨",
    },
    progress: {
      control: { type: "number", min: 0, max: 100, step: 1 },
      description: "진행률 (0-100)",
    },
    isExpanded: {
      control: { type: "boolean" },
      description: "확장 상태",
    },
  },
} satisfies Meta<typeof CourseItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "투자 기초",
    description: "투자의 기본 개념과 용어를 배웁니다",
    level: "초급",
    progress: 65,
    isExpanded: false,
  },
};

export const Intermediate: Story = {
  args: {
    title: "주식 투자 중급",
    description: "중급 투자 전략과 포트폴리오 구성",
    level: "중급",
    progress: 75,
    isExpanded: false,
  },
};

export const Advanced: Story = {
  args: {
    title: "주식 투자 심화",
    description: "고급 투자 전략과 리스크 관리 방법",
    level: "고급",
    progress: 90,
    isExpanded: true,
  },
};

export const Completed: Story = {
  args: {
    title: "부동산 투자 입문",
    description: "부동산 투자의 기초 지식",
    level: "초급",
    progress: 100,
    isExpanded: false,
  },
};

