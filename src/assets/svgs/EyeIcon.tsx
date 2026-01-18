import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

const EyeIcon: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="13"
        viewBox="0 0 18 13"
        fill="none"
      >
        <path
          d="M0.800002 6.52345C0.733333 6.34703 0.733333 6.15297 0.800002 5.97655C1.44933 4.43001 2.55153 3.10768 3.96686 2.1772C5.38219 1.24673 7.04692 0.75 8.75 0.75C10.4531 0.75 12.1178 1.24673 13.5331 2.1772C14.9485 3.10768 16.0507 4.43001 16.7 5.97655C16.7667 6.15297 16.7667 6.34703 16.7 6.52345C16.0507 8.06999 14.9485 9.39232 13.5331 10.3228C12.1178 11.2533 10.4531 11.75 8.75 11.75C7.04692 11.75 5.38219 11.2533 3.96686 10.3228C2.55153 9.39232 1.44933 8.06999 0.800002 6.52345Z"
          stroke="#696969"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.75 8.75C10.1307 8.75 11.25 7.63071 11.25 6.25C11.25 4.86929 10.1307 3.75 8.75 3.75C7.36929 3.75 6.25 4.86929 6.25 6.25C6.25 7.63071 7.36929 8.75 8.75 8.75Z"
          stroke="#696969"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default EyeIcon;
