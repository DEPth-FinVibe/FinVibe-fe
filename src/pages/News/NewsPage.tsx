import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewsCard, Discussion, TrendSection, PopularDiscussionSection, Button, SwitchBar } from "@/components";
import { NEWS_TABS, type NewsTabType } from "@/components/SwitchBar/SwitchBar";
import TextField from "@/components/TextField";
import { cn } from "@/utils/cn";
import SearchIcon from "@/assets/svgs/SearchIcon";
import UserIcon from "@/assets/svgs/UserIcon";

// Mock 뉴스 데이터
const MOCK_NEWS = [
  {
    id: 1,
    category: "산업",
    sentiment: "success" as const,
    time: "2시간 전",
    title: "반도체 시장 회복세, 삼성전자와 SK하이닉스 주가 급등",
    description: "AI 및 데이터센터 수요 증가로 인해 메모리 반도체 가격이 상승하고 있습니다. 전문가들은 이러한 추세가 2025년까지 지속될 것으로 전망하고 있습니다.",
    aiAnalysis: "긍정적인 시장 전망으로 기술주 투자 기회가 될 수 있습니다.",
    likeCount: 124,
    commentCount: 45,
  },
  {
    id: 2,
    category: "산업",
    sentiment: "success" as const,
    time: "2시간 전",
    title: "반도체 시장 회복세, 삼성전자와 SK하이닉스 주가 급등",
    description: "AI 및 데이터센터 수요 증가로 인해 메모리 반도체 가격이 상승하고 있습니다. 전문가들은 이러한 추세가 2025년까지 지속될 것으로 전망하고 있습니다.",
    aiAnalysis: "긍정적인 시장 전망으로 기술주 투자 기회가 될 수 있습니다.",
    likeCount: 89,
    commentCount: 67,
  },
  {
    id: 3,
    category: "산업",
    sentiment: "success" as const,
    time: "2시간 전",
    title: "반도체 시장 회복세, 삼성전자와 SK하이닉스 주가 급등",
    description: "AI 및 데이터센터 수요 증가로 인해 메모리 반도체 가격이 상승하고 있습니다. 전문가들은 이러한 추세가 2025년까지 지속될 것으로 전망하고 있습니다.",
    aiAnalysis: "긍정적인 시장 전망으로 기술주 투자 기회가 될 수 있습니다.",
    likeCount: 56,
    commentCount: 89,
  },
];

// Mock 토론 데이터
const MOCK_DISCUSSIONS = [
  {
    id: 1,
    author: "게시자 이름_1",
    time: "XX시간 전 작성",
    content: "댓글_1",
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 2,
    author: "게시자 이름_1",
    time: "XX시간 전 작성",
    content: "댓글_1",
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 3,
    author: "게시자 이름_1",
    time: "XX시간 전 작성",
    content: "댓글_1",
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 4,
    author: "게시자 이름_1",
    time: "XX시간 전 작성",
    content: "댓글_1",
    likeCount: 0,
    commentCount: 0,
  },
];

// Mock 실시간 트렌드 데이터
const MOCK_TRENDS = [
  { tag: "#반도체", count: 296 },
  { tag: "#AI투자", count: 574 },
  { tag: "#금리동결", count: 311 },
  { tag: "#전기차", count: 539 },
  { tag: "#배당주", count: 296 },
];

// Mock 인기 토론 데이터
const MOCK_POPULAR_DISCUSSIONS = [
  { title: "2025 투자 전망은?", commentCount: 156 },
  { title: "초보자 추천 종목", commentCount: 98 },
  { title: "배당주 vs 성장주", commentCount: 87 },
];

const NewsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NewsTabType>("news");
  const [sortOrder, setSortOrder] = useState<"인기순" | "최신순">("인기순");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [discussionContent, setDiscussionContent] = useState("");

  const handleNewsClick = (newsId: number) => {
    navigate(`/news/${newsId}`);
  };

  const handlePostDiscussion = () => {
    if (!discussionContent.trim()) return;
    // TODO: 토론 게시 로직
    setDiscussionContent("");
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
                {MOCK_NEWS.map((news) => (
                  <div
                    key={news.id}
                    onClick={() => handleNewsClick(news.id)}
                    className="cursor-pointer"
                  >
                    <NewsCard
                      category={news.category}
                      sentiment={news.sentiment}
                      time={news.time}
                      title={news.title}
                      description={news.description}
                      aiAnalysis={news.aiAnalysis}
                      likeCount={news.likeCount}
                      commentCount={news.commentCount}
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
                      className="bg-main-1 text-white px-10 py-2 rounded-lg text-Body_M_Medium hover:bg-main-2 transition-colors border-none"
                    >
                      게시하기
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
                {MOCK_DISCUSSIONS.map((discussion) => (
                  <Discussion
                    key={discussion.id}
                    author={discussion.author}
                    time={discussion.time}
                    content={discussion.content}
                    likeCount={discussion.likeCount}
                    commentCount={discussion.commentCount}
                    className="border-gray-100"
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
          <TrendSection trends={MOCK_TRENDS} />
          <PopularDiscussionSection discussions={MOCK_POPULAR_DISCUSSIONS} />
        </aside>
      </main>
    </div>
  );
};

export default NewsPage;
