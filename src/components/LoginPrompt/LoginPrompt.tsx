import React from "react";
import { cn } from "@/utils/cn";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export interface LoginPromptProps {
  /** 안내 문구 */
  message?: string;
  /** 버튼 라벨 */
  actionLabel?: string;
  className?: string;
}

/**
 * 비로그인 사용자에게 로그인을 유도하는 배너.
 * 클릭 시 현재 경로를 기억한 채 로그인 페이지로 이동한다.
 */
const LoginPrompt: React.FC<LoginPromptProps> = ({
  message = "로그인하면 나의 기록을 확인할 수 있어요",
  actionLabel = "로그인하기",
  className,
}) => {
  const { redirectToLogin } = useRequireAuth();

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg px-6 py-4",
        className,
      )}
    >
      <span className="text-Body_M_Light text-gray-500">{message}</span>
      <button
        type="button"
        onClick={redirectToLogin}
        className="shrink-0 px-5 py-2 rounded-lg bg-main-1 text-white text-Body_M_Light hover:bg-main-2 transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default LoginPrompt;
