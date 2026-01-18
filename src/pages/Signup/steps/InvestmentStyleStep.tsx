import React from "react";
import StyleCard from "../components/StyleCard";
import type { StyleType } from "../components/StyleCard";

interface InvestmentStyleStepProps {
  selectedStyle: StyleType | null;
  onSelect: (style: StyleType) => void;
  onNext: () => void;
  onPrev: () => void;
}

const STYLES: { type: StyleType; title: string; description: string }[] = [
  { type: "aggressive", title: "공격적 투자", description: "높은 수익을 위해 리스크를 감수" },
  { type: "growth", title: "성장주 중심", description: "성장 가능성이 높은 기업에 투자" },
  { type: "stable", title: "안정적 투자", description: "배당주와 우량주 중심 투자" },
  { type: "value", title: "가치 투자", description: "저평가된 기업을 발굴하여 투자" },
  { type: "index", title: "인덱스 추종", description: "시장 지수를 따라가는 투자" },
  { type: "social", title: "소셜 트레이딩", description: "다른 투자자들의 전략 참고" },
];

const InvestmentStyleStep: React.FC<InvestmentStyleStepProps> = ({ selectedStyle, onSelect, onNext, onPrev }) => {
  return (
    <div className="flex flex-col gap-[10px] w-full font-noto">
      <div className="flex flex-col gap-[2px]">
        <div className="px-[122px] pt-[22px]">
          <h2 className="text-[16px] font-normal text-black mb-[4px]">주식 투자 스타일</h2>
          <p className="text-[12px] font-light text-gray-500 mb-[16px]">
            자신의 투자 성향에 맞는 스타일을 선택해주세요
          </p>
        </div>
      </div>
      <div className="px-[122px] grid grid-cols-2 gap-[12px]">
        {STYLES.map((style) => (
          <StyleCard
            key={style.type}
            type={style.type}
            title={style.title}
            description={style.description}
            selected={selectedStyle === style.type}
            onClick={() => onSelect(style.type)}
          />
        ))}
      </div>
      <div className="px-[122px] flex gap-[30px] mt-[20px] py-[10px]">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 bg-white border border-[#909193] py-[10px] text-[#909193] text-[16px] font-light rounded-[4px] hover:bg-gray-50 transition-colors"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedStyle}
          className="flex-1 bg-[#42d6ba] py-[10px] text-white text-[16px] font-light rounded-[4px] disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-[20px]"
        >
          <span>완료</span>
          <span>&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default InvestmentStyleStep;

