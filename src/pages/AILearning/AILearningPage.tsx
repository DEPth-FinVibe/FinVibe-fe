import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CourseItem, Button } from "@/components";
import { AILearningInsight } from "@/components/AILearningInsight";
import { LearningStats } from "@/components/LearningStats";
import { AICourseCreateModal } from "@/components/AICourseCreateModal";
import { LessonStudyModal } from "@/components/LessonStudyModal";
import { cn } from "@/utils/cn";
import {
  BADGE_CONFIG,
  ALL_BADGE_TYPES,
  type BadgeType,
} from "@/components/Badge/badgeConfig";
import type { CourseLevel } from "@/components/Progress/CourseItem";
import {
  studyApi,
  type MyCourseResponse,
  type CourseDifficulty,
  type LessonDetailResponse,
  type MyStudyMetricResponse,
} from "@/api/study";
// import { gamificationApi, type BadgeInfo } from "@/api/gamification"; // 더미 데이터 사용으로 주석 처리

const DIFFICULTY_MAP: Record<CourseDifficulty, CourseLevel> = {
  BEGINNER: "초급",
  INTERMEDIATE: "중급",
  ADVANCED: "고급",
};

function calcProgress(course: MyCourseResponse): number {
  if (course.totalLessonCount === 0) return 0;
  const completed = course.lessons.filter((l) => l.completed).length;
  return Math.round((completed / course.totalLessonCount) * 100);
}

const SkeletonCourseList = () => (
  <div className="bg-white rounded-lg p-5 flex flex-col gap-5">
    <div className="animate-pulse flex flex-col gap-4">
      <div className="h-5 bg-gray-200 rounded w-1/4" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 items-start p-5 border-b border-gray-200">
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-2 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AILearningPage: React.FC = () => {
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // API 상태
  const [courses, setCourses] = useState<MyCourseResponse[]>([]);
  const [studyMetric, setStudyMetric] = useState<MyStudyMetricResponse | null>(null);
  const [todayAiRecommend, setTodayAiRecommend] = useState<string | null>(null);
  // const [badges, setBadges] = useState<BadgeInfo[]>([]); // 더미 데이터 사용으로 주석 처리
  const [loading, setLoading] = useState(true);

  // 레슨 학습 모달 상태
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonDetailResponse | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonCompleting, setLessonCompleting] = useState(false);
  const [lessonErrorMessage, setLessonErrorMessage] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const [coursesResult, metricResult, recommendResult] = await Promise.allSettled([
      studyApi.getMyCourses(),
      studyApi.getMyStudyMetric(),
      studyApi.getTodayAiStudyRecommend(),
      // gamificationApi.getMyBadges(), // 더미 데이터 사용으로 주석 처리
    ]);

    if (coursesResult.status === "fulfilled") {
      setCourses(coursesResult.value);
    }

    if (metricResult.status === "fulfilled") {
      setStudyMetric(metricResult.value);
    }

    if (recommendResult.status === "fulfilled") {
      const content = recommendResult.value.content?.trim();
      setTodayAiRecommend(content || null);
    } else {
      setTodayAiRecommend(null);
    }

    // 더미 데이터 사용으로 주석 처리
    // if (badgesResult.status === "fulfilled") {
    //   setBadges(badgesResult.value);
    // }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (!isLessonModalOpen || !selectedLessonId) return;

    const sendTenMinutePing = async () => {
      try {
        await studyApi.tenMinutePing(selectedLessonId);
      } catch {
        // 지표 전송 실패는 학습 흐름을 막지 않음
      }
    };

    // 모달 오픈 시 1회 즉시 전송
    sendTenMinutePing();

    const intervalId = window.setInterval(() => {
      sendTenMinutePing();
    }, 10 * 60 * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isLessonModalOpen, selectedLessonId]);

  const toggleCourse = (courseId: number) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const openLessonModal = async (lessonId: number) => {
    setIsLessonModalOpen(true);
    setSelectedLessonId(lessonId);
    setLessonLoading(true);
    setLessonErrorMessage(null);

    try {
      const lesson = await studyApi.getLessonDetail(lessonId);
      setSelectedLesson(lesson);
    } catch {
      setSelectedLesson(null);
      setLessonErrorMessage("레슨 내용을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLessonLoading(false);
    }
  };

  const closeLessonModal = () => {
    setIsLessonModalOpen(false);
    setSelectedLessonId(null);
    setSelectedLesson(null);
    setLessonErrorMessage(null);
  };

  const handleCompleteLesson = async () => {
    if (!selectedLesson || lessonCompleting || selectedLesson.completed) return;

    setLessonCompleting(true);

    try {
      await studyApi.completeLesson(selectedLesson.id);

      setSelectedLesson((prev) => (prev ? { ...prev, completed: true } : prev));

      setCourses((prevCourses) =>
        prevCourses.map((course) => ({
          ...course,
          lessons: course.lessons.map((lesson) =>
            lesson.id === selectedLesson.id
              ? { ...lesson, completed: true }
              : lesson
          ),
        }))
      );

      try {
        const latestMetric = await studyApi.getMyStudyMetric();
        setStudyMetric(latestMetric);
      } catch {
        // 지표 갱신 실패는 학습 완료 흐름을 막지 않음
      }
    } catch {
      setLessonErrorMessage("레슨 완료 처리에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLessonCompleting(false);
    }
  };

  // 학습 통계 파생
  const totalLessons = courses.reduce((sum, c) => sum + c.totalLessonCount, 0);
  const completedLessons = courses.reduce(
    (sum, c) => sum + c.lessons.filter((l) => l.completed).length,
    0
  );

  // AI 투자 학습 페이지에서만 사용하는 배지 이름 (줄바꿈 위치 지정)
  const aiLearningBadgeNames: Partial<Record<BadgeType, string>> = {
    KNOWLEDGE_SEEKER: "지식\n탐구자",
    DILIGENT_INVESTOR: "성실한\n투자자",
    DIVERSIFICATION_MASTER: "분산 투자의\n정석",
    BEST_DEBATER: "베스트\n토론왕",
    PERFECT_SCORE_QUIZ: "퀴즈 백점\n만점",
    CHALLENGE_MARATHONER: "챌린지\n마라토너",
    TOP_ONE_PERCENT_TRAINER: "상위 1%\n트레이더",
    // 줄바꿈이 필요 없는 경우는 지정하지 않으면 원래 이름 사용
  };

  // AI 투자 학습 페이지에서만 사용하는 배지 배경색
  const aiLearningBadgeBg: Partial<Record<BadgeType, string>> = {
    KNOWLEDGE_SEEKER: "bg-etc-light-blue", // #DFE2FF
    DIVERSIFICATION_MASTER: "bg-etc-light-purple", // #EEE1FF
    BEST_DEBATER: "bg-etc-light-pink", // #FFD9EF
    PERFECT_SCORE_QUIZ: "bg-etc-light-cyan", // #CFEEFF
    CHALLENGE_MARATHONER: "bg-etc-light-coral", // #FFB1B1
    TOP_ONE_PERCENT_TRAINER: "bg-etc-light-beige", // #DFBCA1
  };

  // 모든 배지 목록 (획득한 것과 미획득한 것 모두 포함, 중복 제거)
  // TODO: 개발용 더미 데이터 - 모든 배지를 획득 상태로 표시
  const allBadges = useMemo(() => {
    // 더미 데이터: 모든 배지를 획득 상태로 표시
    return ALL_BADGE_TYPES.map((badgeType) => {
      return {
        badgeType,
        isAcquired: true, // 더미 데이터: 모든 배지 획득
        displayName: BADGE_CONFIG[badgeType].displayName,
        acquiredAt: new Date().toISOString(), // 더미 날짜
      };
    });
    
    // 실제 API 데이터 사용 시 아래 코드 사용
    // // 획득한 배지 맵 생성 (중복 제거)
    // const acquiredBadgesMap = new Map<string, BadgeInfo>();
    // badges.forEach((badge) => {
    //   if (!acquiredBadgesMap.has(badge.badge)) {
    //     acquiredBadgesMap.set(badge.badge, badge);
    //   }
    // });
    //
    // // 모든 배지 타입에 대해 획득 여부 확인
    // return ALL_BADGE_TYPES.map((badgeType) => {
    //   const acquiredBadge = acquiredBadgesMap.get(badgeType);
    //   return {
    //     badgeType,
    //     isAcquired: !!acquiredBadge,
    //     displayName: acquiredBadge?.displayName || BADGE_CONFIG[badgeType].displayName,
    //     acquiredAt: acquiredBadge?.acquiredAt,
    //   };
    // });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* 메인 컨텐츠 영역 */}
      <main className="bg-gray-100 min-h-[calc(100vh-80px)] py-7">
        <div className="max-w-full mx-auto flex gap-5 px-8 justify-center">
          {/* 왼쪽 영역 */}
          <div className="flex flex-col gap-5 w-[978px] max-w-full">
            {/* AI 학습 인사이트 */}
            <AILearningInsight description={todayAiRecommend ?? undefined} />

            {/* 학습 코스 섹션 */}
            {loading ? (
              <SkeletonCourseList />
            ) : (
              <div className="bg-white rounded-lg p-5 flex flex-col gap-5">
                {/* 헤더 */}
                <div className="flex items-center justify-between">
                  <h2 className="text-Subtitle_L_Medium text-black">학습 코스</h2>
                  <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}
                    className="!bg-main-1 !text-white !px-2.5 !py-2.5 rounded-lg text-Subtitle_S_Regular !w-[122px] !h-[34px] !min-h-0 border-main-1 !justify-center"
                  >
                    +AI 코스 생성
                  </Button>
                </div>

                {/* 코스 리스트 */}
                {courses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <p className="text-Body_M_Light">아직 생성된 코스가 없습니다.</p>
                    <p className="text-Caption_L_Light mt-1">AI 코스 생성 버튼을 눌러 학습을 시작해보세요!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {courses.map((course) => (
                      <CourseItem
                        key={course.id}
                        title={course.title}
                        description={course.description}
                        level={DIFFICULTY_MAP[course.difficulty]}
                        progress={calcProgress(course)}
                        lessons={course.lessons}
                        isExpanded={expandedCourses.has(course.id)}
                        onToggle={() => toggleCourse(course.id)}
                        onExpand={() => toggleCourse(course.id)}
                        onLessonClick={openLessonModal}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 오른쪽 영역 */}
          <div className="w-[440px] flex flex-col gap-7.5 shrink-0">
            {/* 학습 통계 */}
            <LearningStats
              completedLectures={completedLessons}
              totalLectures={totalLessons}
              totalMinutes={studyMetric?.timeSpentMinutes}
              experiencePoints={studyMetric?.xpEarned}
            />

            {/* 획득 배지 */}
            <div className="bg-white rounded-lg p-5 flex flex-col gap-5">
              <h2 className="text-Subtitle_L_Medium text-black">획득 배지</h2>
              <div className="grid grid-cols-4 gap-x-[5px] gap-y-[10px] justify-items-center">
                {allBadges.map((badge) => {
                  const config = BADGE_CONFIG[badge.badgeType];
                  const isAcquired = badge.isAcquired;
                  
                  // AI 투자 학습 페이지에서만 아이콘 크기를 작게 조정
                  const renderIcon = () => {
                    const iconElement = config.icon(isAcquired);
                    if (isAcquired && React.isValidElement(iconElement)) {
                      return React.cloneElement(iconElement, {
                        className: "w-[26px] h-[25px]",
                      } as React.HTMLAttributes<SVGElement>);
                    }
                    // 미획득 배지는 원래 크기 유지 (26px)
                    return iconElement;
                  };
                  
                  return (
                    <div
                      key={badge.badgeType}
                      className={cn(
                        "rounded-lg px-[10px] py-[10px] flex flex-col gap-1 items-center justify-center h-[87px] w-[98px]",
                        isAcquired 
                          ? (aiLearningBadgeBg[badge.badgeType] ?? config.bg)
                          : "bg-gray-100"
                      )}
                    >
                      <div className="flex items-center justify-center h-[25px] w-[26px]">
                        {renderIcon()}
                      </div>
                      <p className="text-Subtitle_XS_Medium text-[#4C4C4C] text-center whitespace-pre-wrap leading-[17px]">
                        {isAcquired 
                          ? (aiLearningBadgeNames[badge.badgeType] ?? badge.displayName)
                          : "미획득"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI 코스 생성 모달 */}
      <AICourseCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchCourses}
      />

      <LessonStudyModal
        isOpen={isLessonModalOpen}
        lesson={selectedLesson}
        loading={lessonLoading}
        completing={lessonCompleting}
        errorMessage={lessonErrorMessage}
        onClose={closeLessonModal}
        onComplete={handleCompleteLesson}
      />
    </div>
  );
};

export default AILearningPage;
