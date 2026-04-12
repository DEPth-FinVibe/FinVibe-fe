import React, { useEffect } from "react";
import { Button } from "@/components";
import { cn } from "@/utils/cn";
import type { AuthSessionDto } from "@/api/auth/sessions";

export interface SessionLogoutConfirmModalProps {
  isOpen: boolean;
  session: AuthSessionDto | null;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  className?: string;
}

const SessionLogoutConfirmModal: React.FC<SessionLogoutConfirmModalProps> = ({
  isOpen,
  session,
  onClose,
  onConfirm,
  isSubmitting = false,
  className,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !session) return null;

  const deviceName = [session.browserName, session.osName].filter(Boolean).join(" / ") || "알 수 없는 기기";
  const deviceMeta = [session.location, session.ipAddress].filter(Boolean).join(" · ");

  return (
    <div
      className="fixed left-0 right-0 bottom-0 top-20 z-40 flex items-center justify-center bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="기기 로그아웃 확인"
      onClick={isSubmitting ? undefined : onClose}
    >
      <div
        className={cn(
          "bg-white rounded-lg border border-black/5 shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)]",
          "w-full max-w-2xl py-14 px-12 flex flex-col gap-8",
          className
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-Title_L_Medium text-black">이 기기에서 로그아웃할까요?</h2>
          <p className="text-Subtitle_S_Regular text-[#4C4C4C] break-keep">
            선택한 기기에서만 세션이 종료되며, 현재 사용 중인 기기에는 영향을 주지 않습니다.
          </p>
        </div>

        <div className="bg-gray-100 border border-gray-300 rounded-lg px-8 py-6 flex flex-col gap-3">
          <p className="text-Subtitle_L_Medium text-black">{deviceName}</p>
          {deviceMeta ? (
            <p className="text-Subtitle_S_Regular text-[#4C4C4C]">{deviceMeta}</p>
          ) : null}
        </div>

        <div className="w-full flex items-center justify-center gap-8">
          <Button
            variant="secondary"
            size="large"
            onClick={onClose}
            disabled={isSubmitting}
            className="!w-56 !bg-white !border-gray-300 !text-black !py-2 !min-h-0 rounded"
          >
            취소
          </Button>

          <Button
            variant="primary"
            size="large"
            onClick={onConfirm}
            loading={isSubmitting}
            className="!w-56 !bg-red-600 !border-red-600 !text-white !py-2 !min-h-0 rounded hover:!bg-red-700"
          >
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionLogoutConfirmModal;
