import { cn } from "@/utils/cn";
import LikeIcon from "@/assets/svgs/LikeIcon";
import CommentIcon from "@/assets/svgs/CommentIcon";
import UserIcon from "@/assets/svgs/UserIcon";

export interface DiscussionProps {
  /** 게시자 이름 */
  author: string;
  /** 작성 시간 (예: "XX시간 전 작성") */
  time: string;
  /** 댓글 내용 */
  content: string;
  /** 좋아요 수 */
  likeCount?: number;
  /** 좋아요 눌렀는지 여부 */
  liked?: boolean;
  /** 댓글 수 */
  commentCount?: number;
  /** 추가 스타일 */
  className?: string;
  /** 좋아요 클릭 핸들러 */
  onLike?: () => void;
  /** 댓글 클릭 핸들러 (없으면 댓글 아이콘 숨김) */
  onComment?: () => void;
  /** 삭제 클릭 핸들러 (없으면 삭제 버튼 숨김) */
  onDelete?: () => void;
  /** 신고하기 클릭 핸들러 */
  onReport?: () => void;
}

function formatCount(n: number): string {
  return n > 99 ? "99+" : String(n);
}

export const Discussion = ({
  author,
  time,
  content,
  likeCount = 0,
  liked = false,
  commentCount = 0,
  className,
  onLike,
  onComment,
  onDelete,
  onReport,
}: DiscussionProps) => {
  return (
    <article
      className={cn(
        "flex flex-col w-full items-start gap-4 px-10 py-7 relative border-b border-gray-200 bg-white",
        className
      )}
      role="article"
      aria-label={`토론: ${author}`}
    >
      {/* 프로필 및 작성자 정보 */}
      <div className="flex gap-4 items-start relative self-stretch w-full">
        <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
          <UserIcon className="size-6 text-gray-400" ariaLabel="프로필" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-Subtitle_M_Medium text-black font-bold">
            {author}
          </h3>
          <p className="text-Caption_L_Light text-gray-400">
            {time}
          </p>
        </div>
      </div>

      {/* 내용 */}
      <p className="text-Body_M_Light text-black whitespace-pre-wrap self-stretch">
        {content}
      </p>

      {/* 하단 액션: 좋아요, 댓글, 삭제/신고 */}
      <div className="flex justify-between items-center relative self-stretch w-full mt-2">
        <div className="flex gap-8 items-center">
          <button
            type="button"
            onClick={onLike}
            className={cn(
              "flex gap-2 items-center cursor-pointer hover:opacity-70 transition-opacity",
              liked ? "text-red-500" : "text-black"
            )}
            aria-label="좋아요"
          >
            <LikeIcon className="size-5" />
            <span className="text-Body_M_Light">
              {formatCount(likeCount)}
            </span>
          </button>
          {onComment && (
            <button
              type="button"
              onClick={onComment}
              className="flex gap-2 items-center cursor-pointer hover:opacity-70 transition-opacity"
              aria-label="댓글"
            >
              <CommentIcon className="size-5" color="#000000" />
              <span className="text-Body_M_Light text-black">
                {formatCount(commentCount)}
              </span>
            </button>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="cursor-pointer hover:underline transition-all"
              aria-label="삭제"
            >
              <span className="text-Body_S_Light text-red-400">삭제</span>
            </button>
          )}
          {onReport && (
            <button
              type="button"
              onClick={onReport}
              className="cursor-pointer hover:underline transition-all"
              aria-label="신고하기"
            >
              <span className="text-Body_S_Light text-gray-400">신고하기</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
