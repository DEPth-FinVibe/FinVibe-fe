import React from "react";
import { cn } from "@/utils/cn";

interface PasswordStrengthProps {
  strength: 0 | 1 | 2 | 3 | 4 | 5;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ strength }) => {
  const getStrengthText = () => {
    switch (strength) {
      case 0: return "없음";
      case 1:
      case 2: return "약함";
      case 3:
      case 4: return "보통";
      case 5: return "강함";
      default: return "";
    }
  };

  const getStrengthColor = () => {
    if (strength <= 2) return "text-etc-red";
    if (strength <= 4) return "text-point-yellow";
    return "text-etc-green";
  };

  return (
    <div className="flex flex-col gap-[9px] w-full font-noto">
      <div className="flex items-center justify-between text-[12px] font-light">
        <p className="text-black">비밀번호 강도 :</p>
        <p className={cn(getStrengthColor())}>{getStrengthText()}</p>
      </div>
      <div className="flex gap-[8px] w-full">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className={cn(
              "h-[4px] flex-1 rounded-[2px] transition-colors",
              idx <= strength ? "bg-main-1" : "bg-gray-1"
            )}
          />
        ))}
      </div>
      <p className="text-[12px] font-light text-black">
        영문 대소문자, 숫자, 특수문자를 조합하세요
      </p>
    </div>
  );
};

export default PasswordStrength;

