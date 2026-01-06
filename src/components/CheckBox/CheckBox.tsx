import React from "react";
import { cn } from "@/utils/cn";
import ThunderIcon from "@/assets/svgs/ThunderIcon";
import CheckIcon from "@/assets/svgs/CheckIcon";

export interface CheckBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  title?: string;
  description?: string;
}

export const CheckBox = ({
  checked = false,
  title = "공격적 투자",
  description = "높은 수익을 위해 리스크를 감수",
  className,
  ...props
}: CheckBoxProps) => {
  return (
    <div
      className={cn(
        "flex w-[328px] items-start gap-4 px-2.5 py-4 relative rounded-lg border border-solid",
        checked
          ? "bg-etc-light-blue border-sub-blue"
          : "bg-white border-gray-400",
        className
      )}
      role="button"
      tabIndex={0}
      aria-label={`${title} - ${description}`}
      aria-checked={checked}
      {...props}
    >
      <div
        className={cn(
          "inline-flex items-center gap-2.5 p-2 relative flex-none rounded-lg",
          checked ? "bg-sub-blue" : "bg-gray-100"
        )}
      >
        <ThunderIcon className={checked ? "text-white" : ""} />
      </div>

      <div className="flex flex-col flex-1 items-start gap-1 relative">
        <div className="flex h-5 items-center justify-between relative self-stretch w-full">
          <h3 className="text-black text-Body_M_Light whitespace-nowrap">
            {title}
          </h3>
          {checked && (
            <div className="relative w-6 h-6">
              <CheckIcon className="text-sub-blue" />
            </div>
          )}
        </div>
        <p className="text-gray-300 text-Caption_M_Light whitespace-nowrap">
          {description}
        </p>
      </div>
    </div>
  );
};

export const PropertyOff = (props: CheckBoxProps) => (
  <CheckBox {...props} checked={false} />
);

export const PropertyOn = (props: CheckBoxProps) => (
  <CheckBox {...props} checked={true} />
);