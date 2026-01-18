import React from "react";
import { cn } from "@/utils/cn";

interface SchoolStepProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onSkip: () => void;
}

const SchoolStep: React.FC<SchoolStepProps> = ({ value, error, onChange, onNext, onSkip }) => {
  return (
    <div className="flex flex-col gap-[30px] w-full font-noto">
      <div className="flex flex-col gap-[2px]">
        <div className="px-[122px] pt-[22px]">
          <label className="block text-[16px] font-normal text-black mb-[12px]">학교</label>
          <input
            type="text"
            placeholder="예: 서울대학교"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "w-full bg-[#eaebed] border border-[#c7c7c9] rounded-[8px] px-[28px] py-[16px] text-[14px] font-light text-black placeholder:text-[#c7c7c9] focus:outline-none",
              error && "border-red-500"
            )}
          />
          {error && <p className="mt-2 text-[12px] text-red-500">{error}</p>}
        </div>
        <div className="px-[122px] py-[10px]">
          <p className="text-[12px] font-light text-black">
            재학 중인 학교 또는 졸업한 학교를 입력해주세요
          </p>
        </div>
        <div className="px-[122px]">
          <button
            type="button"
            onClick={onSkip}
            className="px-[20px] py-[10px] bg-white border border-[#909193] rounded-[8px] text-[14px] font-light text-[#909193] hover:bg-gray-50 transition-colors"
          >
            건너뛰기
          </button>
        </div>
      </div>
      <div className="px-[122px] w-full py-[10px]">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#42d6ba] py-[8px] text-white text-[16px] font-light rounded-[4px] flex items-center justify-center gap-[20px] hover:opacity-90 transition-opacity"
        >
          <span>다음</span>
          <span>&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default SchoolStep;

