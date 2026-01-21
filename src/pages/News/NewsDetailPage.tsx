import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Discussion, AIAnalysisBox, TrendSection, PopularDiscussionSection } from "@/components";
import Chip from "@/components/Chip";
import BackIcon from "@/assets/svgs/BackIcon";
import LikeIcon from "@/assets/svgs/LikeIcon";
import CommentIcon from "@/assets/svgs/CommentIcon";
import ShareIcon from "@/assets/svgs/ShareIcon";
import { cn } from "@/utils/cn";

// Mock 뉴스 상세 데이터
const MOCK_NEWS_DETAIL = {
  id: 1,
  keywords: ["키워드_1", "키워드_2"],
  title: "뉴스 제목",
  source: "경제",
  date: "20XX.00.00",
  time: "00:00",
  content: "내용",
  aiAnalysis: "",
  likeCount: 89,
  commentCount: 67,
};

// Mock 댓글 데이터
const MOCK_COMMENTS = [
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

const NewsDetailPage = () => {
  const navigate = useNavigate();
  const { newsId: _newsId } = useParams<{ newsId: string }>();
  const [commentInput, setCommentInput] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [sortOrder, setSortOrder] = useState<"최신순" | "인기순">("최신순");

  const handleBack = () => {
    navigate("/news");
  };

  const handleSubmitComment = () => {
    if (commentInput.trim()) {
      // TODO: 댓글 제출 로직
      setCommentInput("");
    }
  };

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

          {/* 뉴스 상세 카드 */}
          <article className="rounded-lg p-7 bg-white">
            {/* 키워드 태그 */}
            <div className="flex items-center gap-2 mb-4">
              {MOCK_NEWS_DETAIL.keywords.map((keyword, index) => (
                <span key={index} className="text-Body_M_Light text-gray-500">
                  ({keyword})
                </span>
              ))}
              <span className="text-Subtitle_L_Medium text-black">
                {MOCK_NEWS_DETAIL.title}
              </span>
            </div>

            {/* 출처 및 날짜 */}
            <p className="text-Body_S_Light text-gray-400 mb-4">
              ~{MOCK_NEWS_DETAIL.source} {MOCK_NEWS_DETAIL.date} {MOCK_NEWS_DETAIL.time}
            </p>

            {/* 내용 */}
            <p className="text-Body_L_Light text-black mb-6">
              {MOCK_NEWS_DETAIL.content}
            </p>

            {/* AI 분석 */}
            <AIAnalysisBox 
              content={MOCK_NEWS_DETAIL.aiAnalysis} 
              showColon 
              className="mb-6"
            />

            {/* 액션 버튼 */}
            <div className="flex gap-12 items-center">
              <div className="flex items-center gap-5">
                <LikeIcon className="w-6 h-6" />
                <span className="text-Subtitle_S_Regular text-black">
                  {MOCK_NEWS_DETAIL.likeCount}
                </span>
              </div>
              <div className="flex items-center gap-5">
                <CommentIcon className="w-6 h-6" color="#1D1E20" />
                <span className="text-Subtitle_S_Regular text-black">
                  {MOCK_NEWS_DETAIL.commentCount}
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
              />
              <button
                onClick={handleSubmitComment}
                className="px-6 py-3 bg-main-1 text-white rounded-lg text-Body_M_Light hover:bg-main-2 transition-colors flex items-center gap-2"
              >
                <span className="text-lg">💬</span>
                게시하기
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

            {/* 댓글 목록 */}
            <div className="border-t border-gray-200">
              {MOCK_COMMENTS.map((comment) => (
                <Discussion
                  key={comment.id}
                  author={comment.author}
                  time={comment.time}
                  content={comment.content}
                  likeCount={comment.likeCount}
                  commentCount={comment.commentCount}
                />
              ))}
            </div>
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

export default NewsDetailPage;
