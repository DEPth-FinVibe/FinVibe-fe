import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import SearchIcon from "@/assets/search.svg?react";

type FaqBucket = "ALL" | "INVEST" | "ACCOUNT" | "CHALLENGE" | "ETC";

type FaqItem = {
  id: string;
  bucket: Exclude<FaqBucket, "ALL">;
  tagLabel: string; // 화면에 표시할 [투자] 같은 태그
  question: string;
  answer?: string;
};

const BUCKETS: Array<{ key: FaqBucket; label: string }> = [
  { key: "ALL", label: "전체" },
  { key: "INVEST", label: "투자/시뮬레이터" },
  { key: "ACCOUNT", label: "계정/로그인" },
  { key: "CHALLENGE", label: "챌린지/스쿼드" },
  { key: "ETC", label: "기타" },
];

const FAQS: FaqItem[] = [
  {
    id: "inv-1",
    bucket: "INVEST",
    tagLabel: "투자",
    question: "모의투자 수익률은 어떻게 계산되나요?",
    answer:
      "수익률은 (현재가 - 평단가) ÷ 평단가 × 100 공식으로 실시간 계산됩니다. 배당금은 포함되지 않습니다.",
  },
  {
    id: "acc-1",
    bucket: "ACCOUNT",
    tagLabel: "계정",
    question: "카카오 로그인이 안 될 때는 어떻게 하나요?",
  },
  {
    id: "ch-1",
    bucket: "CHALLENGE",
    tagLabel: "챌린지",
    question: "스쿼드 점수는 어떻게 산정되나요?",
  },
  {
    id: "inv-2",
    bucket: "INVEST",
    tagLabel: "자산",
    question: "게임 머니를 현금으로 출금할 수 있나요?",
  },
  {
    id: "etc-1",
    bucket: "ETC",
    tagLabel: "기타",
    question: "회원 탈퇴는 어디서 하나요?",
  },
];

const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const [bucket, setBucket] = useState<FaqBucket>("ALL");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string>(FAQS[0]?.id ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((item) => {
      const bucketOk = bucket === "ALL" ? true : item.bucket === bucket;
      if (!bucketOk) return false;
      if (!q) return true;
      const hay = `[${item.tagLabel}] ${item.question}`.toLowerCase();
      const ans = (item.answer ?? "").toLowerCase();
      return hay.includes(q) || ans.includes(q);
    });
  }, [bucket, query]);

  return (
    <div className="bg-[#EAEBED] min-h-[calc(100vh-80px)]">
      <main className="w-full px-4 sm:px-8 2xl:px-60 pt-10 pb-20">
        <div className="w-full max-w-[1440px] mx-auto">
          <section className="bg-white border border-gray-300 rounded-[4px] px-5 sm:px-10 py-[30px] flex flex-col gap-[30px]">
            <h1 className="text-Headline_L_Bold text-black">자주 묻는 질문</h1>

            {/* Search */}
            <div
              className={cn(
                "w-full rounded-[8px] border-2 border-main-1",
                "px-4 py-3 flex items-center gap-[23px]",
              )}
            >
              <SearchIcon className="size-6 text-gray-500" aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="제목 / 내용을 검색해보세요"
                className={cn(
                  "w-full bg-transparent outline-none",
                  "text-Subtitle_M_Regular text-black",
                  "placeholder:text-gray-500"
                )}
              />
            </div>

            <div className="w-full border-t border-gray-300" />

            {/* Buckets */}
            <div className="flex flex-wrap gap-[15px]">
              {BUCKETS.map((b) => {
                const active = bucket === b.key;
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => setBucket(b.key)}
                    className={cn(
                      "rounded-[8px] px-[15px] py-[10px]",
                      "text-Subtitle_S_Regular",
                      active
                        ? "bg-main-1 text-white"
                        : "bg-white border border-gray-300 text-[#4C4C4C]"
                    )}
                    aria-pressed={active}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>

            {/* List */}
            <div className="flex flex-col gap-[20px]">
              {filtered.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div
                    key={item.id}
                    className="w-full border border-gray-300 rounded-[8px] overflow-hidden bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId((prev) => (prev === item.id ? "" : item.id))}
                      className={cn(
                        "w-full flex items-center justify-between",
                        "p-[20px] text-left",
                        isOpen && item.answer ? "border-b border-gray-300" : ""
                      )}
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center justify-center px-[20px] py-[10px]">
                          <span className="text-Subtitle_M_Regular text-black">Q.</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-Subtitle_M_Regular text-black truncate">
                            [{item.tagLabel}]&nbsp; {item.question}
                          </p>
                        </div>
                      </div>
                      <ChevronIcon
                        className={cn(
                          "size-[15px] text-black shrink-0 transition-transform",
                          isOpen ? "rotate-180" : "rotate-0"
                        )}
                      />
                    </button>

                    {isOpen && item.answer && (
                      <div className="bg-[#EAEBED] p-[20px]">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center h-[45px] px-[20px] py-[10px] shrink-0">
                            <span className="text-Subtitle_M_Regular text-black">A.</span>
                          </div>
                          <div className="flex-1 min-w-0 flex items-center h-[45px] py-[10px]">
                            <p className="text-Subtitle_M_Regular text-black">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="w-full border border-gray-300 rounded-[8px] bg-white p-8 text-center text-Body_L_Regular text-gray-500">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>

            <div className="w-full border-t border-gray-300" />

            {/* Bottom CTA */}
            <div className="flex flex-col gap-[20px] items-center w-full">
              <p className="text-Subtitle_L_Regular text-black text-center w-full">
                원하는 답을 찾지 못하셨나요?
              </p>
              <button
                type="button"
                onClick={() => navigate("/inquiry")}
                className={cn(
                  "border-2 border-sub-blue rounded-[8px]",
                  "px-[20px] py-[10px]",
                  "text-Body_L_Regular text-black",
                  "hover:bg-gray-50 transition-colors"
                )}
              >
                1:1 문의하기
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;


