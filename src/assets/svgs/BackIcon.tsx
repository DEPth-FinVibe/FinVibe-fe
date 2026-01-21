import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

const BackIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-6 h-6", className)}
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
};

export default BackIcon;
