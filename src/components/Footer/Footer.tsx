import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import InstagramIcon from "@/assets/svgs/InstagramIcon";
import YoutubeIcon from "@/assets/svgs/YoutubeIcon";
import BookIcon from "@/assets/svgs/BookIcon";

export interface FooterProps {
  className?: string;
}

type FooterLinkItem = {
  label: string;
  to?: string;
};

type FooterCardProps = {
  title: string;
  items: FooterLinkItem[];
};

const FooterCard: React.FC<FooterCardProps> = ({ title, items }) => {
  return (
    <div className="bg-white rounded-[8px] px-[30px] pt-[20px] pb-[30px] w-full">
      <div className="w-full border-b border-[#717478] px-[20px] pt-[10px] pb-[20px]">
        <p className="text-Headline_L_Bold text-main-1">{title}</p>
      </div>

      <div className="flex flex-col gap-[27px] pt-[20px] px-[20px]">
        {items.map((item) => {
          const content = (
            <span className="text-Title_L_Medium text-black">{item.label}</span>
          );

          return item.to ? (
            <Link
              key={item.label}
              to={item.to}
              className="py-[5px] inline-flex items-center w-fit hover:underline"
            >
              {content}
            </Link>
          ) : (
            <div key={item.label} className="py-[5px] inline-flex items-center">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("w-full bg-[#EAEBED]", className)}>
      <div className="mx-auto w-full max-w-[1920px] px-6 py-10 md:px-12 xl:px-[240px]">
        <div className="flex flex-col gap-[40px]">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:gap-[60px]">
            <FooterCard
              title="서비스"
              items={[
                { label: "홈", to: "/" },
                { label: "투자 시뮬레이터", to: "/simulation" },
                { label: "AI 투자 학습", to: "/ai-learning" },
                { label: "뉴스&토론", to: "/news" },
                { label: "챌린지", to: "/challenge" },
              ]}
            />
            <FooterCard
              title="고객 지원"
              items={[
                { label: "공지사항", to: "/notice" },
                { label: "자주 묻는 질문", to: "/faq" },
                { label: "1:1 문의", to: "/inquiry" },
              ]}
            />
            <FooterCard
              title="정책"
              items={[
                { label: "이용약관", to: "/mypage/terms" },
                { label: "개인정보처리방침", to: "/mypage/privacy" },
                { label: "운영정책" },
              ]}
            />
          </div>

          <div className="w-full border-t border-gray-300" />

          <div className="w-full bg-white rounded-[8px] px-[30px] py-[20px] flex flex-col gap-[60px]">
            <p className="text-Headline_L_Bold text-main-1">FinVibe</p>

            <div className="flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[27px] px-[20px]">
                <p className="text-Title_L_Medium text-black">(주)핀바이브 ㅣ 대표: 000</p>
                <p className="text-Title_L_Medium text-black">
                  사업자등록번호: 123-45-67890 ㅣ 00시 00구 00로 000
                </p>
                <p className="text-Title_L_Medium text-black">
                  고객센터: 1588-0000 ㅣ 이메일: help@finvibe.com
                </p>
              </div>

              <div className="px-[20px]">
                <p className="text-Subtitle_L_Medium text-[#4C4C4C]">
                  본 서비스는 가상 투자 시뮬레이션이며, 실제 금융 거래가 발생하지 않습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-gray-300" />

          <div className="w-full flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-[20px]">
              <button
                type="button"
                aria-label="인스타그램"
                className="inline-flex items-center justify-center size-[30px]"
              >
                <InstagramIcon className="size-[30px]" />
              </button>
              <button
                type="button"
                aria-label="유튜브"
                className="inline-flex items-center justify-center size-[30px]"
              >
                <YoutubeIcon className="size-[30px]" />
              </button>
              <button
                type="button"
                aria-label="블로그"
                className="inline-flex items-center justify-center size-[30px]"
              >
                <BookIcon className="size-[30px]" color="#1D1E20" />
              </button>
            </div>

            <p className="text-Subtitle_L_Regular text-black">
              © FinVibe Corp. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


