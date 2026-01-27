import React, { useEffect } from "react";
import { Button } from "@/components";
import { cn } from "@/utils/cn";
import ErrorIconMyPage from "@/assets/svgs/ErrorIconMyPage";

export interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw?: () => void;
  className?: string;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  onWithdraw,
  className,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed left-0 right-0 bottom-0 top-20 z-40 flex items-center justify-center bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="회원 탈퇴"
    >
      <div
        className={cn(
          "bg-white rounded-lg shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)]",
          "w-[910px] max-w-[90vw]",
          "py-[60px] flex flex-col gap-[10px]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-Title_L_Medium text-black text-center">
          정말 떠나시겠어요?
        </h2>

        {/* 경고 박스 */}
        <div className="pt-[22px] px-[122px] w-full">
          <div className="bg-etc-light-red border border-red-600 rounded-lg p-[30px] w-full">
            <div className="flex flex-col gap-[50px] w-full">
              <div className="flex items-center gap-[30px] w-full">
                <ErrorIconMyPage className="w-6 h-6 shrink-0" />
                <p className="text-[18px] leading-[18px] font-medium">
                  <span className="text-[#4C4C4C]">탈퇴 시 보유하신</span>{" "}
                  <span className="text-red-600">
                    총 자산, 포트폴리오, 배지, XP가 모두 즉시 삭제
                  </span>
                  <span className="text-[#4C4C4C]">됩니다.</span>
                </p>
              </div>

              <div className="px-[50px] w-full">
                <p className="text-Subtitle_S_Regular text-red-600">
                  삭제된 데이터는 복수할 수 없습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="py-[30px] w-full">
          <p className="text-Subtitle_S_Regular text-black text-center">
            위 내용을 모두 확인하였으며, 데이터 삭제에 동의합니다.
          </p>
        </div>

        {/* 버튼 */}
        <div className="px-[122px] pt-[30px] pb-[10px] w-full flex gap-[30px]">
          <Button
            variant="primary"
            size="large"
            className="!flex-1 !bg-main-1 !text-white !border-main-1 !py-2 !min-h-0 rounded"
            onClick={onClose}
          >
            취소
          </Button>

          <Button
            variant="secondary"
            size="large"
            className="!flex-1 !bg-white !text-black !border-gray-300 !py-2 !min-h-0 rounded"
            onClick={() => onWithdraw?.()}
          >
            탈퇴하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;


