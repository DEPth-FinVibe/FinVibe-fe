import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Discussion, AIAnalysisBox, TrendSection, PopularDiscussionSection } from "@/components";
import Chip from "@/components/Chip";
import BackIcon from "@/assets/svgs/BackIcon";
import LikeIcon from "@/assets/svgs/LikeIcon";
import CommentIcon from "@/assets/svgs/CommentIcon";
import ShareIcon from "@/assets/svgs/ShareIcon";
import { cn } from "@/utils/cn";
import { newsApi, KEYWORD_LABEL_MAP, type NewsDetailResponse, discussionApi, type DiscussionResponse } from "@/api/news";
import { useAuthStore } from "@/store/useAuthStore";

// 상대 시간 표시
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

const NewsDetailPage = () => {
  const navigate = useNavigate();
  const { newsId } = useParams<{ newsId: string }>();
  const user = useAuthStore((s) => s.user);
  const [commentInput, setCommentInput] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [sortOrder, setSortOrder] = useState<"최신순" | "인기순">("최신순");
  const [postingComment, setPostingComment] = useState(false);

  // 뉴스 상세
  const [detail, setDetail] = useState<NewsDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 키워드 트렌드
  const [trends, setTrends] = useState<{ tag: string; count: number }[]>([]);

  // 인기 토론 (사이드바)
  const [popularDiscussions, setPopularDiscussions] = useState<{ title: string; commentCount: number }[]>([]);

  // 이 뉴스의 토론 목록
  const [discussions, setDiscussions] = useState<DiscussionResponse[]>([]);
  const [discussionsLoading, setDiscussionsLoading] = useState(true);

  // 뉴스 상세 로드
  useEffect(() => {
    if (!newsId) return;
    let cancelled = false;
    setDetailLoading(true);
    newsApi.getNewsDetail(Number(newsId)).then((data) => {
      if (!cancelled) {
        setDetail(data);
        setLiked(Boolean(data.isLiked ?? data.likedByMe));
        setLikeCount(data.likeCount ?? 0);
      }
    }).catch(() => {
      if (!cancelled) setDetail(null);
    }).finally(() => {
      if (!cancelled) setDetailLoading(false);
    });
    return () => { cancelled = true; };
  }, [newsId]);

  // 이 뉴스에 대한 토론 로드 (전체 목록에서 newsId로 필터)
  useEffect(() => {
    if (!newsId) return;
    let cancelled = false;
    setDiscussionsLoading(true);
    discussionApi.getDiscussions("LATEST").then((data) => {
      if (!cancelled) {
        const filtered = data.filter((d) => d.newsId === Number(newsId));
        setDiscussions(filtered);
      }
    }).catch(() => {
      if (!cancelled) setDiscussions([]);
    }).finally(() => {
      if (!cancelled) setDiscussionsLoading(false);
    });
    return () => { cancelled = true; };
  }, [newsId]);

  // 키워드 트렌드 + 인기 토론 로드
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

  const handleToggleLike = async () => {
    if (!newsId) return;
    try {
      await newsApi.toggleNewsLike(Number(newsId));
      setLiked((prev) => {
        setLikeCount((countPrev) => Math.max(0, countPrev + (prev ? -1 : 1)));
        return !prev;
      });
    } catch {
      // 실패 시 무시
    }
  };

  // 토론 작성 (이 뉴스에 대해)
  const handlePostDiscussion = async () => {
    if (!commentInput.trim() || postingComment || !newsId) return;
    setPostingComment(true);
    try {
      const created = await discussionApi.createDiscussion(Number(newsId), commentInput.trim());
      setDiscussions((prev) => [created, ...prev]);
      setCommentInput("");
    } catch {
      // 실패 시 무시
    } finally {
      setPostingComment(false);
    }
  };

  // 좋아요 토글 상태 (세션 내)
  const [likedDiscussionIds, setLikedDiscussionIds] = useState<Set<number>>(new Set());
  const [likedCommentIds, setLikedCommentIds] = useState<Set<number>>(new Set());

  // 토론 좋아요 토글
  const handleDiscussionLike = async (discussionId: number) => {
    try {
      await discussionApi.toggleDiscussionLike(discussionId);
      const wasLiked = likedDiscussionIds.has(discussionId);
      setLikedDiscussionIds((prev) => {
        const next = new Set(prev);
        if (wasLiked) next.delete(discussionId);
        else next.add(discussionId);
        return next;
      });
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === discussionId
            ? { ...d, likeCount: Math.max(0, d.likeCount + (wasLiked ? -1 : 1)) }
            : d
        )
      );
    } catch {}
  };

  // 댓글 좋아요 토글
  const handleCommentLike = async (commentId: number, discussionId: number) => {
    try {
      await discussionApi.toggleCommentLike(commentId);
      const wasLiked = likedCommentIds.has(commentId);
      setLikedCommentIds((prev) => {
        const next = new Set(prev);
        if (wasLiked) next.delete(commentId);
        else next.add(commentId);
        return next;
      });
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === discussionId
            ? {
                ...d,
                comments: d.comments.map((c) =>
                  c.id === commentId
                    ? { ...c, likeCount: Math.max(0, c.likeCount + (wasLiked ? -1 : 1)) }
                    : c
                ),
              }
            : d
        )
      );
    } catch {}
  };

  // 토론 삭제
  const handleDeleteDiscussion = async (discussionId: number) => {
    if (!confirm("토론을 삭제하시겠습니까?")) return;
    try {
      await discussionApi.deleteDiscussion(discussionId);
      setDiscussions((prev) => prev.filter((d) => d.id !== discussionId));
    } catch {}
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number, discussionId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await discussionApi.deleteComment(commentId);
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === discussionId
            ? { ...d, comments: d.comments.filter((c) => c.id !== commentId) }
            : d
        )
      );
    } catch {}
  };

  // 정렬된 토론 목록
  const sortedDiscussions = useMemo(() => {
    const copy = [...discussions];
    if (sortOrder === "인기순") {
      copy.sort((a, b) => b.likeCount - a.likeCount);
    } else {
      copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return copy;
  }, [discussions, sortOrder]);

  // 관련 뉴스 날짜 포맷
  const formatNewsDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return { date: `${year}.${month}.${day}`, time: `${hours}:${mins}` };
  };

  const detailTitle = detail?.title ?? detail?.categoryName ?? "제목 없음";
  const detailContent = detail?.content ?? "뉴스 본문이 없습니다.";
  const detailProvider = detail?.provider ?? "출처 정보 없음";
  const detailPublishedAt = detail?.publishedAt ?? detail?.createdAt;
  const detailTimeLabel = detailPublishedAt ? formatRelativeTime(detailPublishedAt) : "생성일 없음";
  const detailDiscussionCount = detail?.discussionCount ?? discussions.length;

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
            <span className="text-Body_M_Light">뉴스 목록 돌아가기</span>
          </button>

          {detailLoading && (
            <div className="flex justify-center items-center py-16 text-gray-400 text-sm">
              뉴스를 불러오는 중...
            </div>
          )}

          {!detailLoading && !detail && (
            <div className="flex justify-center items-center py-16 text-gray-400 text-sm">
              뉴스를 찾을 수 없습니다
            </div>
          )}

          {!detailLoading && detail && (
            <>
              {/* 뉴스 상세 카드 */}
              <article className="rounded-lg p-7 bg-white">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    {detail.categoryName && (
                      <span className="text-Body_M_Light text-gray-500">
                        ({detail.categoryName})
                      </span>
                    )}
                    <span className="text-Subtitle_L_Medium text-black">{detailTitle}</span>
                  </div>
                  <span className="text-Body_S_Light text-gray-400">
                    {detailProvider} · {detailTimeLabel}
                  </span>
                </div>

                <div className="mb-6 whitespace-pre-wrap text-Body_L_Light text-black">
                  {detailContent}
                </div>

                {/* AI 분석 */}
                {detail.analysis && (
                  <AIAnalysisBox
                    content={detail.analysis}
                    showColon
                    className="mb-6"
                  />
                )}

                {/* 관련 뉴스 목록 */}
                {detail.news && detail.news.length > 0 && (
                  <div className="flex flex-col gap-3 mb-6">
                    <h4 className="text-Subtitle_S_Medium text-black">관련 뉴스</h4>
                    {detail.news.map((item, idx) => {
                      const { date, time } = formatNewsDate(item.publishedAt);
                      return (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <p className="text-Body_L_Light text-black mb-1">{item.title}</p>
                          <p className="text-Body_S_Light text-gray-400">
                            ~{item.provider} {date} {time}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex gap-12 items-center">
                  <button
                    className="flex items-center gap-5"
                    onClick={handleToggleLike}
                  >
                    <LikeIcon className={cn("w-6 h-6", liked && "text-red-500")} />
                    <span className="text-Subtitle_S_Regular text-black">
                      {likeCount}
                    </span>
                  </button>
                  <div className="flex items-center gap-5">
                    <CommentIcon className="w-6 h-6" color="#1D1E20" />
                    <span className="text-Subtitle_S_Regular text-black">
                      {detailDiscussionCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-5">
                    <ShareIcon className="w-6 h-6" />
                    <span className="text-Subtitle_S_Regular text-black">공유</span>
                  </div>
                </div>
              </article>

              {/* 토론 게시판 */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-Subtitle_M_Medium text-black">토론 게시판</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsAnonymous(false)}
                      className={cn(
                        "text-Body_M_Light",
                        !isAnonymous ? "text-black" : "text-gray-400"
                      )}
                    >
                      실명
                    </button>
                    <button
                      onClick={() => setIsAnonymous(true)}
                      className={cn(
                        "text-Body_M_Light",
                        isAnonymous ? "text-black" : "text-gray-400"
                      )}
                    >
                      익명
                    </button>
                  </div>
                </div>

                {/* 댓글 입력 */}
                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="의견을 남겨주세요"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-Body_M_Light focus:outline-none focus:border-main-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) handlePostDiscussion();
                    }}
                  />
                  <button
                    onClick={handlePostDiscussion}
                    disabled={postingComment || !commentInput.trim()}
                    className="px-6 py-3 bg-main-1 text-white rounded-lg text-Body_M_Light hover:bg-main-2 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {postingComment ? "게시 중..." : "게시하기"}
                  </button>
                </div>

                {/* 정렬 필터 */}
                <div className="flex gap-2 mb-4">
                  <Chip
                    label="최신순"
                    onClick={() => setSortOrder("최신순")}
                    className={cn(
                      "px-3 py-1 rounded-full text-Caption_L_Light cursor-pointer",
                      sortOrder === "최신순"
                        ? "bg-sub-blue text-white border-sub-blue"
                        : "bg-white text-gray-500 border-gray-300"
                    )}
                  />
                  <Chip
                    label="인기순"
                    onClick={() => setSortOrder("인기순")}
                    className={cn(
                      "px-3 py-1 rounded-full text-Caption_L_Light cursor-pointer",
                      sortOrder === "인기순"
                        ? "bg-sub-blue text-white border-sub-blue"
                        : "bg-white text-gray-500 border-gray-300"
                    )}
                  />
                </div>

                {/* 토론 + 댓글 목록 */}
                <div className="border-t border-gray-200">
                  {discussionsLoading && (
                    <div className="flex justify-center items-center py-8 text-gray-400 text-sm">
                      토론을 불러오는 중...
                    </div>
                  )}
                  {!discussionsLoading && sortedDiscussions.length === 0 && (
                    <div className="flex justify-center items-center py-8 text-gray-400 text-sm">
                      아직 토론이 없습니다. 첫 번째 의견을 남겨보세요!
                    </div>
                  )}
                  {!discussionsLoading && sortedDiscussions.map((discussion) => (
                    <div key={discussion.id}>
                      <Discussion
                        author={discussion.userId === user?.userId ? (user.nickname || "나") : "사용자"}
                        time={formatRelativeTime(discussion.createdAt)}
                        content={discussion.content}
                        likeCount={discussion.likeCount}
                        liked={likedDiscussionIds.has(discussion.id)}
                        commentCount={discussion.comments.length}
                        onLike={() => handleDiscussionLike(discussion.id)}
                        onComment={() => navigate(`/discussion/${discussion.id}`)}
                        onDelete={discussion.userId === user?.userId ? () => handleDeleteDiscussion(discussion.id) : undefined}
                      />
                      {/* 해당 토론의 댓글들 */}
                      {discussion.comments.length > 0 && (
                        <div className="pl-12 border-l-2 border-gray-100 ml-5">
                          {discussion.comments.map((comment) => (
                            <Discussion
                              key={comment.id}
                              author={comment.userId === user?.userId ? (user.nickname || "나") : "사용자"}
                              time={formatRelativeTime(comment.createdAt)}
                              content={comment.content}
                              likeCount={comment.likeCount}
                              liked={likedCommentIds.has(comment.id)}
                              onLike={() => handleCommentLike(comment.id, discussion.id)}
                              onDelete={comment.userId === user?.userId ? () => handleDeleteComment(comment.id, discussion.id) : undefined}
                            />
                          ))}
                        </div>
                      )}
                    </div>
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

export default NewsDetailPage;
