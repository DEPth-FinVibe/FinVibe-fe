import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NewsCard, Discussion, TrendSection, PopularDiscussionSection, Button, SwitchBar } from "@/components";
import { NEWS_TABS, type NewsTabType } from "@/components/SwitchBar/SwitchBar";
import TextField from "@/components/TextField";
import { cn } from "@/utils/cn";
import SearchIcon from "@/assets/svgs/SearchIcon";
import UserIcon from "@/assets/svgs/UserIcon";
import { newsApi, KEYWORD_LABEL_MAP, type NewsListItem, type NewsSortType, discussionApi, type DiscussionResponse, type DiscussionSortType } from "@/api/news";
import { useAuthStore } from "@/store/useAuthStore";

// 상대 시간 표시 유틸
function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

// economicSignal → NewsCard sentiment 변환
function signalToSentiment(signal: string): "success" | "error" | "neutral" {
  if (signal === "POSITIVE") return "success";
  if (signal === "NEGATIVE") return "error";
  return "neutral";
}


const NewsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<NewsTabType>("news");
  const [sortOrder, setSortOrder] = useState<"인기순" | "최신순">("인기순");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [discussionContent, setDiscussionContent] = useState("");
  const [posting, setPosting] = useState(false);

  // 뉴스 목록
  const [newsList, setNewsList] = useState<NewsListItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  // 키워드 트렌드
  const [trends, setTrends] = useState<{ tag: string; count: number }[]>([]);

  // 토론 목록
  const [discussions, setDiscussions] = useState<DiscussionResponse[]>([]);
  const [discussionsLoading, setDiscussionsLoading] = useState(false);

  // 인기 토론 (사이드바)
  const [popularDiscussions, setPopularDiscussions] = useState<{ title: string; commentCount: number }[]>([]);

  // 뉴스 목록 로드 (뉴스 탭 + sortOrder 변경 시)
  useEffect(() => {
    if (activeTab !== "news") return;
    let cancelled = false;
    setNewsLoading(true);
    const apiSort: NewsSortType = sortOrder === "인기순" ? "POPULAR" : "LATEST";
    newsApi.getNewsList(apiSort).then((data) => {
      if (!cancelled) setNewsList(data);
    }).catch(() => {
      if (!cancelled) setNewsList([]);
    }).finally(() => {
      if (!cancelled) setNewsLoading(false);
    });
    return () => { cancelled = true; };
  }, [sortOrder, activeTab]);

  // 토론 목록 로드 (토론 탭 + sortOrder 변경 시)
  useEffect(() => {
    if (activeTab !== "discussion") return;
    let cancelled = false;
    setDiscussionsLoading(true);
    const apiSort: DiscussionSortType = sortOrder === "인기순" ? "POPULAR" : "LATEST";
    discussionApi.getDiscussions(apiSort).then((data) => {
      if (!cancelled) setDiscussions(data);
    }).catch(() => {
      if (!cancelled) setDiscussions([]);
    }).finally(() => {
      if (!cancelled) setDiscussionsLoading(false);
    });
    return () => { cancelled = true; };
  }, [sortOrder, activeTab]);

  // 키워드 트렌드 + 인기 토론 로드 (1회)
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

  const handleNewsClick = (newsId: number) => {
    navigate(`/news/${newsId}`);
  };

  const handlePostDiscussion = async () => {
    if (!discussionContent.trim() || posting) return;
    setPosting(true);
    try {
      // newsId 0: 일반 토론 (특정 뉴스와 연결되지 않는 경우)
      const created = await discussionApi.createDiscussion(0, discussionContent.trim());
      setDiscussions((prev) => [created, ...prev]);
      setDiscussionContent("");
    } catch {
      // 실패 시 무시
    } finally {
      setPosting(false);
    }
  };

  const handleDiscussionLike = async (discussionId: number) => {
    try {
      await discussionApi.toggleDiscussionLike(discussionId);
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === discussionId ? { ...d, likeCount: d.likeCount + 1 } : d
        )
      );
    } catch {
      // 실패 시 무시
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="flex px-32 py-10 gap-10">
        {/* 왼쪽: 메인 콘텐츠 */}
        <section className="flex-1 flex flex-col gap-6 ">
          {/* 탭 스위치 */}
          <SwitchBar activeTab={activeTab} onChange={setActiveTab} tabs={NEWS_TABS} />

          {activeTab === "news" ? (
            <>
              {/* 안내 문구 */}
              <div className="flex justify-between items-center gap-2 pt-10">
                <p className="text-Body_M_Light text-gray-500">
                  경제 뉴스는 매일 00시(또는 특정 시각) 기준으로 하루 단위 업데이트됨
                </p>

                {/* 필터 - 목록 바로 위에 배치 */}
                <div className="flex justify-center items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-Body_M_Light text-gray-500">뉴스 필터</span>
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => setSortOrder("인기순")}
                        className={cn(
                          "px-3 py-1.5 text-Caption_L_Light flex items-center gap-1",
                          sortOrder === "인기순" ? "bg-gray-100 text-black" : "text-gray-400"
                        )}
                      >
                        <span>♡</span> 인기순
                      </button>
                      <button
                        onClick={() => setSortOrder("최신순")}
                        className={cn(
                          "px-3 py-1.5 text-Caption_L_Light flex items-center gap-1",
                          sortOrder === "최신순" ? "bg-gray-100 text-black" : "text-gray-400"
                        )}
                      >
                        <span>✨</span> 최신순
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 뉴스 목록 */}
              <div className="flex flex-col gap-6">
                {newsLoading && (
                  <div className="flex justify-center items-center py-16 text-gray-400 text-sm">
                    뉴스를 불러오는 중...
                  </div>
                )}
                {!newsLoading && newsList.length === 0 && (
                  <div className="flex justify-center items-center py-16 text-gray-400 text-sm">
                    뉴스가 없습니다
                  </div>
                )}
                {!newsLoading && newsList.map((news) => (
                  <div
                    key={news.id}
                    onClick={() => handleNewsClick(news.id)}
                    className="cursor-pointer"
                  >
                    <NewsCard
                      category={KEYWORD_LABEL_MAP[news.keyword] ?? news.keyword}
                      sentiment={signalToSentiment(news.economicSignal)}
                      time={formatRelativeTime(news.createdAt)}
                      title={news.title}
                      description=""
                      aiAnalysis=""
                      likeCount={0}
                      commentCount={0}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* 토론 게시판 UI */}
              <div className="flex flex-col gap-6 bg-white rounded-lg p-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-Subtitle_L_Medium text-black font-bold">새 토론 시작하기</h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsAnonymous(false)}
                      className={cn(
                        "text-Body_M_Medium transition-colors",
                        !isAnonymous ? "text-black border-b-2 border-black" : "text-gray-400"
                      )}
                    >
                      실명
                    </button>
                    <button
                      onClick={() => setIsAnonymous(true)}
                      className={cn(
                        "text-Body_M_Medium transition-colors",
                        isAnonymous ? "text-black border-b-2 border-black" : "text-gray-400"
                      )}
                    >
                      익명
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={discussionContent}
                    onChange={(e) => setDiscussionContent(e.target.value)}
                    placeholder="투자 아이디어나 궁금한 점.."
                    className="w-full h-32 p-4 border border-main-1 rounded-lg resize-none focus:outline-none text-Body_M_Light"
                  />
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={handlePostDiscussion}
                      disabled={posting || !discussionContent.trim()}
                      className="bg-main-1 text-white px-10 py-2 rounded-lg text-Body_M_Medium hover:bg-main-2 transition-colors border-none"
                    >
                      {posting ? "게시 중..." : "게시하기"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* 토론 필터 및 정렬 */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortOrder("최신순")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-Caption_L_Light transition-colors",
                      sortOrder === "최신순" ? "bg-main-1 text-white shadow-md" : "bg-white text-gray-400"
                    )}
                  >
                    최신순
                  </button>
                  <button
                    onClick={() => setSortOrder("인기순")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-Caption_L_Light transition-colors relative",
                      sortOrder === "인기순" ? "bg-main-1 text-white shadow-md" : "bg-white text-gray-400"
                    )}
                  >
                    인기순
                    {sortOrder === "인기순" && (
                      <div className="absolute -top-4 -right-4 flex">
                        <div className="size-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-[10px]">🔥</span>
                        </div>
                        <div className="size-6 bg-white rounded-full flex items-center justify-center shadow-sm -ml-2 overflow-hidden border-2 border-white">
                          <UserIcon className="size-4 text-black" />
                        </div>
                      </div>
                    )}
                  </button>
                </div>

                <button className="flex items-center gap-2 text-Body_M_Medium text-black px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <span className="text-main-1">▼</span> 토론 필터
                </button>
              </div>

              {/* 토론 목록 */}
              <div className="flex flex-col bg-white rounded-lg overflow-hidden mt-2">
                {discussionsLoading && (
                  <div className="flex justify-center items-center py-12 text-gray-400 text-sm">
                    토론을 불러오는 중...
                  </div>
                )}
                {!discussionsLoading && discussions.length === 0 && (
                  <div className="flex justify-center items-center py-12 text-gray-400 text-sm">
                    토론이 없습니다
                  </div>
                )}
                {!discussionsLoading && discussions.map((discussion) => (
                  <Discussion
                    key={discussion.id}
                    author={discussion.userId === user?.userId ? (user.nickname || "나") : `사용자`}
                    time={formatRelativeTime(discussion.createdAt)}
                    content={discussion.content}
                    likeCount={discussion.likeCount}
                    commentCount={discussion.comments.length}
                    className="border-gray-100"
                    onLike={() => handleDiscussionLike(discussion.id)}
                    onComment={() => navigate(`/news/${discussion.newsId}`)}
                  />
                ))}
              </div>
            </>
          )}

          {/* 검색창 - 페이지 하단 고정 */}
          <div className="mt-8">
            <TextField
              label=""
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="토론 주제 / 내용 검색"
              leftIcon={<SearchIcon className="w-5 h-5 text-gray-400" />}
              containerClassName="border border-gray-300 rounded-lg bg-white"
            />
          </div>
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

export default NewsPage;
