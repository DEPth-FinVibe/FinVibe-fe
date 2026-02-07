import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components";
import { cn } from "@/utils/cn";
import CloseIcon from "@/assets/svgs/CloseIcon";

export interface NicknameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 초기 닉네임(현재 닉네임) */
  currentNickname?: string;
  className?: string;
}

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{1,10}$/;

const NicknameChangeModal: React.FC<NicknameChangeModalProps> = ({
  isOpen,
  onClose,
  currentNickname = "주식왕핀봇",
  className,
}) => {
  const [nickname, setNickname] = useState(currentNickname);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const helperText = useMemo(() => "최대 10자, 특수문자 불가", []);
  const isValid = useMemo(
    () => NICKNAME_REGEX.test(nickname.trim()),
    [nickname]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed left-0 right-0 bottom-0 top-20 z-40 flex items-center justify-center bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="닉네임 변경"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-white rounded-lg border border-black/5 shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)]",
          "w-full max-w-md",
          "py-2.5 flex flex-col gap-2.5",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="border-b border-gray-300 flex items-center justify-between px-8 py-5">
          <p className="text-Subtitle_L_Medium text-black">닉네임 변경</p>
          <button
            type="button"
            onClick={onClose}
            className="size-5 flex items-center justify-center"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>

        {/* 입력 영역 */}
        <div className="flex flex-col gap-1 pt-2.5 w-full">
          <div className="px-10 py-2.5">
            <p className="text-Subtitle_S_Regular text-black">현재 닉네임</p>
          </div>

          <div className="flex gap-2 px-10 w-full items-start">
            <div className="bg-gray-100 p-2.5 rounded-lg w-64">
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-transparent outline-none text-Body_M_Light text-black"
                aria-label="닉네임"
              />
            </div>

            <Button
              variant="secondary"
              size="small"
              className={cn(
                "!px-5 !py-3 !min-h-0 rounded-lg !bg-white !border-gray-1 !text-[#4C4C4C]",
                "whitespace-nowrap"
              )}
              onClick={() => {
                // TODO: 닉네임 중복 확인 API 연동
                console.log("닉네임 중복확인:", nickname);
              }}
            >
              중복확인
            </Button>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="px-12 pb-5 w-full">
          <p className="text-Caption_L_Light text-black">
            {helperText}
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className="border-t border-gray-300 pt-5 pb-2.5 px-12 w-full">
          <Button
            variant="primary"
            size="large"
            disabled={!isValid}
            className="!w-full !bg-main-1 !border-main-1 !text-white !py-2 !min-h-0 rounded"
            onClick={() => {
              // TODO: 닉네임 변경 저장 API 연동
              console.log("닉네임 저장:", nickname);
              onClose();
            }}
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NicknameChangeModal;


