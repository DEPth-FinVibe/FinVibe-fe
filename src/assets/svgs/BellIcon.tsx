import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

const BellIcon: React.FC<Props> = ({ className, onClick, ariaLabel }) => {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg active:scale-95 hover:bg-gray-200 transition-colors",
        "cursor-pointer",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="15"
        viewBox="0 0 14 15"
        fill="none"
        className="cursor-pointer"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.8411 10.9577C13.4364 10.2682 12.8347 8.31743 12.8347 5.76948C12.8347 2.58308 10.2226 0 7.00036 0C3.77815 0 1.16602 2.58308 1.16602 5.76948C1.16602 8.31815 0.563627 10.2682 0.15887 10.9577C-0.0515137 11.3144 -0.0530438 11.7552 0.154858 12.1134C0.362759 12.4716 0.748389 12.6926 1.16602 12.6929H4.14227C4.41977 14.0357 5.6144 15 7.00036 15C8.38633 15 9.58096 14.0357 9.85846 12.6929H12.8347C13.2522 12.6923 13.6376 12.4712 13.8453 12.1131C14.053 11.7549 14.0514 11.3143 13.8411 10.9577ZM7.00036 13.8468C6.25881 13.8465 5.59789 13.3842 5.35071 12.6929H8.65002C8.40284 13.3842 7.74191 13.8465 7.00036 13.8468ZM1.16602 11.539C1.72758 10.5841 2.33289 8.37152 2.33289 5.76948C2.33289 3.22036 4.42259 1.1539 7.00036 1.1539C9.57814 1.1539 11.6678 3.22036 11.6678 5.76948C11.6678 8.36935 12.2717 10.5819 12.8347 11.539H1.16602Z"
          fill="#696969"
        />
      </svg>
    </button>
  );
};

export default BellIcon;
