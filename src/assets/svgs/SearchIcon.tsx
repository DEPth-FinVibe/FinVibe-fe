import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

const SearchIcon: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
      >
        <path
          d="M8.5 0C13.1944 0 17 3.80558 17 8.5C17 10.5771 16.2531 12.4786 15.0156 13.9551L20.5303 19.4697L19.4697 20.5303L13.9551 15.0156C12.4786 16.2531 10.5771 17 8.5 17C3.80558 17 0 13.1944 0 8.5C0 3.80558 3.80558 0 8.5 0ZM8.5 1.5C4.63401 1.5 1.5 4.63401 1.5 8.5C1.5 12.366 4.63401 15.5 8.5 15.5C12.366 15.5 15.5 12.366 15.5 8.5C15.5 4.63401 12.366 1.5 8.5 1.5Z"
          fill="#717478"
        />
      </svg>
    </div>
  );
};

export default SearchIcon;
