import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

export interface FooterProps {
  className?: string;
}

type FooterLinkItem = {
  label: string;
  to: string;
};

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
};

/** 푸터 컬럼. 제목/본문 들여쓰기를 컬럼 단위로 통일해 세 컬럼의 좌측선을 맞춘다. */
const FooterColumn: React.FC<FooterColumnProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-Headline_S_Bold text-main-1 whitespace-nowrap w-fit border-b border-[#717478] pb-[10px]">
        {title}
      </p>
      {children}
    </div>
  );
};

const FooterLinkList: React.FC<{ items: FooterLinkItem[] }> = ({ items }) => (
  <div className="flex flex-col gap-[15px]">
    {items.map((item) => (
      <Link
        key={item.label}
        to={item.to}
        className="text-Subtitle_M_Medium text-black whitespace-nowrap w-fit hover:underline"
      >
        {item.label}
      </Link>
    ))}
  </div>
);

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("w-full bg-gray-100", className)}>
      <div className="mx-auto w-full max-w-[1920px] px-6 pt-[40px] pb-[40px] md:px-12 xl:px-[300px]">
        <div className="flex flex-col gap-[40px]">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-[60px]">
            <FooterColumn title="고객 지원">
              <FooterLinkList
                items={[
                  { label: "공지사항", to: "/notice" },
                  { label: "자주 묻는 질문", to: "/faq" },
                  { label: "1:1 문의", to: "/inquiry" },
                ]}
              />
            </FooterColumn>

            <FooterColumn title="정책">
              <FooterLinkList
                items={[
                  { label: "이용약관", to: "/mypage/terms" },
                  { label: "개인정보처리방침", to: "/mypage/privacy" },
                ]}
              />
            </FooterColumn>

            <FooterColumn title="FinVibe">
              <div className="flex flex-col gap-5">
                <p className="text-Subtitle_M_Medium text-black">
                  이메일: help@finvibe.com
                </p>
                <p className="text-Subtitle_S_Medium text-[#4C4C4C] max-w-[320px]">
                  본 서비스는 가상 투자 시뮬레이션이며, 실제 금융 거래가 발생하지
                  않습니다.
                </p>
              </div>
            </FooterColumn>
          </div>

          <div className="w-full border-t border-gray-300" />

          <p className="text-Subtitle_S_Regular text-black">
            © FinVibe Corp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
