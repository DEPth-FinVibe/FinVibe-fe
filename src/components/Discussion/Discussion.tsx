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
  /** 댓글 수 */
  commentCount?: number;
  /** 추가 스타일 */
  className?: string;
  /** 좋아요 클릭 핸들러 */
  onLike?: () => void;
  /** 댓글 클릭 핸들러 */
  onComment?: () => void;
  /** 신고하기 클릭 핸들러 */
  onReport?: () => void;
}

export const Discussion = ({
  author,
  time,
  content,
  likeCount = 0,
  commentCount = 0,
  className,
  onLike,
  onComment,
  onReport,
}: DiscussionProps) => {
  return (
    <article
      className={cn(
        "flex flex-col w-full items-start gap-5 px-10 py-7 relative border-b-2 border-gray-300 border-l-0 border-r-0 border-t-0 border-solid",
        className
      )}
      role="article"
      aria-label={`토론: ${author}`}
    >
      {/* 프로필 아이콘, 작성자 정보, 내용 */}
      <div className="flex flex-col gap-2 items-start relative self-stretch w-full">
        <UserIcon className="w-6 h-[26px] text-black" ariaLabel="프로필" />
        <h3 className="text-Subtitle_L_Medium text-black whitespace-pre-wrap">
          {author}
        </h3>
        <p className="text-Body_L_Light text-black whitespace-pre-wrap">
          {time}
        </p>
        <p className="text-Body_L_Light text-black whitespace-pre-wrap">
          {content}
        </p>
      </div>

      {/* 하단 액션: 좋아요, 댓글, 신고하기 */}
      <div className="flex gap-12 items-center relative self-stretch">
        <button
          type="button"
          onClick={onLike}
          className="flex gap-5 items-center cursor-pointer"
          aria-label="좋아요"
        >
          <LikeIcon className="w-6 h-[26px]" />
          <span className="text-Subtitle_S_Regular text-black">
            {likeCount.toString().padStart(2, "0")}
          </span>
        </button>
        <button
          type="button"
          onClick={onComment}
          className="flex gap-5 items-center cursor-pointer"
          aria-label="댓글"
        >
          <CommentIcon className="w-6 h-[26px]" color="#000000" />
          <span className="text-Subtitle_S_Regular text-black">
            {commentCount.toString().padStart(2, "0")}
          </span>
        </button>
        <button
          type="button"
          onClick={onReport}
          className="cursor-pointer"
          aria-label="신고하기"
        >
          <span className="text-Subtitle_S_Regular text-gray-300" >
            신고하기
          </span>
        </button>
      </div>
    </article>
  );
};

