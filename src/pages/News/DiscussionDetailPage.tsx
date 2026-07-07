import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Discussion, TrendSection, PopularDiscussionSection } from "@/components";
import BackIcon from "@/assets/svgs/BackIcon";
import LikeIcon from "@/assets/svgs/LikeIcon";
import CommentIcon from "@/assets/svgs/CommentIcon";
import { discussionApi, type DiscussionResponse, type CommentResponse } from "@/api/news";
import { newsApi, KEYWORD_LABEL_MAP } from "@/api/news";
import { useAuthStore } from "@/store/useAuthStore";

function formatRelativeTime(dateStr: string): string {
  const time = new Date(dateStr).getTime();
  if (Number.isNaN(time)) return "생성일 없음";

  const diff = Date.now() - time;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

const DiscussionDetailPage = () => {
  const navigate = useNavigate();
  const { discussionId } = useParams<{ discussionId: string }>();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [discussionId]);

  const [discussion, setDiscussion] = useState<DiscussionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 댓글 좋아요 토글 상태
  const [likedCommentIds, setLikedCommentIds] = useState<Set<number>>(new Set());

  // 키워드 트렌드
  const [trends, setTrends] = useState<{ tag: string; count: number }[]>([]);
  // 인기 토론 (사이드바)
  const [popularDiscussions, setPopularDiscussions] = useState<{ title: string; commentCount: number }[]>([]);

  // 토론 상세 로드 (전체 목록에서 찾기)
  useEffect(() => {
    if (!discussionId) return;
    let cancelled = false;
    setLoading(true);

    discussionApi.getDiscussions("LATEST").then((data) => {
      if (cancelled) return;
      const found = data.find((d) => d.id === Number(discussionId));
      if (found) {
        setDiscussion(found);
        setLikeCount(found.likeCount);
        setComments(found.comments);
      } else {
        setDiscussion(null);
      }
    }).catch(() => {
      if (!cancelled) setDiscussion(null);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [discussionId]);

  // 사이드바 데이터 로드
  useEffect(() => {
    let cancelled = false;
    newsApi.getKeywordTrends().then((data) => {
      if (!cancelled) {
        setTrends(
          data.map((item) => ({
            tag: `#${KEYWORD_LABEL_MAP[item.keyword] ?? item.keyword}`,
            count: item.count,
          }))
        );
      }
    }).catch(() => {});

    discussionApi.getDiscussions("POPULAR").then((data) => {
      if (!cancelled) {
        setPopularDiscussions(
          data.slice(0, 5).map((d) => ({
            title: d.content.length > 30 ? d.content.slice(0, 30) + "..." : d.content,
            commentCount: d.comments.length,
          }))
        );
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleBack = () => {
    navigate("/news");
  };

  const [likingDiscussion, setLikingDiscussion] = useState(false);
  const [likingCommentIds, setLikingCommentIds] = useState<Set<number>>(new Set());

  const handleToggleLike = async () => {
    if (!discussionId || likingDiscussion) return;
    setLikingDiscussion(true);
    try {
      await discussionApi.toggleDiscussionLike(Number(discussionId));
      const wasLiked = liked;
      setLiked(!wasLiked);
      setLikeCount((prev) => Math.max(0, prev + (wasLiked ? -1 : 1)));
    } catch {
      // 좋아요 실패 시 낙관적 변경 없이 현재 상태 유지
    } finally {
      setLikingDiscussion(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentInput.trim() || postingComment || !discussionId) return;
    setPostingComment(true);
    try {
      const created = await discussionApi.createComment(Number(discussionId), commentInput.trim());
      setComments((prev) => [...prev, created]);
      setCommentInput("");
    } catch {
      // 실패 시 무시
    } finally {
      setPostingComment(false);
    }
  };

  const handleCommentLike = async (commentId: number) => {
    if (likingCommentIds.has(commentId)) return;
    setLikingCommentIds((prev) => new Set(prev).add(commentId));
    try {
      await discussionApi.toggleCommentLike(commentId);
      const wasLiked = likedCommentIds.has(commentId);
      setLikedCommentIds((prev) => {
        const next = new Set(prev);
        if (wasLiked) next.delete(commentId);
        else next.add(commentId);
        return next;
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likeCount: Math.max(0, c.likeCount + (wasLiked ? -1 : 1)) }
            : c
        )
      );
    } catch {
      // 좋아요 실패 시 낙관적 변경 없이 현재 상태 유지
    } finally {
      setLikingCommentIds((prev) => { const next = new Set(prev); next.delete(commentId); return next; });
    }
  };

  const handleDeleteDiscussion = async () => {
    if (!discussionId || !confirm("토론을 삭제하시겠습니까?")) return;
    try {
      await discussionApi.deleteDiscussion(Number(discussionId));
      navigate("/news");
    } catch {
      // 삭제 실패 시 현재 화면 유지
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await discussionApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      // 삭제 실패 시 현재 댓글 목록 유지
    }
  };

  const authorName = (userId: string) => {
    return userId === user?.userId ? (user.nickname || "나") : "사용자";
  };

  const isMyDiscussion = discussion?.userId === user?.userId;

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="flex px-32 py-10 gap-8">
        {/* 왼쪽: 메인 콘텐츠 */}
        <section className="flex-1 flex flex-col gap-6">
          {/* 뒤로가기 */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors w-fit"
          >
            <BackIcon className="w-5 h-5" />
            <span className="text-Body_M_Light">토론 목록 돌아가기</span>
          </button>

          {loading && (
            <div className="flex justify-center items-center py-16 text-gray-400 text-sm">
              토론을 불러오는 중...
            </div>
          )}

          {!loading && !discussion && (
            <div className="flex justify-center items-center py-16 text-gray-400 text-sm">
              토론을 찾을 수 없습니다
            </div>
          )}

          {!loading && discussion && (
            <>
              {/* 토론 상세 카드 (기사처럼 표시) */}
              <article className="rounded-lg p-7 bg-white">
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-Body_S_Light text-main-1">토론</span>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      <span className="text-gray-400 text-sm">👤</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-Subtitle_M_Medium text-black font-bold">
                        {authorName(discussion.userId)}
                      </span>
                      <span className="text-Caption_L_Light text-gray-400">
                        {formatRelativeTime(discussion.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6 whitespace-pre-wrap text-Body_L_Light text-black">
                  {discussion.content}
                </div>

                {/* 액션 버튼 */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-12 items-center">
                    <button
                      className={`flex items-center gap-5 ${liked ? "text-red-500" : "text-black"}`}
                      onClick={handleToggleLike}
                    >
                      <LikeIcon className="w-6 h-6" />
                      <span className="text-Subtitle_S_Regular">
                        {likeCount}
                      </span>
                    </button>
                    <div className="flex items-center gap-5 text-black">
                      <CommentIcon className="w-6 h-6" color="#1D1E20" />
                      <span className="text-Subtitle_S_Regular">
                        {comments.length}
                      </span>
                    </div>
                  </div>
                  {isMyDiscussion && (
                    <button
                      onClick={handleDeleteDiscussion}
                      className="text-Body_S_Light text-red-400 hover:underline"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </article>

              {/* 댓글 게시판 */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-Subtitle_M_Medium text-black">댓글</h3>
                </div>

                {/* 댓글 입력 */}
                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="댓글을 남겨주세요"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-Body_M_Light focus:outline-none focus:border-main-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) handlePostComment();
                    }}
                  />
                  <button
                    onClick={handlePostComment}
                    disabled={postingComment || !commentInput.trim()}
                    className="px-6 py-3 bg-main-1 text-white rounded-lg text-Body_M_Light hover:bg-main-2 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {postingComment ? "게시 중..." : "게시하기"}
                  </button>
                </div>

                {/* 댓글 목록 */}
                <div className="border-t border-gray-200">
                  {comments.length === 0 && (
                    <div className="flex justify-center items-center py-8 text-gray-400 text-sm">
                      아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                    </div>
                  )}
                  {comments.map((comment) => (
                    <Discussion
                      key={comment.id}
                      author={authorName(comment.userId)}
                      time={formatRelativeTime(comment.createdAt)}
                      content={comment.content}
                      likeCount={comment.likeCount}
                      liked={likedCommentIds.has(comment.id)}
                      onLike={() => handleCommentLike(comment.id)}
                      onDelete={comment.userId === user?.userId ? () => handleDeleteComment(comment.id) : undefined}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        {/* 오른쪽: 사이드바 */}
        <aside className="w-1/4 shrink-0 flex flex-col gap-8">
          <TrendSection trends={trends.length > 0 ? trends : []} />
          <PopularDiscussionSection discussions={popularDiscussions} />
        </aside>
      </main>
    </div>
  );
};

export default DiscussionDetailPage;
