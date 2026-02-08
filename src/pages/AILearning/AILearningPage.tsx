import React, { useState, useEffect, useCallback } from "react";
import { CourseItem, Button } from "@/components";
import { AILearningInsight } from "@/components/AILearningInsight";
import { LearningStats } from "@/components/LearningStats";
import { BadgeCard } from "@/components/BadgeCard";
import { AICourseCreateModal } from "@/components/AICourseCreateModal";
import type { CourseLevel } from "@/components/Progress/CourseItem";
import { studyApi, type MyCourseResponse, type CourseDifficulty } from "@/api/study";

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
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studyApi.getMyCourses();
      setCourses(data);
    } catch {
      // 실패 시 빈 배열 유지
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const toggleCourse = (courseId: number) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  // 학습 통계 파생
  const totalLessons = courses.reduce((sum, c) => sum + c.totalLessonCount, 0);
  const completedLessons = courses.reduce(
    (sum, c) => sum + c.lessons.filter((l) => l.completed).length,
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* 메인 컨텐츠 영역 */}
      <main className="bg-gray-100 min-h-[calc(100vh-80px)] py-7">
        <div className="max-w-full mx-auto flex gap-5 px-8 justify-center">
          {/* 왼쪽 영역 */}
          <div className="flex flex-col gap-5 w-[978px] max-w-full">
            {/* AI 학습 인사이트 */}
            <AILearningInsight />

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
            />

            {/* 획득 배지 */}
            <div className="bg-white rounded-lg p-5 flex flex-col gap-5">
              <h2 className="text-Subtitle_L_Medium text-black">획득 배지</h2>
              <div className="flex flex-wrap gap-x-2.5 gap-y-3.5 justify-center">
                <BadgeCard type="first-lecture" />
                <BadgeCard type="beginner-master" />
                <BadgeCard type="practice-learning" />
                <BadgeCard type="locked" />
                <BadgeCard type="locked" />
                <BadgeCard type="locked" />
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
    </div>
  );
};

export default AILearningPage;
