import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

const BackIcon: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className="w-6 h-6"
      >
        {/* SVG 코드를 입력해 주세요 */}
      </svg>
    </div>
  );
};

export default BackIcon;
