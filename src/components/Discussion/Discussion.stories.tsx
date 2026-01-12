import type { Meta, StoryObj } from "@storybook/react";
import { Discussion } from "@/components/Discussion/Discussion";

const meta = {
  title: "Components/Discussion",
  component: Discussion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "토론 댓글을 표시하는 컴포넌트입니다. 프로필 아이콘, 작성자 정보, 작성 시간, 댓글 내용, 좋아요, 댓글, 신고하기 기능을 포함합니다.",
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
    author: {
      control: { type: "text" },
      description: "게시자 이름",
    },
    time: {
      control: { type: "text" },
      description: "작성 시간 (예: 'XX시간 전 작성')",
    },
    content: {
      control: { type: "text" },
      description: "댓글 내용",
    },
    likeCount: {
      control: { type: "number", min: 0, step: 1 },
      description: "좋아요 수",
    },
    commentCount: {
      control: { type: "number", min: 0, step: 1 },
      description: "댓글 수",
    },
    onLike: {
      action: "onLike",
      description: "좋아요 클릭 핸들러",
    },
    onComment: {
      action: "onComment",
      description: "댓글 클릭 핸들러",
    },
    onReport: {
      action: "onReport",
      description: "신고하기 클릭 핸들러",
    },
  },
} satisfies Meta<typeof Discussion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    author: "게시자 이름_1",
    time: "XX시간 전 작성",
    content: "댓글_1",
    likeCount: 0,
    commentCount: 0,
    onLike: () => console.log("좋아요 클릭"),
    onComment: () => console.log("댓글 클릭"),
    onReport: () => console.log("신고하기 클릭"),
  },
};

export const WithEngagement: Story = {
  args: {
    author: "투자왕",
    time: "2시간 전 작성",
    content: "좋은 정보 감사합니다!",
    likeCount: 24,
    commentCount: 12,
    onLike: () => console.log("좋아요 클릭"),
    onComment: () => console.log("댓글 클릭"),
    onReport: () => console.log("신고하기 클릭"),
  },
};

export const HighEngagement: Story = {
  args: {
    author: "프로투자자",
    time: "5시간 전 작성",
    content: "이 내용에 대해 더 자세히 알고 싶습니다.",
    likeCount: 156,
    commentCount: 89,
    onLike: () => console.log("좋아요 클릭"),
    onComment: () => console.log("댓글 클릭"),
    onReport: () => console.log("신고하기 클릭"),
  },
};

