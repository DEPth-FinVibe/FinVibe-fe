import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  gamificationApi,
  type MyChallengeItem,
  type ChallengeHistoryItem,
  type BadgeInfo,
} from "@/api/gamification/gamification";
import BadgeAwardsIcon from "@/assets/svgs/BadgeAwardsIcon";

const MyChallengesPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeChallenges, setActiveChallenges] = useState<MyChallengeItem[]>([]);
  const [completed, setCompleted] = useState<ChallengeHistoryItem[]>([]);
  const [badges, setBadges] = useState<BadgeInfo[]>([]);

  // 달성 완료 조회용 연/월
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  useEffect(() => {
    let alive = true;
    gamificationApi.getMyChallenges().then((data) => {
      if (alive) setActiveChallenges(data);
    }).catch(() => {});
    gamificationApi.getMyBadges().then((data) => {
      if (alive) setBadges(data);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    gamificationApi
      .getCompletedChallenges(String(year), String(month))
      .then((data) => {
        if (alive) setCompleted(data);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [year, month]);

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

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
              <span
                className="w-8 h-8 flex items-center justify-center text-Headline_L_Bold leading-none"
                aria-hidden="true"
              >
                &larr;
              </span>
              나의 챌린지 내역
            </button>
          </div>

          {/* 진행중인 챌린지 */}
          <section className="flex flex-col gap-5">
            <h2 className="text-Title_L_Medium text-black px-4">진행중인 챌린지</h2>
            {activeChallenges.length === 0 ? (
              <p className="text-Body_M_Light text-gray-400 px-4">진행중인 챌린지가 없습니다.</p>
            ) : (
              <div className="flex gap-5 flex-wrap">
                {activeChallenges.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white border border-gray-300 rounded-lg w-[340px] p-6 flex flex-col gap-4"
                  >
                    <p className="text-Subtitle_L_Medium text-black">{c.title}</p>
                    <p className="text-Body_M_Light text-gray-500 line-clamp-2">{c.description}</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-Caption_L_Light">
                        <span className="text-main-1 font-medium">{c.progressPercentage}%</span>
                        <span className="text-gray-400">D-{getDaysLeft(c.endDate)}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-main-1 rounded-full transition-all"
                          style={{ width: `${Math.min(100, c.progressPercentage)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-Caption_L_Light text-sub-blue">+{c.rewardXp} XP</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 달성 완료 */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-Title_L_Medium text-black">달성 완료</h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="text-gray-500 hover:text-black text-lg px-1"
                  aria-label="이전 달"
                >
                  &lt;
                </button>
                <span className="text-Subtitle_S_Regular text-black min-w-[100px] text-center">
                  {year}년 {month}월
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="text-gray-500 hover:text-black text-lg px-1"
                  aria-label="다음 달"
                >
                  &gt;
                </button>
              </div>
            </div>

            {completed.length === 0 ? (
              <p className="text-Body_M_Light text-gray-400 px-4">해당 월에 달성한 챌린지가 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {completed.map((c) => (
                  <div
                    key={c.challengeId}
                    className="bg-white border border-gray-300 rounded-lg px-6 py-4 flex items-center gap-5"
                  >
                    <div className="size-10 rounded-full bg-main-1 flex items-center justify-center shrink-0">
                      <BadgeAwardsIcon className="w-5 h-5" color="#FFFFFF" ariaLabel="챌린지" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-Subtitle_L_Regular text-black truncate">{c.title}</p>
                      <p className="text-Caption_L_Light text-gray-400">
                        {new Date(c.completedAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <span className="text-Caption_L_Light text-sub-blue shrink-0">+{c.rewardXp} XP</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 획득 배지 */}
          <section className="flex flex-col gap-5">
            <h2 className="text-Title_L_Medium text-black px-4">획득 배지</h2>
            {badges.length === 0 ? (
              <p className="text-Body_M_Light text-gray-400 px-4">획득한 배지가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {badges.map((b) => (
                  <div
                    key={b.badge}
                    className="bg-white border border-gray-300 rounded-lg p-5 flex flex-col items-center gap-3"
                  >
                    <div className="size-12 rounded-full bg-[#FFF4D6] flex items-center justify-center">
                      <BadgeAwardsIcon className="w-6 h-6" color="#FFD166" ariaLabel={b.displayName} />
                    </div>
                    <p className="text-Caption_L_Light text-black text-center">{b.displayName}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyChallengesPage;
