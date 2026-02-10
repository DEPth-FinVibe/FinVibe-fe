import React, { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

type Props = {
  isOpen: boolean;
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  className?: string;
};

const BG_GRAY_100 = "#EAEBED";
const MINT = "#42D6BA";

const CreateFolderPopover: React.FC<Props> = ({
  isOpen,
  value,
  onChange,
  onClose,
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
  className,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // open 시 input 포커스
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={rootRef}
      className={cn(
        "absolute left-0 top-full mt-2 z-20",
        "w-96",
        "rounded-lg",
        "shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)]",
        "px-5 py-2.5",
        "flex items-center justify-between gap-5",
        className
      )}
      style={{ backgroundColor: BG_GRAY_100 }}
      role="dialog"
      aria-label="새 폴더 만들기"
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="새 포트폴리오명...."
        disabled={isSubmitting}
        className={cn(
          "flex-1 bg-transparent",
          "text-[14px] leading-5 text-black",
          "underline underline-offset-2",
          "placeholder:text-black",
          "disabled:opacity-60",
          "focus:outline-none"
        )}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
      />

      {errorMessage && (
        <p className="absolute left-5 top-full mt-1 text-[12px] leading-[17px] text-red-600">
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        className={cn(
          "shrink-0 rounded-lg",
          "px-5 py-3",
          "text-[14px] leading-5 text-white",
          "disabled:opacity-60 disabled:cursor-not-allowed"
        )}
        style={{ backgroundColor: MINT }}
        disabled={isSubmitting || value.trim().length === 0}
        onClick={onSubmit}
      >
        완료
      </button>
    </div>
  );
};

export default CreateFolderPopover;


