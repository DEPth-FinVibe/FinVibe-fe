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
          "bg-white rounded-lg border border-black/5 shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)]",
          "w-full max-w-2xl",
          "py-16 flex flex-col gap-2.5",
          className
        )}
      >
        <p className="text-Title_L_Medium text-black text-center">
          로그아웃 하시겠습니까?
        </p>

        <div className="w-full flex items-center justify-center gap-8 pt-8 pb-2.5 px-20">
          <Button
            variant="secondary"
            size="large"
            onClick={onClose}
            className="!w-56 !bg-white !border-gray-300 !text-black !py-2 !min-h-0 rounded"
          >
            취소
          </Button>

          <Button
            variant="primary"
            size="large"
            onClick={onConfirm}
            className="!w-56 !bg-main-1 !border-main-1 !text-white !py-2 !min-h-0 rounded"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;


