import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/utils/cn";
import { Button } from "@/components/Button";
import BrainIcon from "@/assets/svgs/BrainIcon";
import StarIcon from "@/assets/svgs/StarIcon";
import CloseIcon from "@/assets/svgs/CloseIcon";
import WhiteCheckCircleIcon from "@/assets/svgs/WhiteCheckCircleIcon";
import { studyApi, type CourseDifficulty } from "@/api/study";

export interface AICourseCreateModalProps {
  /** 모달 열림/닫힘 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 코스 생성 완료 핸들러 */
  onCreated?: () => void;
}

const FALLBACK_KEYWORDS = [
  "삼성전자",
  "NAVER",
  "Apple",
  "Tesla",
  "NVIDIA",
  "기술적 분석",
  "재무제표",
  "반도체",
  "전기차",
  "AI",
  "배당주",
  "성장주",
  "가치투자",
  "단타",
  "스윙",
];

const DIFFICULTY_OPTIONS: { value: CourseDifficulty; label: string }[] = [
  { value: "BEGINNER", label: "초급" },
  { value: "INTERMEDIATE", label: "중급" },
  { value: "ADVANCED", label: "고급" },
];

export const AICourseCreateModal: React.FC<AICourseCreateModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [courseName, setCourseName] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<CourseDifficulty>("BEGINNER");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // API 상태
  const [availableKeywords, setAvailableKeywords] = useState<string[]>(FALLBACK_KEYWORDS);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const previewMarkdown = previewContent?.replace(/\\n/g, "\n") ?? "";

  // 모달 열릴 때 추천 키워드 조회
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const fetchKeywords = async () => {
      try {
        const keywords = await studyApi.getRecommendedKeywords();
        if (!cancelled && keywords.length > 0) {
          setAvailableKeywords(keywords);
        }
      } catch {
        // 실패 시 fallback 키워드 유지
      }
    };

    fetchKeywords();
    return () => { cancelled = true; };
  }, [isOpen]);

  const handleKeywordToggle = (keyword: string) => {
    const newSelected = new Set(selectedKeywords);
    if (newSelected.has(keyword)) {
      newSelected.delete(keyword);
    } else {
      // 최대 6개까지만 선택 가능
      if (newSelected.size < 6) {
        newSelected.add(keyword);
      }
    }
    setSelectedKeywords(newSelected);
    setPreviewContent(null);
  };

  const handleRemoveKeyword = (keyword: string) => {
    const newSelected = new Set(selectedKeywords);
    newSelected.delete(keyword);
    setSelectedKeywords(newSelected);
    setPreviewContent(null);
  };

  // 코스 미리보기 API 호출
  const handlePreview = async () => {
    if (!courseName.trim() || selectedKeywords.size === 0) return;
    setPreviewLoading(true);
    try {
      const res = await studyApi.previewCourseContent({
        title: courseName.trim(),
        keywords: Array.from(selectedKeywords),
        difficulty,
      });
      setPreviewContent(res.content);
    } catch {
      setPreviewContent("미리보기를 불러오지 못했습니다. 다시 시도해주세요.");
    } finally {
      setPreviewLoading(false);
    }
  };

  // 코스 생성 API 호출
  const handleCreate = async () => {
    if (creating || !courseName.trim() || selectedKeywords.size === 0) return;
    setCreating(true);
    try {
      await studyApi.createCourse({
        title: courseName.trim(),
        keywords: Array.from(selectedKeywords),
        difficulty,
      });
      setShowSuccessModal(true);
    } catch {
      alert("코스 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setCreating(false);
    }
  };

  const handleSuccessModalClose = () => {
    setCourseName("");
    setSelectedKeywords(new Set());
    setDifficulty("BEGINNER");
    setPreviewContent(null);
    setShowSuccessModal(false);
    onCreated?.();
    onClose();
  };

  const handleCancel = () => {
    setCourseName("");
    setSelectedKeywords(new Set());
    setDifficulty("BEGINNER");
    setPreviewContent(null);
    onClose();
  };

  if (!isOpen) return null;

  // 성공 모달 표시
  if (showSuccessModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.43)" }}
        onClick={handleSuccessModalClose}
      >
        <div
          className="bg-white rounded-lg shadow-[0px_6px_15px_0px_rgba(0,0,0,0.25)] p-16 flex flex-col gap-[50px] items-center w-[556px] max-w-[90vw]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 초록색 원형 아이콘 */}
          <div className="w-[110px] h-[110px] rounded-full bg-main-1 flex items-center justify-center shrink-0">
            <WhiteCheckCircleIcon className="w-[64px] h-[64px]" ariaLabel="성공" />
          </div>

          {/* 텍스트 내용 */}
          <div className="flex flex-col gap-[15px] items-center text-center w-full">
            <h2 className="text-Headline_L_Bold text-black">
              학습 코스가 생성되었습니다!
            </h2>
            <p className="text-Subtitle_L_Medium text-[#4C4C4C]">
              "{courseName || "나의 학습코스"}"
            </p>
            <p className="text-Body_L_Light text-[#4C4C4C]">
              학습 코스 목록에서 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.43)" }}
        onClick={onClose}
      >
      <div
        className="bg-white rounded-lg shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)] py-[60px] px-[122px] w-[800px] max-w-[90vw] min-h-[462px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-[10px]">
          <div className="flex items-center gap-[19px]">
            <div className="bg-main-1 p-2 rounded-lg flex items-center justify-center">
              <BrainIcon className="w-6 h-[26px]" color="#FFFFFF" />
            </div>
            <h2 className="text-Subtitle_L_Medium text-black">
              AI 학습 코스 생성
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-[19px] h-[19px] text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="닫기"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 학습 코스 이름 입력 */}
        <div className="flex flex-col gap-3 pt-5 mb-[2px]">
          <label className="text-Subtitle_S_Regular text-black">
            학습 코스 이름
          </label>
          <div className="bg-gray-100 border border-gray-300 rounded-lg pl-7 pr-[245px] py-4">
            <input
              type="text"
              placeholder="예 : 나만의 삼성전자 투자 전략"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full bg-transparent text-Body_M_Light text-black placeholder:text-black focus:outline-none"
            />
          </div>
        </div>

        {/* 난이도 선택 */}
        <div className="flex flex-col gap-3 pt-5 mb-[2px]">
          <label className="text-Subtitle_S_Regular text-black">난이도</label>
          <div className="flex gap-3">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDifficulty(opt.value)}
                className={cn(
                  "px-4 py-2 rounded-lg border transition-all text-Body_M_Light",
                  difficulty === opt.value
                    ? "bg-main-1 text-white border-main-1"
                    : "bg-white text-black border-gray-300 hover:bg-gray-50"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 키워드 선택 */}
        <div className="flex flex-col gap-0 mb-[30px]">
          <div className="flex items-center justify-between py-[10px]">
            <label className="text-Body_S_Light text-black">
              키워드 선택 (관심 종목 기반 추천)
            </label>
            <span className="text-Caption_M_Light text-gray-300">
              {selectedKeywords.size}개 선택
            </span>
          </div>

          {/* 첫 번째 줄 키워드 */}
          <div className="flex flex-wrap gap-4 mb-4">
            {availableKeywords.slice(0, 7).map((keyword) => {
              const isSelected = selectedKeywords.has(keyword);
              return (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => handleKeywordToggle(keyword)}
                  className={cn(
                    "inline-flex items-center justify-center px-[10px] py-1 rounded-[14px] border transition-all cursor-pointer",
                    isSelected
                      ? "bg-sub-blue text-white border-sub-blue"
                      : "bg-white text-sub-blue border-sub-blue hover:bg-gray-50"
                  )}
                >
                  <span className="text-Caption_L_Light">{keyword}</span>
                </button>
              );
            })}
          </div>

          {/* 두 번째 줄 키워드 */}
          <div className="flex flex-wrap gap-4">
            {availableKeywords.slice(7).map((keyword) => {
              const isSelected = selectedKeywords.has(keyword);
              return (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => handleKeywordToggle(keyword)}
                  className={cn(
                    "inline-flex items-center justify-center px-[10px] py-1 rounded-[14px] border transition-all cursor-pointer",
                    isSelected
                      ? "bg-sub-blue text-white border-sub-blue"
                      : "bg-white text-sub-blue border-sub-blue hover:bg-gray-50"
                  )}
                >
                  <span className="text-Caption_L_Light">{keyword}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 선택된 키워드 섹션 (키워드가 1개 이상일 때만 표시) */}
        {selectedKeywords.size > 0 && (
          <div className="flex flex-col gap-[12px] pt-[22px] mb-[30px]">
            <label className="text-Subtitle_S_Regular text-black">
              선택된 키워드
            </label>
            <div className="border border-sub-blue rounded-lg pl-7 pr-[245px] py-4 flex flex-wrap gap-[10px]">
              {Array.from(selectedKeywords).map((keyword) => (
                <div
                  key={keyword}
                  className="bg-sub-blue text-white inline-flex items-center gap-1 px-[10px] py-1 rounded-[14px]"
                >
                  <span className="text-Caption_L_Light">{keyword}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="flex items-center justify-center w-[13px] h-[13px] hover:opacity-70 transition-opacity"
                    aria-label={`${keyword} 제거`}
                  >
                    <CloseIcon className="w-[9px] h-[9px]" color="#FFFFFF" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI 미리보기 */}
        {selectedKeywords.size > 0 && (
          <div className="bg-[#C7F3EB] rounded-lg p-5 flex flex-col gap-[14px] mb-[30px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <div className="w-6 h-[26px] flex items-center justify-center">
                  <StarIcon className="w-6 h-[26px]" color="#4C4C4C" ariaLabel="AI 생성 학습 내용" />
                </div>
                <h3 className="text-Subtitle_S_Regular text-[#4C4C4C]">
                  AI 코스 미리보기
                </h3>
              </div>
              <button
                type="button"
                onClick={handlePreview}
                disabled={previewLoading || !courseName.trim()}
                className="text-Caption_L_Light text-sub-blue hover:underline disabled:opacity-50"
              >
                {previewLoading ? "생성 중..." : "미리보기 생성"}
              </button>
            </div>
            <div className="flex flex-col gap-2 pl-5">
              {previewContent ? (
                <div className="text-Body_S_Regular text-[#4C4C4C] whitespace-pre-wrap">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-2 last:mb-0">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 last:mb-0">{children}</ol>,
                      li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
                      h1: ({ children }) => <h4 className="text-Subtitle_S_Regular mb-2">{children}</h4>,
                      h2: ({ children }) => <h4 className="text-Subtitle_S_Regular mb-2">{children}</h4>,
                      h3: ({ children }) => <h4 className="text-Subtitle_S_Regular mb-2">{children}</h4>,
                      strong: ({ children }) => <strong className="font-medium">{children}</strong>,
                    }}
                  >
                    {previewMarkdown}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-Body_S_Regular text-[#4C4C4C]">
                  "미리보기 생성" 버튼을 클릭하면 AI가 코스 소개를 생성합니다.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-[30px] py-[10px]">
          <Button
            variant="secondary"
            size="medium"
            onClick={handleCancel}
            className="!flex-1 !h-auto !py-2 !min-h-0 !min-w-0 !px-4 !bg-white !border-gray-300 !text-black"
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={handleCreate}
            disabled={!courseName.trim() || selectedKeywords.size === 0 || creating}
            className="!flex-1 !h-auto !py-2 !min-h-0 !min-w-0 !px-4 !bg-main-1 !text-white !border-main-1"
          >
            {creating ? "생성 중..." : "학습 코스 만들기"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AICourseCreateModal;
