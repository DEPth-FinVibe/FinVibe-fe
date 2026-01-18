import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

const LockIcon: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="11"
        viewBox="0 0 17 11"
        fill="none"
      >
        <path
          d="M14.1666 0.833252H2.49992C1.57944 0.833252 0.833252 1.57944 0.833252 2.49992V8.33325C0.833252 9.25373 1.57944 9.99992 2.49992 9.99992H14.1666C15.0871 9.99992 15.8333 9.25373 15.8333 8.33325V2.49992C15.8333 1.57944 15.0871 0.833252 14.1666 0.833252Z"
          stroke="#696969"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default LockIcon;
