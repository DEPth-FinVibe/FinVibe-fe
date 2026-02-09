import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

const PaperclipIcon: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full"
      >
        <path
          d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59718 21.9983 8.005 21.9983C6.41282 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00171 17.5872 2.00171 15.995C2.00171 14.4028 2.63416 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7185 1.38757 15.78 1.38757C16.8415 1.38757 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7825 4.32845 19.7825 5.39C19.7825 6.45155 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03482 17.7852 8.52574 17.9961 7.995 17.9961C7.46426 17.9961 6.95518 17.7852 6.58 17.41C6.20482 17.0348 5.99393 16.5257 5.99393 15.995C5.99393 15.4643 6.20482 14.9552 6.58 14.58L15.07 6.09"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default PaperclipIcon;

