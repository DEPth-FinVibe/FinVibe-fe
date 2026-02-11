import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import SearchIcon from "@/assets/search.svg?react";

type NoticeCategory = "점검" | "필독" | "이벤트" | "업데이트" | "안내";

type Notice = {
  id: string;
  pinned?: boolean;
  category: NoticeCategory;
  title: string;
  content: string;
  date: string; // YYYY.MM.DD
  no?: number; // pinned일 때는 사용 안 함
};

const PAGE_SIZE = 5;
const MAX_PINNED = 3;

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
const NOTICES: Notice[] = [
  {
    id: "p-1",
    pinned: true,
    category: "점검",
    title: "12월 20일 서버 정기 점검 안내 (02:00 ~ 04:00)",
    content: "서비스 안정화를 위한 정기 점검이 진행됩니다. 점검 시간 동안 서비스 이용이 제한될 수 있습니다.",
    date: "2015.12.18",
  },
  {
    id: "p-2",
    pinned: true,
    category: "필독",
    title: "가상 자산 및 모의투자 면책 조항 안내",
    content: "본 서비스는 가상 투자 시뮬레이션이며, 실제 금융 거래가 발생하지 않습니다. 투자 판단의 책임은 사용자에게 있습니다.",
    date: "2025.11.01",
  },
  // 일반 공지 (최신순 가정: no가 작을수록 최신이 아니라, date로 정렬)
  {
    id: "n-15",
    no: 15,
    category: "점검",
    title: "12월 20일 서버 정기 점검 안내 (02:00 ~ 04:00)",
    content: "정기 점검 상세 안내입니다.",
    date: "2015.12.18",
  },
  {
    id: "n-14",
    no: 14,
    category: "이벤트",
    title: "스쿼드 챌린지 시즌 1 오픈 기념 이벤트!",
    content: "스쿼드 챌린지 시즌 1 오픈 기념 이벤트를 확인해 주세요.",
    date: "2025.12.15",
  },
  {
    id: "n-13",
    no: 13,
    category: "안내",
    title: "AI 뉴스 분석 기능 업데이트",
    content: "AI 뉴스 분석 기능이 개선되었습니다. 더 정확한 요약과 키워드 추출을 제공합니다.",
    date: "2025.12.10",
  },
  // 예시 데이터: 번호는 10 ~ 1까지만 (총 데이터가 3페이지를 넘지 않도록 제한)
  ...Array.from({ length: 10 }).map((_, i) => {
    const idx = 10 - i; // 10..1
    const categories: NoticeCategory[] = ["안내", "업데이트", "이벤트", "점검", "필독"];
    const cat = categories[i % categories.length];
    const mm = String(11 - Math.floor(i / 2)).padStart(2, "0");
    const dd = String((i % 28) + 1).padStart(2, "0");
    return {
      id: `n-${idx}`,
      no: idx,
      category: cat,
      title: `${cat} 공지 예시 제목 ${i + 1}`,
      content: `${cat} 공지 예시 본문입니다. 검색 테스트를 위해 제목/내용에 키워드를 포함할 수 있습니다.`,
      date: `2025.${mm}.${dd}`,
    } satisfies Notice;
  }),
];

const NoticePage: React.FC = () => {
  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const applySearch = () => {
    setQuery(queryInput.trim());
    setPage(1);
  };

  const { pinned, nonPinned } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = NOTICES.filter((n) => {
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    });

    const pinnedRaw = filtered
      .filter((n) => n.pinned)
      .slice(0, MAX_PINNED);

    const nonPinnedRaw = filtered
      .filter((n) => !n.pinned)
      .sort((a, b) => (b.no ?? 0) - (a.no ?? 0));

    return { pinned: pinnedRaw, nonPinned: nonPinnedRaw };
  }, [query]);

  // 페이지네이션 계산/슬라이스는 pinned 개수를 기준으로 고정 (pinned는 1페이지에서만 "노출" 처리)
  const pinnedCount = pinned.length;
  const pinnedShown = useMemo(() => (page === 1 ? pinned : []), [page, pinned]);
  const firstPageNonPinnedSlots = Math.max(0, PAGE_SIZE - pinnedCount);
  const consumedOnFirst = Math.min(nonPinned.length, firstPageNonPinnedSlots);

  const totalPages = useMemo(() => {
    if (nonPinned.length === 0) return 1;
    const remaining = Math.max(0, nonPinned.length - consumedOnFirst);
    return Math.max(1, 1 + Math.ceil(remaining / PAGE_SIZE));
  }, [nonPinned.length, consumedOnFirst]);

  const pageItems = useMemo(() => {
    const start = page === 1 ? 0 : consumedOnFirst + (page - 2) * PAGE_SIZE;
    const count = page === 1 ? firstPageNonPinnedSlots : PAGE_SIZE;
    const slice = nonPinned.slice(start, start + count);
    return [...pinnedShown, ...slice];
  }, [nonPinned, pinnedShown, page, firstPageNonPinnedSlots, consumedOnFirst]);

  const goPage = (next: number) => {
    const clamped = Math.max(1, Math.min(totalPages, next));
    setPage(clamped);
  };

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
      <main className="w-full px-4 sm:px-8 2xl:px-60 pt-10 pb-20">
        <div className="w-full max-w-[1440px] mx-auto">
          <section className="bg-white border border-gray-300 rounded-[4px] px-5 sm:px-10 py-[30px] flex flex-col gap-[30px]">
            <h1 className="text-Headline_L_Bold text-black">공지사항</h1>

            {/* Search */}
            <div
              className={cn(
                "w-full rounded-[8px] border-2 border-main-1",
                "px-4 py-3 flex items-center gap-[23px]"
              )}
            >
              <button
                type="button"
                onClick={applySearch}
                className="inline-flex items-center justify-center"
                aria-label="검색"
              >
                <SearchIcon className="size-6 text-gray-500" aria-hidden="true" />
              </button>
              <input
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applySearch();
                }}
                placeholder="제목 / 내용을 검색해보세요"
                className={cn(
                  "w-full bg-transparent outline-none",
                  "text-Subtitle_M_Regular text-black",
                  "placeholder:text-gray-500"
                )}
              />
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1360px] border border-gray-300 rounded-[8px] overflow-hidden bg-white">
                {/* Header row */}
                <div className="w-full flex items-center p-[20px] border-b border-gray-300">
                  <div className="w-[117px] shrink-0 h-[45px] flex items-center justify-center px-[40px] py-[10px]">
                    <p className="text-Subtitle_L_Regular text-black whitespace-nowrap">번호</p>
                  </div>
                  <div className="w-[117px] shrink-0 h-[45px] flex items-center justify-center px-[40px] py-[10px]">
                    <p className="text-Subtitle_L_Regular text-black whitespace-nowrap">구분</p>
                  </div>
                  <div className="w-[830px] shrink-0 h-[45px] flex items-center py-[10px] pl-[70px]">
                    <p className="text-Subtitle_L_Regular text-black whitespace-nowrap">제목</p>
                  </div>
                  <div className="w-[256px] shrink-0 h-[45px] flex items-center justify-center px-[100px] py-[10px]">
                    <p className="text-Subtitle_L_Regular text-black whitespace-nowrap">
                      작성일
                    </p>
                  </div>
                </div>

                {pageItems.length === 0 ? (
                  <div className="w-full p-10 text-center text-Body_L_Regular text-gray-500">
                    검색 결과가 없습니다.
                  </div>
                ) : (
                  pageItems.map((n) => {
                    const isPinned = Boolean(n.pinned) && page === 1;
                    const badge = CATEGORY_STYLE[n.category];
                    return (
                      <div
                        key={n.id}
                        className={cn(
                          "w-full flex items-center p-[20px]",
                          isPinned ? "bg-[#EAEBED]" : "bg-white",
                          "cursor-pointer hover:bg-gray-50 transition-colors"
                        )}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/notice/${n.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            navigate(`/notice/${n.id}`);
                          }
                        }}
                      >
                        {/* 번호 */}
                        <div className="w-[117px] shrink-0 h-[45px] flex items-center justify-center px-[40px] py-[10px]">
                          {isPinned ? (
                            <div className="bg-main-1 rounded-[4px] w-[70px] px-[18px] py-[8px] flex items-center justify-center">
                              <p className="text-Subtitle_M_Regular text-white whitespace-nowrap">
                                공지
                              </p>
                            </div>
                          ) : (
                            <div className="w-[70px] px-[18px] py-[8px] flex items-center justify-center">
                              <p className="text-Subtitle_M_Regular text-black whitespace-nowrap">
                                {n.no ?? "-"}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* 구분 */}
                        <div className="w-[117px] shrink-0 h-[45px] flex items-center justify-center px-[40px] py-[10px]">
                          <div
                            className={cn(
                              "rounded-[4px] px-[18px] py-[8px] flex items-center justify-center",
                              badge.wrap
                            )}
                          >
                            <p
                              className={cn(
                                "text-Subtitle_M_Regular whitespace-nowrap",
                                badge.text
                              )}
                            >
                              [{n.category}]
                            </p>
                          </div>
                        </div>

                        {/* 제목 */}
                        <div className="w-[830px] shrink-0 h-[45px] flex items-center py-[10px] pl-[70px] min-w-0">
                          <p className="text-Subtitle_M_Regular text-black truncate">
                            {n.title}
                          </p>
                        </div>

                        {/* 작성일 */}
                        <div className="w-[256px] shrink-0 h-[45px] flex items-center justify-center px-[100px] py-[10px]">
                          <p className="text-Subtitle_M_Regular text-black whitespace-nowrap">
                            {n.date}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Pagination */}
            <div className="w-full flex items-center justify-center gap-[10px] p-[10px]">
              <button
                type="button"
                onClick={() => goPage(page - 1)}
                disabled={page <= 1}
                className={cn(
                  "size-[40px] flex items-center justify-center",
                  page <= 1 ? "text-gray-300" : "text-black"
                )}
                aria-label="이전 페이지"
              >
                <span className="text-[24px] leading-[1.25]">&lt;</span>
              </button>

              {Array.from({ length: totalPages }).slice(0, 9).map((_, idx) => {
                const p = idx + 1;
                const active = p === page;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goPage(p)}
                    className={cn(
                      "size-[40px] flex items-center justify-center",
                      "text-[24px] leading-[1.25] font-medium",
                      active ? "bg-main-1 text-white rounded-[4px]" : "text-black"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => goPage(page + 1)}
                disabled={page >= totalPages}
                className={cn(
                  "size-[40px] flex items-center justify-center",
                  page >= totalPages ? "text-gray-300" : "text-black"
                )}
                aria-label="다음 페이지"
              >
                <span className="text-[24px] leading-[1.25]">&gt;</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default NoticePage;


