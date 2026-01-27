import React, { useEffect } from "react";
import { Button } from "@/components";
import { cn } from "@/utils/cn";

export interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
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
      aria-label="로그아웃"
    >
      <div
        className={cn(
          "bg-white rounded-[8px] shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)]",
          "w-[620px] max-w-[90vw]",
          "py-[60px] flex flex-col gap-[10px]",
          className
        )}
      >
        <p className="text-Title_L_Medium text-black text-center">
          로그아웃 하시겠습니까?
        </p>

        <div className="w-full flex items-center justify-center gap-[30px] pt-[30px] pb-[10px] px-[75px]">
          <Button
            variant="secondary"
            size="large"
            onClick={onClose}
            className="!w-[220px] !bg-white !border-gray-300 !text-black !py-2 !min-h-0 rounded-[4px]"
          >
            취소
          </Button>

          <Button
            variant="primary"
            size="large"
            onClick={onConfirm}
            className="!w-[220px] !bg-main-1 !border-main-1 !text-white !py-2 !min-h-0 rounded-[4px]"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;


