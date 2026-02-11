import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/utils/cn";
import BlackCalendarIcon from "@/assets/svgs/BlackCalendarIcon";
import BlackEyeIcon from "@/assets/svgs/BlackEyeIcon";
import BlackPersonIcon from "@/assets/svgs/BlackPersonIcon";
import ArrowIcon from "@/assets/svgs/ArrowIcon";
import PaperclipIcon from "@/assets/svgs/PaperclipIcon";

type NoticeCategory = "점검" | "필독" | "이벤트" | "업데이트" | "안내";

type NoticeDetail = {
  id: string;
  category: NoticeCategory;
  title: string;
  content: string;
  author: string;
  date: string; // YYYY.MM.DD
  viewCount: number;
  imageUrl?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string; // 예: "124KB"
  nextNotice?: {
    id: string;
    title: string;
  };
  prevNotice?: {
    id: string;
    title: string;
  };
};

const CATEGORY_STYLE: Record<
  NoticeCategory,
  { wrap: string; text: string }
> = {
  점검: { wrap: "bg-etc-light-red", text: "text-etc-red" },
  필독: { wrap: "bg-etc-light-yellow", text: "text-[#F59E0B]" },
  이벤트: { wrap: "bg-etc-light-purple", text: "text-[#9747FF]" },
  업데이트: { wrap: "bg-etc-light-green", text: "text-etc-green" },
  안내: { wrap: "bg-etc-light-blue", text: "text-etc-blue" },
};

// 목업 데이터 (추후 API 연동 예정)
const MOCK_NOTICE_DETAILS: Record<string, NoticeDetail> = {
  "p-1": {
    id: "p-1",
    category: "점검",
    title: "12월 20일 서버 정기 점검 안내 (02:00 ~ 04:00)",
    content: `안녕하세요, FinVibe 입니다.
안정적인 서비스를 위해 아래와 같이 점검이 진행될 예정입니다.

[점검 일시]
2025년 12월 20일(금) 02:00 ~ 04:00 (2시간)

이용에 불편을 드려 죄송합니다.`,
    author: "FinVibe 관리자",
    date: "2025.12.18",
    viewCount: 2534,
    imageUrl: "https://via.placeholder.com/800x400?text=점검+안내+이미지",
    pdfUrl: "#",
    pdfFileName: "점검_안내_상세.pdf",
    pdfFileSize: "124KB",
    nextNotice: {
      id: "p-2",
      title: "가상 자산 및 모의투자 면책 조항 안내",
    },
    prevNotice: {
      id: "n-15",
      title: "12월 20일 서버 정기 점검 안내 (02:00 ~ 04:00)",
    },
  },
  "p-2": {
    id: "p-2",
    category: "필독",
    title: "가상 자산 및 모의투자 면책 조항 안내",
    content: `안녕하세요, FinVibe 입니다.

본 서비스는 가상 투자 시뮬레이션이며, 실제 금융 거래가 발생하지 않습니다.
투자 판단의 책임은 사용자에게 있습니다.

[면책 조항]
- 본 서비스는 교육 및 시뮬레이션 목적으로 제공됩니다.
- 실제 투자 손익과는 무관합니다.
- 투자 결정은 사용자의 판단에 따라 이루어집니다.`,
    author: "FinVibe 관리자",
    date: "2025.11.01",
    viewCount: 1823,
    nextNotice: {
      id: "n-15",
      title: "12월 20일 서버 정기 점검 안내 (02:00 ~ 04:00)",
    },
    prevNotice: {
      id: "p-1",
      title: "12월 20일 서버 정기 점검 안내 (02:00 ~ 04:00)",
    },
  },
  "n-15": {
    id: "n-15",
    category: "점검",
    title: "12월 20일 서버 정기 점검 안내 (02:00 ~ 04:00)",
    content: `안녕하세요, FinVibe 입니다.
안정적인 서비스를 위해 아래와 같이 점검이 진행될 예정입니다.

[점검 일시]
2025년 12월 20일(금) 02:00 ~ 04:00 (2시간)

이용에 불편을 드려 죄송합니다.`,
    author: "FinVibe 관리자",
    date: "2025.12.18",
    viewCount: 2534,
    imageUrl: "https://via.placeholder.com/800x400?text=점검+안내+이미지",
    pdfUrl: "#",
    pdfFileName: "점검_안내_상세.pdf",
    pdfFileSize: "124KB",
    nextNotice: {
      id: "n-14",
      title: "스쿼드 챌린지 시즌 1 오픈 기념 이벤트!",
    },
    prevNotice: {
      id: "p-2",
      title: "가상 자산 및 모의투자 면책 조항 안내",
    },
  },
  "n-14": {
    id: "n-14",
    category: "이벤트",
    title: "스쿼드 챌린지 시즌 1 오픈 기념 이벤트!",
    content: `안녕하세요, FinVibe 입니다.

스쿼드 챌린지 시즌 1이 오픈되었습니다!

[이벤트 기간]
2025년 12월 15일 ~ 2026년 1월 15일

[이벤트 내용]
- 시즌 1 참여자 전원에게 특별 보상 지급
- 우수 스쿼드에게 추가 리워드 제공
- 개인 랭킹 상위권에게 특별 배지 지급

많은 참여 부탁드립니다!`,
    author: "FinVibe 관리자",
    date: "2025.12.15",
    viewCount: 3421,
    nextNotice: {
      id: "n-13",
      title: "AI 뉴스 분석 기능 업데이트",
    },
    prevNotice: {
      id: "n-15",
      title: "12월 20일 서버 정기 점검 안내 (02:00 ~ 04:00)",
    },
  },
  "n-13": {
    id: "n-13",
    category: "안내",
    title: "AI 뉴스 분석 기능 업데이트",
    content: `안녕하세요, FinVibe 입니다.

AI 뉴스 분석 기능이 개선되었습니다.

[업데이트 내용]
- 더 정확한 뉴스 요약 기능
- 키워드 자동 추출 기능 강화
- 감성 분석 정확도 향상
- 관련 뉴스 추천 기능 추가

더 나은 서비스로 찾아뵙겠습니다.`,
    author: "FinVibe 관리자",
    date: "2025.12.10",
    viewCount: 1892,
    nextNotice: {
      id: "n-12",
      title: "안내 공지 예시 제목 1",
    },
    prevNotice: {
      id: "n-14",
      title: "스쿼드 챌린지 시즌 1 오픈 기념 이벤트!",
    },
  },
};

// 나머지 공지사항들에 대한 기본 더미 데이터 생성
for (let i = 12; i >= 1; i--) {
  const categories: NoticeCategory[] = ["안내", "업데이트", "이벤트", "점검", "필독"];
  const cat = categories[(12 - i) % categories.length];
  const mm = String(11 - Math.floor((12 - i) / 2)).padStart(2, "0");
  const dd = String(((12 - i) % 28) + 1).padStart(2, "0");
  
  MOCK_NOTICE_DETAILS[`n-${i}`] = {
    id: `n-${i}`,
    category: cat,
    title: `${cat} 공지 예시 제목 ${13 - i}`,
    content: `${cat} 공지 예시 본문입니다. 검색 테스트를 위해 제목/내용에 키워드를 포함할 수 있습니다.

이 공지사항은 예시 데이터입니다.
실제 API 연동 시에는 서버에서 데이터를 가져옵니다.`,
    author: "FinVibe 관리자",
    date: `2025.${mm}.${dd}`,
    viewCount: Math.floor(Math.random() * 2000) + 500,
    nextNotice: i > 1 ? {
      id: `n-${i - 1}`,
      title: `${categories[(12 - (i - 1)) % categories.length]} 공지 예시 제목 ${13 - (i - 1)}`,
    } : undefined,
    prevNotice: i < 12 ? {
      id: `n-${i + 1}`,
      title: i + 1 === 13 ? "AI 뉴스 분석 기능 업데이트" : `${categories[(12 - (i + 1)) % categories.length]} 공지 예시 제목 ${13 - (i + 1)}`,
    } : {
      id: "n-13",
      title: "AI 뉴스 분석 기능 업데이트",
    },
  };
}

const NoticeDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId: string }>();
  
  // TODO: API 연동 시 실제 데이터 가져오기
  const notice = noticeId ? MOCK_NOTICE_DETAILS[noticeId] : MOCK_NOTICE_DETAILS["n-15"];

  if (!notice) {
    return (
      <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
        <main className="w-full px-4 sm:px-8 2xl:px-60 pt-10 pb-20">
          <div className="w-full max-w-[1440px] mx-auto">
            <div className="bg-white border border-gray-300 rounded-[8px] px-[30px] py-[20px] text-center">
              <p className="text-Subtitle_L_Regular text-gray-500 py-10">
                공지사항을 찾을 수 없습니다.
              </p>
              <button
                type="button"
                onClick={() => navigate("/notice")}
                className="bg-main-1 px-[20px] py-[10px] rounded-[8px] text-white hover:bg-main-2 transition-colors"
              >
                목록으로 돌아가기
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const badge = CATEGORY_STYLE[notice.category];

  const handleBackToList = () => {
    navigate("/notice");
  };

  const handleNextNotice = () => {
    if (notice.nextNotice) {
      navigate(`/notice/${notice.nextNotice.id}`);
    }
  };

  const handlePrevNotice = () => {
    if (notice.prevNotice) {
      navigate(`/notice/${notice.prevNotice.id}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
      <main className="w-full px-4 sm:px-8 2xl:px-60 pt-10 pb-20">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-[30px]">
          {/* 헤더 카드 */}
          <div className="bg-white border border-gray-300 rounded-[8px] px-[30px] py-[20px] flex flex-col gap-[30px]">
            {/* 태그 및 제목 */}
            <div className="flex flex-col gap-[10px]">
              <div className={cn("rounded-[15px] px-[10px] py-[7px] w-fit", badge.wrap)}>
                <p className={cn("text-Subtitle_S_Regular", badge.text)}>
                  [{notice.category}]
                </p>
              </div>
              <h1 className="text-Headline_L_Bold text-black whitespace-pre-wrap">
                {notice.title}
              </h1>
            </div>

            {/* 구분선 */}
            <div className="h-px bg-gray-300" />

            {/* 작성자, 작성일, 조회수 */}
            <div className="flex gap-[30px] items-center flex-wrap">
              <div className="flex gap-[10px] items-center">
                <BlackPersonIcon className="size-[24px]" />
                <p className="text-Subtitle_M_Regular text-black">
                  작성자 : {notice.author}
                </p>
              </div>
              <div className="flex gap-[10px] items-center">
                <BlackCalendarIcon className="size-[24px]" />
                <p className="text-Subtitle_M_Regular text-black">
                  작성일 : {notice.date}
                </p>
              </div>
              <div className="flex gap-[10px] items-center">
                <BlackEyeIcon className="size-[24px]" />
                <p className="text-Subtitle_M_Regular text-black">
                  조회수 : {notice.viewCount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* 본문 카드 */}
          <div className="bg-white border border-gray-300 rounded-[8px] px-[30px] py-[20px] flex flex-col gap-[30px]">
            {/* 본문 내용 */}
            <div className="w-full">
              <p className="text-Subtitle_L_Regular text-black whitespace-pre-wrap leading-[2]">
                {notice.content}
              </p>
            </div>

            {/* 이미지 (있을 경우) */}
            {notice.imageUrl && (
              <div className="bg-gray-100 rounded-[8px] py-[200px] flex flex-col gap-[15px] items-center justify-center relative">
                <div className="grid grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                  <div className="bg-main-1 col-1 ml-0 mt-0 rounded-[8px] row-1 size-[60px]" />
                  <div className="col-1 ml-[15px] mt-[15px] relative row-1 size-[30px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      className="size-full"
                    >
                      <path
                        d="M15 5L5 10V20L15 25L25 20V10L15 5Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 15L10 12.5V17.5L15 20L20 17.5V12.5L15 15Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <img
                  src={notice.imageUrl}
                  alt="공지사항 이미지"
                  className="max-w-full h-auto rounded-[8px] mt-4"
                />
                <p className="text-Subtitle_S_Medium text-gray-500 text-center whitespace-pre-wrap">
                  점검 안내 이미지
                </p>
              </div>
            )}

            {/* 구분선 */}
            {(notice.imageUrl || notice.pdfUrl) && (
              <div className="h-px bg-gray-300" />
            )}

            {/* PDF 첨부파일 (있을 경우) */}
            {notice.pdfUrl && (
              <div className="bg-sub-blue rounded-[8px] px-[20px] py-[15px] flex items-center gap-[20px]">
                <PaperclipIcon className="size-[24px] text-white" />
                <a
                  href={notice.pdfUrl}
                  className="text-Subtitle_M_Regular text-white hover:underline"
                >
                  {notice.pdfFileName}
                </a>
                {notice.pdfFileSize && (
                  <p className="text-Subtitle_S_Regular text-gray-400">
                    ({notice.pdfFileSize})
                  </p>
                )}
              </div>
            )}

            {/* 다음글/이전글 */}
            <div className="border border-gray-300 rounded-[8px] overflow-hidden">
              {/* 다음글 */}
              {notice.nextNotice && (
                <div
                  className={cn(
                    "flex items-center p-[20px]",
                    notice.prevNotice && "border-b border-gray-300"
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={handleNextNotice}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleNextNotice();
                    }
                  }}
                >
                  <div className="flex h-[45px] items-center justify-center p-[10px] shrink-0">
                    <div className="flex items-center justify-center size-[15px]">
                      <ArrowIcon
                        direction="up"
                        className="size-[15px] text-black"
                      />
                    </div>
                  </div>
                  <div className="flex h-[45px] items-center justify-center px-[20px] py-[10px] shrink-0">
                    <p className="text-Subtitle_M_Regular text-black">다음글</p>
                  </div>
                  <div className="flex flex-1 h-[45px] items-center pl-[30px] py-[10px] min-w-0">
                    <p className="text-Subtitle_M_Regular text-black truncate">
                      {notice.nextNotice.title}
                    </p>
                  </div>
                </div>
              )}

              {/* 이전글 */}
              {notice.prevNotice && (
                <div
                  className="flex items-center p-[20px] cursor-pointer hover:bg-gray-50 transition-colors"
                  role="button"
                  tabIndex={0}
                  onClick={handlePrevNotice}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handlePrevNotice();
                    }
                  }}
                >
                  <div className="flex h-[45px] items-center justify-center p-[10px] shrink-0">
                    <div className="flex items-center justify-center size-[15px]">
                      <ArrowIcon
                        direction="down"
                        className="size-[15px] text-black"
                      />
                    </div>
                  </div>
                  <div className="flex h-[45px] items-center justify-center px-[20px] py-[10px] shrink-0">
                    <p className="text-Subtitle_M_Regular text-black">이전글</p>
                  </div>
                  <div className="flex flex-1 h-[45px] items-center pl-[30px] py-[10px] min-w-0">
                    <p className="text-Subtitle_M_Regular text-black truncate">
                      {notice.prevNotice.title}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 목록으로 버튼 */}
            <div className="flex flex-col items-center px-[500px] w-full">
              <button
                type="button"
                onClick={handleBackToList}
                className="bg-main-1 h-[66px] px-[16px] py-[20px] rounded-[8px] w-full hover:bg-main-2 transition-colors"
              >
                <p className="text-Subtitle_L_Medium text-white text-center whitespace-pre-wrap">
                  목록으로
                </p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NoticeDetailPage;

