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

  useEffect(() => {
    if (!isOpen) return;
    setNickname(currentNickname);
  }, [isOpen, currentNickname]);

  const helperText = useMemo(() => "최대 10자, 특수문자 불가", []);
  const isValid = useMemo(() => NICKNAME_REGEX.test(nickname.trim()), [nickname]);

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
          "bg-white rounded-[8px] shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)]",
          "w-[428px]",
          "py-[10px] flex flex-col gap-[10px]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="border-b border-gray-300 flex items-center justify-between px-[30px] py-[20px]">
          <p className="text-Subtitle_L_Medium text-black">닉네임 변경</p>
          <button
            type="button"
            onClick={onClose}
            className="w-[19px] h-[19px] flex items-center justify-center"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>

        {/* 입력 영역 */}
        <div className="flex flex-col gap-1 pt-[10px] w-full">
          <div className="px-[40px] py-[10px]">
            <p className="text-Subtitle_S_Regular text-black">현재 닉네임</p>
          </div>

          <div className="flex gap-2 px-[40px] w-full items-start">
            <div className="bg-gray-100 p-[10px] rounded-[8px] w-[251px]">
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-transparent outline-none text-[14px] leading-[20px] font-light text-black"
                aria-label="닉네임"
              />
            </div>

            <Button
              variant="secondary"
              size="small"
              className={cn(
                "!px-5 !py-[13px] !min-h-0 rounded-[8px] !bg-white !border-gray-100 !text-gray-300",
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
        <div className="px-[50px] pb-[20px] w-full">
          <p className="text-[12px] leading-[17px] font-light text-black">{helperText}</p>
        </div>

        {/* 하단 버튼 */}
        <div className="border-t border-gray-300 pt-[20px] pb-[10px] px-[50px] w-full">
          <Button
            variant="primary"
            size="large"
            disabled={!isValid}
            className="!w-full !bg-main-1 !border-main-1 !text-white !py-2 !min-h-0 rounded-[4px]"
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


