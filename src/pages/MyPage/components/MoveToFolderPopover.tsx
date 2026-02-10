import React, { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import type { PortfolioGroup } from "@/api/asset";

type Props = {
  isOpen: boolean;
  options: PortfolioGroup[];
  pendingId: number | null;
  onPendingChange: (id: number) => void;
  onConfirm: () => void;
  onClose: () => void;
  className?: string;
};

const MoveToFolderPopover: React.FC<Props> = ({
  isOpen,
  options,
  pendingId,
  onPendingChange,
  onConfirm,
  onClose,
  className,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

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
        "absolute left-0 top-full mt-2 z-[9999]",
        "w-fit min-w-24",
        "bg-gray-100",
        "rounded-lg",
        "shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)]",
        "px-5 py-2.5",
        "flex flex-col items-center gap-[10px]",
        className
      )}
      role="listbox"
      aria-label="폴더 선택"
    >
      <div className="flex flex-col items-center gap-[10px]">
        {options.length === 0 ? (
          <p className="text-[14px] leading-[20px] text-gray-400 whitespace-nowrap">
            폴더 없음
          </p>
        ) : (
          options.map((opt, idx) => {
            const active = pendingId != null && opt.id === pendingId;
            // 첫 번째부터 검정, main-1을 반복
            const textTone = idx % 2 === 0 ? "text-black" : "text-main-1";
            return (
              <button
                key={opt.id}
                type="button"
                className={cn(
                  "text-[14px] leading-[20px] whitespace-nowrap",
                  textTone
                )}
                role="option"
                aria-selected={active}
                onClick={() => onPendingChange(opt.id)}
              >
                {opt.name}
              </button>
            );
          })
        )}
      </div>

      <button
        type="button"
        className={cn(
          "bg-main-1",
          "rounded-lg",
          "px-[10px] py-[6px]",
          "text-[14px] leading-[20px] text-white",
          "inline-flex items-center justify-center gap-[10px]",
          "disabled:opacity-60 disabled:cursor-not-allowed"
        )}
        disabled={pendingId == null || options.length === 0}
        onClick={() => {
          if (pendingId == null) return;
          onConfirm();
          onClose();
        }}
      >
        완료
      </button>
    </div>
  );
};

export default MoveToFolderPopover;


