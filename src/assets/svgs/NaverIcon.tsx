import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

const NaverIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-[26px]", className)}
    >
      <rect width="26" height="26" rx="4" fill="#03C75A" />
      <path
        d="M17.5 7.5V18.5H13.5L8.5 11.5V18.5H5.5V7.5H9.5L14.5 14.5V7.5H17.5Z"
        fill="white"
      />
    </svg>
  );
};

export default NaverIcon;

