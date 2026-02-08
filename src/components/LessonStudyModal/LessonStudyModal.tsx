import React from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/Button";
import CloseIcon from "@/assets/svgs/CloseIcon";
import type { LessonDetailResponse } from "@/api/study";

export interface LessonStudyModalProps {
  isOpen: boolean;
  lesson: LessonDetailResponse | null;
  loading?: boolean;
  completing?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onComplete: () => void;
}

export const LessonStudyModal: React.FC<LessonStudyModalProps> = ({
  isOpen,
  lesson,
  loading = false,
  completing = false,
  errorMessage,
  onClose,
  onComplete,
}) => {
  if (!isOpen) return null;

  const normalizedContent = lesson?.content?.replace(/\\n/g, "\n") ?? "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.43)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-[0px_10px_30px_0px_rgba(0,0,0,0.2)] w-[860px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-7 py-5 border-b border-gray-300 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-Caption_L_Light text-sub-blue">AI 학습 레슨</p>
            <h3 className="text-Subtitle_L_Medium text-black break-words">
              {lesson?.title ?? "레슨 불러오는 중..."}
            </h3>
            {lesson?.description && (
              <p className="text-Body_S_Light text-gray-500 break-words">{lesson.description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center shrink-0"
            aria-label="레슨 팝업 닫기"
          >
            <CloseIcon className="w-3 h-3" />
          </button>
        </header>

        <section className="px-7 py-6 overflow-y-auto bg-gray-50 flex-1">
          {loading ? (
            <div className="animate-pulse flex flex-col gap-3">
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-4/5 bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
            </div>
          ) : errorMessage ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-Body_S_Regular text-red-600">{errorMessage}</p>
            </div>
          ) : (
            <article className="bg-white border border-gray-300 rounded-lg p-6">
              <div className="prose prose-sm max-w-none text-[#4C4C4C] whitespace-pre-wrap leading-7">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5 mb-3">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5 mb-3">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    h1: ({ children }) => <h4 className="text-Subtitle_S_Regular text-black mb-3">{children}</h4>,
                    h2: ({ children }) => <h4 className="text-Subtitle_S_Regular text-black mb-3">{children}</h4>,
                    h3: ({ children }) => <h4 className="text-Subtitle_S_Regular text-black mb-3">{children}</h4>,
                    strong: ({ children }) => <strong className="font-medium text-black">{children}</strong>,
                  }}
                >
                  {normalizedContent || "학습 콘텐츠가 없습니다."}
                </ReactMarkdown>
              </div>
            </article>
          )}
        </section>

        <footer className="px-7 py-4 border-t border-gray-300 bg-white flex items-center justify-between gap-3">
          <div>
            {lesson?.completed ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-etc-light-green text-etc-green text-Caption_L_Light">
                완료된 레슨
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-etc-light-yellow text-[#A77700] text-Caption_L_Light">
                학습 진행 중
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="medium"
              onClick={onClose}
              className="!px-5 !py-2 !min-h-0"
            >
              닫기
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={onComplete}
              disabled={!lesson || loading || completing || lesson.completed}
              className="!bg-main-1 !text-white !border-main-1 !px-5 !py-2 !min-h-0"
            >
              {lesson?.completed ? "완료됨" : completing ? "완료 처리 중..." : "학습 완료"}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LessonStudyModal;
