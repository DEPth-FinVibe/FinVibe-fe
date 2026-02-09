import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  direction?: "up" | "down" | "left" | "right";
};

const ArrowIcon: React.FC<Props> = ({ className, direction = "right" }) => {
  const rotation = {
    up: "-rotate-90",
    down: "rotate-90",
    left: "rotate-180",
    right: "",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        className={cn("w-full h-full", rotation[direction])}
      >
        <path
          d="M5.5 3L10.5 7.5L5.5 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ArrowIcon;

