import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const FirstProfitBadgeIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color = "#FE9A00",
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-full", className)}
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d="M19.7727 28.9922V32.2078C19.7652 32.8854 19.5838 33.5497 19.2458 34.137C18.9078 34.7243 18.4246 35.2149 17.8425 35.5618C16.6068 36.4771 15.6016 37.6679 14.9067 39.0398C14.2119 40.4116 13.8466 41.9266 13.8398 43.4644"
          stroke={color}
          strokeWidth="3.95522"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27.6855 28.9922V32.2078C27.693 32.8854 27.8744 33.5497 28.2124 34.137C28.5504 34.7243 29.0336 35.2149 29.6157 35.5618C30.8514 36.4771 31.8566 37.6679 32.5515 39.0398C33.2463 40.4116 33.6116 41.9266 33.6184 43.4644"
          stroke={color}
          strokeWidth="3.95522"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35.5957 17.7982H38.5621C39.8734 17.7982 41.1309 17.2773 42.0581 16.3501C42.9853 15.423 43.5062 14.1654 43.5062 12.8542C43.5062 11.5429 42.9853 10.2854 42.0581 9.35823C41.1309 8.43104 39.8734 7.91016 38.5621 7.91016H35.5957"
          stroke={color}
          strokeWidth="3.95522"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.90796 43.5078H39.5497"
          stroke={color}
          strokeWidth="3.95522"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.8633 17.7984C11.8633 20.9453 13.1134 23.9634 15.3387 26.1887C17.5639 28.4139 20.582 29.664 23.729 29.664C26.8759 29.664 29.894 28.4139 32.1193 26.1887C34.3445 23.9634 35.5946 20.9453 35.5946 17.7984V5.93269C35.5946 5.40819 35.3863 4.90518 35.0154 4.53431C34.6445 4.16343 34.1415 3.95508 33.617 3.95508H13.8409C13.3164 3.95508 12.8134 4.16343 12.4425 4.53431C12.0716 4.90518 11.8633 5.40819 11.8633 5.93269V17.7984Z"
          stroke={color}
          strokeWidth="3.95522"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.8658 17.7982H8.89935C7.58811 17.7982 6.33058 17.2773 5.4034 16.3501C4.47621 15.423 3.95532 14.1654 3.95532 12.8542C3.95532 11.5429 4.47621 10.2854 5.4034 9.35823C6.33058 8.43104 7.58811 7.91016 8.89935 7.91016H11.8658"
          stroke={color}
          strokeWidth="3.95522"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default FirstProfitBadgeIcon;


