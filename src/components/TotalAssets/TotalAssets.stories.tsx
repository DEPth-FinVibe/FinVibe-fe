import type { Meta, StoryObj } from "@storybook/react";
import { TotalAssets } from "@/components/TotalAssets";

const meta = {
  title: "Components/TotalAssets",
  component: TotalAssets,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "마이페이지에서 사용자의 총 자산과 변화율을 표시하는 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    totalAmount: {
      control: "number",
      description: "총 자산 금액",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "10450000" },
      },
    },
    changeRate: {
      control: "number",
      description: "변화율 (퍼센트)",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "4.5" },
      },
    },
    className: {
      control: "text",
      description: "추가 스타일 클래스",
      table: {
        type: { summary: "string" },
      },
    },
  },
  args: {
    totalAmount: 10450000,
    changeRate: 4.5,
  },
} satisfies Meta<typeof TotalAssets>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 총자산 (양수 변화율)
export const Default: Story = {
  args: {
    totalAmount: 10450000,
    changeRate: 4.5,
  },
};

// 큰 금액
export const LargeAmount: Story = {
  args: {
    totalAmount: 100000000,
    changeRate: 5.2,
  },
};

// 작은 금액
export const SmallAmount: Story = {
  args: {
    totalAmount: 1000000,
    changeRate: 2.1,
  },
};

// 음수 변화율 (손실)
export const NegativeChange: Story = {
  args: {
    totalAmount: 9500000,
    changeRate: -3.2,
  },
};

// 큰 변화율 (양수)
export const LargePositiveChange: Story = {
  args: {
    totalAmount: 12000000,
    changeRate: 15.8,
  },
};

// 큰 변화율 (음수)
export const LargeNegativeChange: Story = {
  args: {
    totalAmount: 8000000,
    changeRate: -12.5,
  },
};

// 변화율 없음
export const NoChange: Story = {
  args: {
    totalAmount: 10450000,
    changeRate: 0,
  },
};

// 다양한 금액과 변화율 조합
export const Variations: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
      <TotalAssets totalAmount={10450000} changeRate={4.5} />
      <TotalAssets totalAmount={50000000} changeRate={8.2} />
      <TotalAssets totalAmount={2000000} changeRate={-2.5} />
      <TotalAssets totalAmount={15000000} changeRate={0} />
    </div>
  ),
};

