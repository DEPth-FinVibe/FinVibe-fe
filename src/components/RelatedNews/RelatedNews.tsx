import { cn } from "@/utils/cn";

export interface RelatedNewsProps {
  /** 뉴스 출처 및 시간 (예: "매일경제 · 2시간 전") */
  sourceAndTime: string;
  /** 뉴스 제목 */
  title: string;
  /** 추가 스타일 */
  className?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

export const RelatedNews = ({
  sourceAndTime,
  title,
  className,
  onClick,
}: RelatedNewsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 px-5 py-4 border border-sub-blue rounded-lg w-full",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${sourceAndTime}: ${title}`}
    >
      {/* 출처 및 시간 */}
      <p className="text-Body_M_Light w-full" style={{ color: "#747474" }}>
        {sourceAndTime}
      </p>
      {/* 뉴스 제목 */}
      <p className="text-Subtitle_S_Regular text-sub-blue w-full">
        {title}
      </p>
    </div>
  );
};

export default RelatedNews;

