import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const CommentIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center cursor-pointer",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
      >
        <path
          d="M5.69418 16.0391C5.79711 16.2987 5.82003 16.5832 5.75998 16.856L5.01448 19.159C4.99046 19.2758 4.99667 19.3968 5.03253 19.5105C5.06838 19.6242 5.13269 19.7269 5.21935 19.8088C5.30601 19.8907 5.41216 19.9491 5.52772 19.9784C5.64329 20.0078 5.76444 20.0072 5.87968 19.9766L8.26878 19.278C8.52618 19.2269 8.79275 19.2492 9.03808 19.3424C10.5328 20.0404 12.2261 20.1881 13.8192 19.7594C15.4122 19.3307 16.8027 18.353 17.7452 16.9991C18.6877 15.6451 19.1217 14.0017 18.9706 12.3589C18.8195 10.7161 18.0931 9.17949 16.9194 8.02011C15.7458 6.86073 14.2004 6.15311 12.5558 6.02211C10.9113 5.89111 9.27337 6.34515 7.93099 7.30411C6.58861 8.26308 5.62805 9.66534 5.21881 11.2635C4.80956 12.8616 4.97792 14.553 5.69418 16.0391Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default CommentIcon;
