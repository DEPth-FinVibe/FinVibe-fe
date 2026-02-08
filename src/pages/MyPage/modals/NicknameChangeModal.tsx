import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components";
import { cn } from "@/utils/cn";
import CloseIcon from "@/assets/svgs/CloseIcon";
import { memberApi } from "@/api/member";
import { useAuthStore } from "@/store/useAuthStore";

export interface NicknameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{1,10}$/;

const NicknameChangeModal: React.FC<NicknameChangeModalProps> = ({
  isOpen,
  onClose,
  className,
}) => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [duplicateChecked, setDuplicateChecked] = useState(false);
  const [duplicateResult, setDuplicateResult] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user?.nickname) {
      setNickname(user.nickname);
      setDuplicateChecked(false);
      setDuplicateResult(null);
    }
  }, [isOpen, user?.nickname]);

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

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setDuplicateChecked(false);
    setDuplicateResult(null);
  };

  const handleCheckDuplicate = async () => {
    if (!isValid || checking) return;
    setChecking(true);
    try {
      const res = await memberApi.checkNickname(nickname.trim());
      setDuplicateChecked(true);
      setDuplicateResult(res.duplicate);
    } catch {
      alert("중복 확인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setChecking(false);
    }
  };

  const handleSave = async () => {
    if (!isValid || !duplicateChecked || duplicateResult || saving || !user) return;
    setSaving(true);
    try {
      const updated = await memberApi.changeNickname(user.userId, nickname.trim());
      setUser(updated);
      onClose();
    } catch {
      alert("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const canSave = isValid && duplicateChecked && !duplicateResult && !saving;

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
                onChange={(e) => handleNicknameChange(e.target.value)}
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
              disabled={!isValid || checking}
              onClick={handleCheckDuplicate}
            >
              {checking ? "확인 중..." : "중복확인"}
            </Button>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="px-12 pb-5 w-full">
          {duplicateChecked ? (
            duplicateResult ? (
              <p className="text-Caption_L_Light text-red-500">이미 사용 중인 닉네임입니다.</p>
            ) : (
              <p className="text-Caption_L_Light text-main-1">사용 가능한 닉네임입니다.</p>
            )
          ) : (
            <p className="text-Caption_L_Light text-black">{helperText}</p>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="border-t border-gray-300 pt-5 pb-2.5 px-12 w-full">
          <Button
            variant="primary"
            size="large"
            disabled={!canSave}
            className="!w-full !bg-main-1 !border-main-1 !text-white !py-2 !min-h-0 rounded"
            onClick={handleSave}
          >
            {saving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NicknameChangeModal;
