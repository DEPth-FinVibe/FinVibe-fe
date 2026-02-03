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
        "absolute left-0 top-full mt-2 z-20",
        "w-fit min-w-24",
        "bg-gray-100",
        "rounded-lg",
        "shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)]",
        "px-5 py-2.5",
        "flex flex-col items-center gap-2.5",
        className
      )}
      role="listbox"
      aria-label="폴더 선택"
    >
      <div className="flex flex-col items-center gap-1">
        {options.length === 0 ? (
          <p className="text-[14px] leading-5 text-gray-400 whitespace-nowrap">
            폴더 없음
          </p>
        ) : (
          options.map((opt, idx) => {
            const active = pendingId != null && opt.id === pendingId;
            const textTone = idx % 2 === 1 ? "text-main-1" : "text-black";
            return (
              <button
                key={opt.id}
                type="button"
                className={cn(
                  "text-[14px] leading-5 whitespace-nowrap",
                  textTone,
                  active && "underline underline-offset-4"
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
          "rounded-lg",
          "px-5 py-3.5",
          "text-[14px] leading-5 text-white",
          "bg-main-1",
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


