import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

// 일단, svg 파일은 이런식으로 만드는데, div를 저렇게 위로 감싸서 하면 이 아이콘 전체의 스타일과 외부와의 관계를 관리하는 것이고,
// svg의 크기를 세부적으로 조절하고 싶으면 svg 태그 내부에 className을 추가하여 조절하면 될 것 같습니다.

const LogoIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-[50px]", className)}
    >
      <path
        d="M0 8C0 3.58172 3.58172 0 8 0H42C46.4183 0 50 3.58172 50 8V42C50 46.4183 46.4183 50 42 50H8C3.58172 50 0 46.4183 0 42V8Z"
        fill="#42D6BA"
      />
      <path
        d="M12.1816 15.6184H22.1816"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12.1816 33.6184L12.1816 15.6184"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M9.1814 24.1183L24.1814 24.1183L30.5 33.5L40.9999 20.0002"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M36 19L42 19.0001"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M42 25L42.0001 19"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LogoIcon;
