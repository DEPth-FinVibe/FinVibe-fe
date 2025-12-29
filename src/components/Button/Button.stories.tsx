import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Figma 디자인 시스템에 기반한 Button 컴포넌트입니다. Primary(활성)와 Secondary(비활성) 두 가지 변형을 지원합니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "버튼의 스타일 변형 (primary: 활성, secondary: 비활성)",
      table: {
        type: { summary: "ButtonVariant" },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "버튼의 크기 (s, m, l)",
      table: {
        type: { summary: "ButtonSize" },
        defaultValue: { summary: "medium" },
      },
    },
    fullWidth: {
      control: "boolean",
      description: "버튼 전체 너비 사용 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    loading: {
      control: "boolean",
      description: "로딩 상태",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    children: {
      control: "text",
      description: "버튼 내용",
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary 버튼 (활성 상태)
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "취소",
  },
};

// Secondary 버튼 (비활성 상태)
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "취소",
  },
};

// 두 가지 변형 비교
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
      <Button variant="secondary">취소</Button>
      <Button variant="primary">취소</Button>
    </div>
  ),
};

// 크기 변형 (s, m, l)
export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Button variant="primary" size="small">
        중복확인
      </Button>
      <Button variant="primary" size="medium">
        취소
      </Button>
      <Button variant="primary" size="large" rightIcon={<span>&gt;</span>}>
        다음
      </Button>
    </div>
  ),
};

// 크기와 변형 조합
export const SizesWithVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Button variant="primary" size="small">
          Small
        </Button>
        <Button variant="primary" size="medium">
          Medium
        </Button>
        <Button variant="primary" size="large">
          Large
        </Button>
      </div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Button variant="secondary" size="small">
          Small
        </Button>
        <Button variant="secondary" size="medium">
          Medium
        </Button>
        <Button variant="secondary" size="large">
          Large
        </Button>
      </div>
    </div>
  ),
};

// 전체 너비
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: "취소",
  },
  parameters: {
    layout: "padded",
  },
};

// 로딩 상태
export const Loading: Story = {
  args: {
    loading: true,
    children: "취소",
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "취소",
  },
};

// 아이콘과 함께 사용
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
      <Button leftIcon={<span>✓</span>}>확인</Button>
      <Button variant="secondary" rightIcon={<span>×</span>}>
        취소
      </Button>
    </div>
  ),
};

// 모든 상태 조합
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: "12px" }}>
        <Button variant="primary">Primary</Button>
        <Button variant="primary" loading>
          Loading
        </Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary" loading>
          Loading
        </Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
};


