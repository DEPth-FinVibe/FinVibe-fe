import ChartIcon from "@/assets/svgs/ChartIcon";
import CommentIcon from "@/assets/svgs/CommentIcon";
import type { TabOption } from "./SwitchBar";

export type NewsTabType = "news" | "discussion";

export const NEWS_TABS: [TabOption<NewsTabType>, TabOption<NewsTabType>] = [
  {
    id: "news",
    label: "경제 뉴스",
    icon: (color) => <ChartIcon className="w-5 h-5" color={color} />,
  },
  {
    id: "discussion",
    label: "토론 게시판",
    icon: (color) => <CommentIcon className="w-5 h-5" color={color} />,
  },
];
