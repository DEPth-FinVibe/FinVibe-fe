import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  color?: string;
  ariaLabel?: string;
};

/**
 * grayicon.svg 기반 프로필 아이콘
 * - viewBox만 유지하고 width/height는 className으로 제어 (컨테이너에 꽉 차게)
 */
const GrayProfileIcon: React.FC<Props> = ({
  className,
  color = "#696969",
  ariaLabel,
}) => {
  return (
    <svg
      viewBox="0 0 32 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
      role="img"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M16.4998 6C19.6089 6 22.0709 8.42797 22.0711 11.3525C22.0711 14.2773 19.609 16.7061 16.4998 16.7061C13.3908 16.706 10.9286 14.2772 10.9286 11.3525C10.9288 8.42802 13.3909 6.00007 16.4998 6Z"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M23 19.2949C25.7614 19.2949 27.9999 21.5336 28 24.2949V32.001H26V24.2949C25.9999 22.6381 24.6568 21.2949 23 21.2949H10C8.3432 21.2949 7.00009 22.6381 7 24.2949V32.001H5V24.2949C5.00009 21.5336 7.23863 19.2949 10 19.2949H23Z"
        fill={color}
      />
    </svg>
  );
};

export default GrayProfileIcon;


