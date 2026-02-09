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
            <div className="w-full p-[10px]">
              <h2 className="text-[24px] font-medium leading-[1.25] text-black mb-8">
                FinVibe 서비스 이용약관
              </h2>

              <div className="flex flex-col gap-6 text-[16px] leading-[1.75] text-black">
                <div>
                  <h3 className="text-[18px] font-medium mb-3">제1조 (목적)</h3>
                  <p>
                    본 약관은 FinVibe(이하 "서비스")가 제공하는 실시간 주식 모의 투자 및 학습 서비스를 이용함에 있어, 서비스와 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
                  </p>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">제2조 (용어의 정의)</h3>
                  <ul className="list-none space-y-2">
                    <li>
                      <strong>서비스</strong>란 FinVibe가 제공하는 가상 투자 시뮬레이션, 경제 뉴스, 학습 콘텐츠, 챌린지, 랭킹 등 일체의 기능을 의미합니다.
                    </li>
                    <li>
                      <strong>이용자</strong>란 본 약관에 동의하고 서비스를 이용하는 회원을 의미합니다.
                    </li>
                    <li>
                      <strong>가상 투자</strong>란 실제 금전이 아닌 가상의 자산을 활용하여 이루어지는 투자 시뮬레이션을 의미합니다.
                    </li>
                    <li>
                      <strong>콘텐츠</strong>란 서비스 내 제공되는 뉴스, 텍스트, 이미지, 데이터, UI 요소 등을 의미합니다.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">제3조 (약관의 효력 및 변경)</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>본 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다.</li>
                    <li>서비스는 관련 법령을 위반하지 않는 범위 내에서 약관을 변경할 수 있으며, 변경 시 사전 공지를 원칙으로 합니다.</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">제4조 (서비스의 성격 및 제한)</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>FinVibe는 교육·학습 및 정보 제공 목적의 가상 투자 서비스입니다.</li>
                    <li>서비스에서 제공되는 투자 데이터, 수익률, 랭킹, 챌린지 결과는 실제 금융 투자 결과와 무관합니다.</li>
                    <li>본 서비스는 투자 권유, 자문, 중개 행위를 제공하지 않습니다.</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">제5조 (이용자의 의무)</h3>
                  <p className="mb-2">이용자는 다음 행위를 하여서는 안 됩니다.</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>허위 정보 입력 또는 타인의 정보 도용</li>
                    <li>서비스 운영을 방해하는 행위</li>
                    <li>허위 투자 정보 유포, 불법적인 금융 행위 유도</li>
                    <li>커뮤니티·토론 기능에서의 욕설, 비방, 허위 정보 게시</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">제6조 (서비스 이용 제한)</h3>
                  <p className="mb-2">서비스는 다음의 경우 이용을 제한할 수 있습니다.</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>약관 위반 시</li>
                    <li>서비스의 정상적인 운영을 방해한 경우</li>
                    <li>기타 서비스가 필요하다고 판단하는 경우</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">제7조 (면책 조항)</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>서비스에서 제공되는 모든 투자 정보 및 시뮬레이션 결과는 학습 목적이며, 실제 투자 판단에 대한 책임은 전적으로 이용자에게 있습니다.</li>
                    <li>서비스는 가상 투자 결과로 인한 재정적 손실에 대해 책임을 지지 않습니다.</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">제8조 (준거법 및 관할)</h3>
                  <p>
                    본 약관은 대한민국 법률을 준거법으로 하며, 서비스와 이용자 간 발생한 분쟁은 관련 법령에 따릅니다.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;


