import type { Meta, StoryObj } from "@storybook/react";
import { MyPortfolio } from "@/components/MyPortfolio";
import GraphIcon from "@/assets/svgs/GraphIcon";
import ChartIcon from "@/assets/svgs/ChartIcon";
import LineChartIcon from "@/assets/svgs/LineChartIcon";

const CARD_WIDTH = 615; // Figma frame 기준 폭

const StoryWrap = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: `${CARD_WIDTH}px` }}>{children}</div>
);

const meta = {
  title: "Components/MyPortfolio",
  component: MyPortfolio,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "마이페이지에서 사용자의 포트폴리오 성과를 차트로 표시하는 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "포트폴리오 제목",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "주력 성장주" },
      },
    },
    changeRate: {
      control: "number",
      description: "변화율 (퍼센트)",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "15.2" },
      },
    },
    chartData: {
      control: "object",
      description: "차트 데이터 (항상 12개 기준으로 렌더링됨)",
      table: {
        type: { summary: "number[]" },
      },
    },
    icon: {
      control: false,
      description: "아이콘 컴포넌트",
      table: {
        type: { summary: "React.ComponentType<{ className?: string }>" },
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
    title: "주력 성장주",
    changeRate: 15.2,
    icon: GraphIcon,
  },
} satisfies Meta<typeof MyPortfolio>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기준 스토리 (디자인 확인용)
 * - 현재 사용자가 말한 것처럼 실제 화면에 가장 유사한 조합을 “대표”로 둡니다.
 */
export const Default: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
      <StoryWrap>
        <MyPortfolio
          title="주력 성장주"
          changeRate={15.2}
          chartData={[50, 80, 60, 90, 70, 85, 75, 65, 55, 45, 35, 25]}
          icon={GraphIcon}
        />
      </StoryWrap>

      <StoryWrap>
        <MyPortfolio
          title="안정형 포트폴리오"
          changeRate={5.2}
          chartData={[30, 42, 38, 40, 44, 48, 46, 49, 50, 52, 51, 54]}
          icon={ChartIcon}
        />
      </StoryWrap>

      <StoryWrap>
        <MyPortfolio
          title="고위험 포트폴리오"
          changeRate={-8.5}
          chartData={[90, 75, 82, 60, 70, 55, 68, 50, 58, 45, 52, 40]}
          icon={LineChartIcon}
        />
      </StoryWrap>
    </div>
  ),
};

// (선택) 엣지 케이스 확인용 스토리들은 필요해질 때 다시 추가하는 게 깔끔합니다.

