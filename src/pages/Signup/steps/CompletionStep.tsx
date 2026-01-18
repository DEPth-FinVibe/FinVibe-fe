import React from "react";
import { Button } from "@/components";
import LogoIcon from "@/assets/svgs/LogoIcon";

interface CompletionStepProps {
  onComplete: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-[50px] py-[60px] w-full font-noto">
      <LogoIcon className="size-[110px]" />
      <div className="flex flex-col gap-[20px] text-center">
        <h1 className="text-[24px] font-medium text-black leading-[30px]">
          환영합니다!
        </h1>
        <p className="text-[16px] font-light text-gray-500 leading-[22px]">
          FinVibe 가입이 완료되었습니다.
        </p>
      </div>
      <div className="w-full px-[122px]">
        <button
          type="button"
          onClick={onComplete}
          className="w-full bg-[#42d6ba] py-[12px] text-white text-[18px] font-light rounded-[4px] hover:opacity-90 transition-opacity"
        >
          시작하기
        </button>
      </div>
    </div>
  );
};

export default CompletionStep;

