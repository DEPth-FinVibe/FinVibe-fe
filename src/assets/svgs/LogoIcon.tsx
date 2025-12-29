import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

// 일단, svg 파일은 이런식으로 만드는데, div를 저렇게 위로 감싸서 하면 이 아이콘 전체의 스타일과 외부와의 관계를 관리하는 것이고,
// svg의 크기를 세부적으로 조절하고 싶으면 svg 태그 내부에 className을 추가하여 조절하면 될 것 같습니다.

const LogoIcon: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "bg-teal-400 p-2 border-none rounded-lg flex items-center justify-center",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 35 28"
        fill="none"
        className="w-9 h-7"
      >
        <path
          d="M4.45264 6.70996H14.4526"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          d="M4.45264 24.71L4.45264 6.70996"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          d="M1.45239 15.2099L16.4524 15.2099L22.771 24.5916L33.2709 11.0918"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
};

export default LogoIcon;
