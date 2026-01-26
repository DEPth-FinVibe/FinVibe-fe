import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "@/assets/svgs/BackIcon";
import { Button } from "@/components";
import { cn } from "@/utils/cn";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, className }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "w-[100px] h-[50px] rounded-full relative transition-colors",
        checked ? "bg-main-1" : "bg-gray-300",
        className
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          // thumb은 항상 "왼쪽 기준"으로 두고 translate로만 이동시켜야 상태가 명확함
          "absolute left-0 top-[5px] w-10 h-10 rounded-full bg-white transition-transform",
          checked ? "translate-x-[55px]" : "translate-x-[5px]"
        )}
      />
    </button>
  );
};

const Row: React.FC<{
  left: React.ReactNode;
  right?: React.ReactNode;
  divider?: boolean;
}> = ({ left, right, divider = false }) => (
  <div className={cn("flex items-center justify-between w-full py-[10px]", divider && "border-b border-gray-300")}>
    <div className="w-[400px] p-[10px]">{left}</div>
    <div className="w-[400px] p-[10px] flex items-center justify-end">{right}</div>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="bg-white border border-gray-300 rounded-[4px] w-full px-10 py-[30px] flex flex-col gap-[30px]">
    <div className="w-full p-[10px]">
      <h2 className="text-Title_L_Medium text-black">{title}</h2>
    </div>
    <div className="flex flex-col gap-5">{children}</div>
  </section>
);

const MyPageSettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [allNoti, setAllNoti] = useState(true);
  const [commentNoti, setCommentNoti] = useState(true);
  const [tradeNoti, setTradeNoti] = useState(true);

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
      <main className="px-8 2xl:px-[240px] py-5">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-[30px]">
          {/* 상단 타이틀 */}
          <div className="w-full px-[50px] py-[10px] flex items-center">
            <button
              type="button"
              onClick={() => navigate("/mypage")}
              className="flex items-center gap-5 text-Headline_L_Bold text-black"
            >
              <BackIcon className="w-8 h-8" />
              설정
            </button>
          </div>

          {/* 알림 */}
          <Section title="알림">
            <Row
              left={<p className="text-Title_M_Medium text-black">전체 알림</p>}
              right={<Toggle checked={allNoti} onChange={setAllNoti} />}
            />
            <Row
              left={<p className="text-Title_M_Medium text-black">댓글 / 토론</p>}
              right={<Toggle checked={commentNoti} onChange={setCommentNoti} />}
            />
            <Row
              left={<p className="text-Title_M_Medium text-black">체결 / 수익률</p>}
              right={<Toggle checked={tradeNoti} onChange={setTradeNoti} />}
            />
          </Section>

          {/* 계정 */}
          <Section title="계정">
            <Row
              divider
              left={<p className="text-Subtitle_L_Medium text-black">이메일</p>}
              right={
                <p className="text-Title_M_Medium text-[#4C4C4C]">
                  Kakao_user@email.com
                </p>
              }
            />
            <Row
              left={<p className="text-Title_M_Medium text-black">닉네임 변경</p>}
              right={
                <Button
                  variant="secondary"
                  size="small"
                  className="!px-5 !py-[13px] !min-h-0 rounded-lg !bg-main-1 !border-main-1 !text-white"
                >
                  변경
                </Button>
              }
            />
          </Section>

          {/* 정보 */}
          <Section title="정보">
            <Row
              divider
              left={<p className="text-Subtitle_L_Medium text-black">버전 정보</p>}
              right={<p className="text-Title_M_Medium text-[#4C4C4C]">v1.0.2</p>}
            />
            <Row
              left={<p className="text-Title_M_Medium text-black">이용약관</p>}
              right={<span className="text-[18px] text-[#4C4C4C]">&gt;</span>}
            />
            <Row
              left={<p className="text-Title_M_Medium text-black">개인정보처리방침</p>}
              right={<span className="text-[18px] text-[#4C4C4C]">&gt;</span>}
            />
          </Section>

          {/* 로그아웃/회원탈퇴 */}
          <section className="bg-white border border-gray-300 rounded-[4px] w-full px-10 py-[30px] flex flex-col">
            <div className="flex flex-col gap-5 w-full">
              <Row
                divider
                left={<p className="text-Title_L_Medium text-black">로그아웃</p>}
                right={<span className="text-[18px] text-[#4C4C4C]">&gt;</span>}
              />
              <Row
                left={<p className="text-Title_M_Medium text-black">회원 탈퇴</p>}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyPageSettingsPage;


