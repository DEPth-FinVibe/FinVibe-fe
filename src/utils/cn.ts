import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * 커스텀 폰트 사이즈와 색상을 tailwind-merge가 인식하도록 확장합니다.
 */
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-Headline_L_Bold",
        "text-Headline_M_Bold",
        "text-Headline_S_Bold",
        "text-Title_L_Medium",
        "text-Title_M_Medium",
        "text-Subtitle_L_Regular",
        "text-Subtitle_M_Regular",
        "text-Subtitle_S_Regular",
        "text-Subtitle_L_Medium",
        "text-Subtitle_M_Medium",
        "text-Subtitle_S_Medium",
        "text-Body_L_Light",
        "text-Body_M_Light",
        "text-Body_S_Light",
        "text-Body_L_Regular",
        "text-Body_M_Regular",
        "text-Body_S_Regular",
        "text-Caption_L_Light",
        "text-Caption_M_Light",
      ],
    },
  },
});

/**
 * 클래스 이름을 병합하는 유틸리티 함수
 * clsx와 tailwind-merge를 결합하여 Tailwind 클래스 충돌을 해결합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
