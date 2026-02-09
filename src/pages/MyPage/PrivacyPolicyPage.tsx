import React from "react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicyPage: React.FC = () => {
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
              개인정보처리방침
            </button>
          </div>

          {/* 본문 카드 */}
          <section className="bg-white border border-gray-300 rounded-[4px] w-full px-[40px] py-[30px]">
            <div className="w-full p-[10px]">
              <h2 className="text-[24px] font-medium leading-[1.25] text-black mb-8">
                개인정보처리방침
              </h2>

              <div className="flex flex-col gap-6 text-[16px] leading-[1.75] text-black">
                <div>
                  <h3 className="text-[18px] font-medium mb-3">개인정보의 수집 항목</h3>
                  <p className="mb-3">서비스는 다음의 개인정보를 수집합니다.</p>
                  
                  <div className="mb-4">
                    <p className="font-medium mb-2">&lt;필수 정보&gt;</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>이메일 주소</li>
                      <li>닉네임</li>
                      <li>전화번호</li>
                      <li>비밀번호(암호화 저장)</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-medium mb-2">&lt;서비스 이용 과정에서 생성되는 정보&gt;</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>가상 투자 기록</li>
                      <li>챌린지·랭킹 참여 기록</li>
                      <li>서비스 이용 로그</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">개인정보의 수집 및 이용 목적</h3>
                  <p className="mb-2">수집한 개인정보는 다음의 목적을 위해 사용됩니다.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>회원 식별 및 계정 관리</li>
                    <li>가상 투자, 랭킹, 챌린지 기능 제공</li>
                    <li>서비스 이용 통계 및 개선</li>
                    <li>부정 이용 방지 및 보안 강화</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">개인정보의 보유 및 이용 기간</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>개인정보는 회원 탈퇴 시까지 보유합니다.</li>
                    <li>관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관 후 파기합니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">개인정보의 제3자 제공</h3>
                  <p>
                    서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
                    단, 법령에 따라 요구되는 경우에는 예외로 합니다.
                  </p>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">개인정보의 파기 절차 및 방법</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>보유 기간이 종료된 개인정보는 지체 없이 파기합니다.</li>
                    <li>전자적 파일 형태의 정보는 복구 불가능한 방법으로 삭제합니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">이용자의 권리</h3>
                  <p className="mb-2">이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>개인정보 열람 및 수정</li>
                    <li>회원 탈퇴 및 개인정보 삭제 요청</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[18px] font-medium mb-3">개인정보 보호를 위한 조치</h3>
                  <p className="mb-2">서비스는 개인정보 보호를 위해 다음과 같은 조치를 취합니다.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>비밀번호 암호화 저장</li>
                    <li>접근 권한 관리</li>
                    <li>보안 취약점 점검</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;


