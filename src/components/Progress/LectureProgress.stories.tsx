import type { Meta, StoryObj } from "@storybook/react";
import { LectureProgress } from "@/components/Progress/LectureProgress";

const meta = {
  title: "Components/Progress/LectureProgress",
  component: LectureProgress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    completedLectures: {
      control: { type: "number", min: 0, max: 100, step: 1 },
      description: "완료한 강의 수",
    },
    totalLectures: {
      control: { type: "number", min: 1, max: 100, step: 1 },
      description: "전체 강의 수",
    },
  },
} satisfies Meta<typeof LectureProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    completedLectures: 8,
    totalLectures: 13,
  },
};

export const LowProgress: Story = {
  args: {
    completedLectures: 2,
    totalLectures: 10,
  },
};

export const HalfProgress: Story = {
  args: {
    completedLectures: 5,
    totalLectures: 10,
  },
};

export const HighProgress: Story = {
  args: {
    completedLectures: 12,
    totalLectures: 13,
  },
};

export const Completed: Story = {
  args: {
    completedLectures: 10,
    totalLectures: 10,
  },
};

