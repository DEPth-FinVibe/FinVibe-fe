import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import TargetIcon from "@/assets/svgs/TargetIcon";
import ShieldIcon from "@/assets/svgs/ShieldIcon";
import GraphIcon from "@/assets/svgs/GraphIcon";
import CloseIcon from "@/assets/svgs/CloseIcon";

type FolderKey = "growth" | "hedge" | "unassigned" | "scalp";

type FolderMeta = {
  key: FolderKey;
  label: string;
  tone: "red" | "blue" | "gray";
};

const FOLDERS: FolderMeta[] = [
  { key: "growth", label: "주력 성장주", tone: "red" },
  { key: "hedge", label: "헷지용", tone: "blue" },
  { key: "unassigned", label: "미분류", tone: "gray" },
];

const formatWon = (value: number) => `₩${value.toLocaleString()}`;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const FolderChip: React.FC<{ folder: FolderMeta }> = ({ folder }) => {
  const styles =
    folder.tone === "red"
      ? {
          wrap: "bg-etc-light-red text-etc-red",
          icon: "text-etc-red",
          Icon: GraphIcon,
        }
      : folder.tone === "blue"
        ? {
            wrap: "bg-etc-light-blue text-etc-blue",
            icon: "text-etc-blue",
            Icon: ShieldIcon,
          }
        : {
            wrap: "bg-white border border-gray-300 text-[#4C4C4C]",
            icon: "text-[#4C4C4C]",
            Icon: CloseIcon,
          };

  const IconComp = styles.Icon as React.ComponentType<{ className?: string; color?: string; ariaLabel?: string }>;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full",
        styles.wrap
      )}
    >
      {folder.tone === "blue" ? (
        <ShieldIcon className="w-6 h-[26px] shrink-0" color="currentColor" ariaLabel={folder.label} />
      ) : folder.tone === "gray" ? (
        <CloseIcon className={cn("size-6 shrink-0", styles.icon)} ariaLabel={folder.label} />
      ) : (
        <IconComp className={cn("w-6 h-[26px] shrink-0", styles.icon)} ariaLabel={folder.label} />
      )}
      <span className="text-Subtitle_S_Regular">{folder.label}</span>
    </span>
  );
};

const MyPortfolioManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"folder" | "all">("folder");

  // TODO: API 연동 시 교체 (피그마 더미 데이터)
  const learningProgress = 65;

  const barData = useMemo(
    () => [
      { label: "주력 성장주", value: 15, tone: "red" as const },
      { label: "헷지용", value: -1.4, tone: "blue" as const },
      { label: "단타 연습", value: 4, tone: "red" as const },
    ],
    []
  );

  const yMin = -6;
  const yMax = 18;
  const ticks = [18, 12, 6, 0, -6];

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
      <main className="px-8 2xl:px-60 py-5">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-8 py-5">
          {/* 타이틀 */}
          <div className="w-full px-12 py-2.5 flex items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-5 text-Headline_L_Bold text-black"
            >
              <span className="w-8 h-8 flex items-center justify-center text-Headline_L_Bold leading-none" aria-hidden="true">
                ←
              </span>
              포트폴리오 관리
            </button>
          </div>

          {/* 1) 폴더별 수익률 비교 */}
          <section className="bg-white border border-gray-300 rounded-lg w-full px-10 py-8 flex flex-col gap-8">
            <div className="w-full py-2.5">
              <h2 className="text-Title_L_Medium text-black">폴더별 수익률 비교</h2>
            </div>

            {/* 차트(바) + 요약 테이블 */}
            <div className="w-full flex flex-col gap-6">
              {/* Bar chart */}
              <div className="w-full">
                <div className="grid grid-cols-[80px_1fr] gap-6">
                  {/* Y축 라벨 */}
                  <div className="flex flex-col justify-between text-[14px] leading-5 text-[#666] py-2">
                    {ticks.map((t) => (
                      <div key={t} className="flex items-center justify-end">
                        {t}%
                      </div>
                    ))}
                  </div>

                  {/* 플롯 영역 */}
                  <div className="relative h-56 border-b border-dashed border-gray-200">
                    {/* 그리드 라인 */}
                    {ticks.map((t) => {
                      const y = ((yMax - t) / (yMax - yMin)) * 100;
                      return (
                        <div
                          key={`grid-${t}`}
                          className="absolute left-0 right-0 border-t border-dashed border-gray-200 opacity-60"
                          style={{ top: `${y}%` }}
                        />
                      );
                    })}

                    {/* 0라인 강조 */}
                    <div
                      className="absolute left-0 right-0 border-t border-dashed border-gray-300"
                      style={{ top: `${((yMax - 0) / (yMax - yMin)) * 100}%` }}
                    />

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end justify-around px-10">
                      {barData.map((b) => {
                        const v = clamp(b.value, yMin, yMax);
                        const zeroPct = ((yMax - 0) / (yMax - yMin)) * 100;
                        const valPct = ((yMax - v) / (yMax - yMin)) * 100;
                        const top = Math.min(zeroPct, valPct);
                        const height = Math.abs(zeroPct - valPct);
                        const color = b.tone === "blue" ? "bg-[#3B82F6]" : "bg-etc-red";
                        return (
                          <div key={b.label} className="flex flex-col items-center gap-2 w-40">
                            <div className="relative w-full h-48">
                              <div className={cn("absolute left-0 right-0 rounded", color)} style={{ top: `${top}%`, height: `${height}%` }} />
                            </div>
                            <p className="text-[14px] leading-5 text-[#666]">{b.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 요약 테이블 (폴더명/총 평가금/수익률/실현 수익) */}
              <div className="w-full border-t border-gray-200">
                <div className="grid grid-cols-[1.5fr_1fr_0.7fr_0.7fr] gap-6 items-center px-5 py-5 border-b border-gray-300 text-Subtitle_L_Medium text-black">
                  <div>폴더명</div>
                  <div>총 평가금</div>
                  <div>수익률</div>
                  <div className="text-right">실현 수익</div>
                </div>

                <div className="grid grid-cols-[1.5fr_1fr_0.7fr_0.7fr] gap-6 items-center px-5 py-5 border-b border-gray-200">
                  <div className="flex items-center gap-2.5">
                    <TargetIcon className="size-6 text-black" />
                    <p className="text-Subtitle_L_Medium text-black">주력 성장주</p>
                  </div>
                  <p className="text-Subtitle_L_Regular text-[#364153]">{formatWon(5_200_000)}</p>
                  <p className="text-Subtitle_M_Medium text-etc-red">+55.0%</p>
                  <p className="text-right text-Subtitle_S_Regular text-[#101828]">+{formatWon(450_000)}</p>
                </div>

                <div className="grid grid-cols-[1.5fr_1fr_0.7fr_0.7fr] gap-6 items-center px-5 py-5">
                  <div className="flex items-center gap-2.5">
                    <ShieldIcon className="w-6 h-[26px] text-sub-blue" ariaLabel="헷지용" />
                    <p className="text-Subtitle_L_Medium text-black">헷지용</p>
                  </div>
                  <p className="text-Subtitle_L_Regular text-[#101828]">{formatWon(2_800_000)}</p>
                  <p className="text-Subtitle_M_Medium text-[#007AFF]">-1.4%</p>
                  <p className="text-right text-Subtitle_S_Regular text-[#101828]">-{formatWon(30_000)}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2) 폴더/종목 관리 테이블 */}
          <section className="bg-white border border-gray-300 rounded-lg w-full p-10 flex flex-col gap-10">
            {/* 상단 버튼 */}
            <button type="button" className="bg-sub-blue text-white rounded px-4 py-2 w-fit text-Body_M_Regular">
              + 새 폴더 만들기
            </button>

            {/* 탭 */}
            <div className="w-full border-b border-gray-300 flex">
              <button
                type="button"
                onClick={() => setTab("folder")}
                className={cn(
                  "px-5 py-2.5 text-Subtitle_L_Regular",
                  tab === "folder" ? "border-b-2 border-main-1 text-black" : "text-black"
                )}
              >
                폴더별 보기
              </button>
              <button
                type="button"
                onClick={() => setTab("all")}
                className={cn(
                  "px-5 py-2.5 text-Subtitle_L_Regular",
                  tab === "all" ? "border-b-2 border-main-1 text-black" : "text-black"
                )}
              >
                전체 종목 보기
              </button>
            </div>

            {/* 테이블 */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[80px_1.2fr_0.6fr_0.6fr_1fr_0.8fr] items-center h-14 border-b border-gray-200 text-Subtitle_L_Medium text-[#4A5565]">
                  <div className="flex items-center justify-center">
                    <div className="size-5 border border-gray-300 rounded" aria-hidden="true" />
                  </div>
                  <div className="px-5">종목명</div>
                  <div className="px-5">보유수량</div>
                  <div className="text-center">현재가</div>
                  <div className="px-5">현재 폴더</div>
                  <div className="px-5">관리</div>
                </div>

                {[
                  { name: "삼성전자", qty: "10주", price: "72,000원", folder: FOLDERS[0] },
                  { name: "KODEX 인버스", qty: "50주", price: "4150원", folder: FOLDERS[1] },
                  { name: "카카오뱅크", qty: "5주", price: "25,000원", folder: FOLDERS[2] },
                ].map((row) => (
                  <div key={row.name} className="grid grid-cols-[80px_1.2fr_0.6fr_0.6fr_1fr_0.8fr] items-center h-20 border-b border-gray-100">
                    <div className="flex items-center justify-center">
                      <div className="size-5 border border-gray-300 rounded" aria-hidden="true" />
                    </div>
                    <div className="px-5 text-Subtitle_M_Regular text-[#101828]">{row.name}</div>
                    <div className="px-5 text-Subtitle_M_Regular text-[#364153]">{row.qty}</div>
                    <div className="text-right pr-6 text-Subtitle_M_Regular text-[#364153]">{row.price}</div>
                    <div className="px-5">
                      <FolderChip folder={row.folder} />
                    </div>
                    <div className="px-5 flex items-center gap-3">
                      <button type="button" className="border border-gray-200 rounded-lg px-5 py-3 text-[14px] leading-5 text-gray-300">
                        이동
                      </button>
                      <button type="button" className="bg-main-1 text-white rounded-lg px-5 py-3 text-[14px] leading-5">
                        매수 / 매도
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyPortfolioManagementPage;


