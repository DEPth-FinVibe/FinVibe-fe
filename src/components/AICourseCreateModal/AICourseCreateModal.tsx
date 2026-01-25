import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/Button";
import BrainIcon from "@/assets/svgs/BrainIcon";
import StarIcon from "@/assets/svgs/StarIcon";
import CloseIcon from "@/assets/svgs/CloseIcon";
import WhiteCheckCircleIcon from "@/assets/svgs/WhiteCheckCircleIcon";

export interface AICourseCreateModalProps {
  /** 모달 열림/닫힘 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 코스 생성 핸들러 */
  onCreate?: (courseName: string, keywords: string[]) => void;
  /** 사용 가능한 키워드 목록 */
  availableKeywords?: string[];
}

const DEFAULT_KEYWORDS = [
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

export const AICourseCreateModal: React.FC<AICourseCreateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  availableKeywords = DEFAULT_KEYWORDS,
}) => {
  const [courseName, setCourseName] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(
    new Set()
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
  };

  const handleRemoveKeyword = (keyword: string) => {
    const newSelected = new Set(selectedKeywords);
    newSelected.delete(keyword);
    setSelectedKeywords(newSelected);
  };

  // AI가 생성할 학습 내용 미리보기 (선택된 키워드 기반)
  const generatePreviewContent = (keywords: string[]): string[] => {
    if (keywords.length === 0) return [];
    
    // 예시 학습 내용 생성 (실제로는 API 호출로 대체)
    const previews: string[] = [];
    
    // 첫 번째 키워드 기반 내용
    if (keywords[0]) {
      previews.push(`${keywords[0]} 기초 개념 이해하기`);
    }
    
    // 공통 학습 내용
    previews.push("관련 차트 분석 및 지표 활용법");
    previews.push("실전 투자 전략 수집하기");
    previews.push("포트폴리오 구성 및 리스크 관리");
    
    return previews;
  };

  const handleCreate = () => {
    if (courseName.trim() && selectedKeywords.size > 0) {
      onCreate?.(courseName.trim(), Array.from(selectedKeywords));
      // 성공 모달 표시
      setShowSuccessModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    // 초기화
    setCourseName("");
    setSelectedKeywords(new Set());
    setShowSuccessModal(false);
    onClose();
  };

  const handleCancel = () => {
    setCourseName("");
    setSelectedKeywords(new Set());
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

        {/* AI가 생성할 학습 내용 미리보기 (키워드가 1개 이상일 때만 표시) */}
        {selectedKeywords.size > 0 && (
          <div className="bg-[#C7F3EB] rounded-lg p-5 flex flex-col gap-[14px] mb-[30px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-6 h-[26px] flex items-center justify-center">
                <StarIcon className="w-6 h-[26px]" color="#4C4C4C" ariaLabel="AI 생성 학습 내용" />
              </div>
              <h3 className="text-Subtitle_S_Regular text-[#4C4C4C]">
                AI가 생성할 학습 내용 미리보기
              </h3>
            </div>
            <div className="flex flex-col gap-2 pl-5">
              {generatePreviewContent(Array.from(selectedKeywords)).map(
                (content, index) => (
                  <div key={index} className="flex items-center gap-[10px]">
                    <span className="text-Subtitle_S_Regular text-[#4C4C4C]">
                      ·
                    </span>
                    <span className="text-Body_S_Regular text-[#4C4C4C]">
                      {content}
                    </span>
                  </div>
                )
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
            disabled={!courseName.trim() || selectedKeywords.size === 0}
            className="!flex-1 !h-auto !py-2 !min-h-0 !min-w-0 !px-4 !bg-main-1 !text-white !border-main-1"
          >
            학습 코스 만들기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AICourseCreateModal;

