import type { Meta, StoryObj } from "@storybook/react";
import { PortfolioPerformance } from "./PortfolioPerformance";

const meta = {
  title: "Components/PortfolioPerformance",
  component: PortfolioPerformance,
  parameters: {
    // centered는 Canvas 내부 패딩/오버플로우로 좌우가 잘려 보일 수 있어 fullscreen으로 고정
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    title: "포트폴리오 성과",
    xLabels: ["월", "화", "수", "목", "금", "토", "일"],
    values: [10_000_000, 10_150_000, 10_100_000, 10_300_000, 10_250_000, 10_400_000, 10_450_000],
    yMax: 12_000_000,
    yStep: 3_000_000,
  },
  argTypes: {
    title: { control: "text" },
    xLabels: { control: "object" },
    values: { control: "object" },
    yMax: { control: "number" },
    yStep: { control: "number" },
    lineColor: { control: "color" },
    className: { control: "text" },
  },
} satisfies Meta<typeof PortfolioPerformance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 1440, margin: "0 auto", padding: "24px", overflow: "visible" }}>
      <PortfolioPerformance {...args} />
    </div>
  ),
};


