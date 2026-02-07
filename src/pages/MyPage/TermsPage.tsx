import React from "react";
import { useNavigate } from "react-router-dom";

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
      <main className="px-8 2xl:px-[240px] py-5">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-[30px]">
          {/* 상단 타이틀 */}
          <div className="w-full px-[50px] py-[10px] flex items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-5 text-[32px] font-bold leading-[1.25] text-black"
            >
              <span
                className="w-8 h-8 flex items-center justify-center text-[32px] leading-none"
                aria-hidden="true"
              >
                ←
              </span>
              이용약관
            </button>
          </div>

          {/* 본문 카드 */}
          <section className="bg-white border border-gray-300 rounded-[4px] w-full px-[40px] py-[30px]">
            <div className="w-full p-[10px] h-[1165px]">
              <p className="text-[24px] font-medium leading-[1.25] text-black">텍스트</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;


