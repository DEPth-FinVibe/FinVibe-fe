import React, { useState } from "react";
import { CourseItem, Button } from "@/components";
import { AILearningInsight } from "@/components/AILearningInsight";
import { LearningStats } from "@/components/LearningStats";
import { BadgeCard } from "@/components/BadgeCard";
import { AICourseCreateModal } from "@/components/AICourseCreateModal";
import type { CourseLevel } from "@/components/Progress/CourseItem";

const AILearningPage: React.FC = () => {
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleCourse = (courseTitle: string) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseTitle)) {
      newExpanded.delete(courseTitle);
    } else {
      newExpanded.add(courseTitle);
    }
    setExpandedCourses(newExpanded);
  };

  const courses = [
    {
      title: "투자 기초",
      description: "투자의 기본 개념과 용어를 배웁니다",
      level: "초급" as CourseLevel,
      progress: 100,
    },
    {
      title: "기술적 분석",
      description: "차트와 지표를 활용한 분석 방법",
      level: "중급" as CourseLevel,
      progress: 65,
    },
    {
      title: "재무제표 분석",
      description: "기업의 재무 상태를 평가하는 방법",
      level: "중급" as CourseLevel,
      progress: 65,
    },
    {
      title: "포트폴리오 관리",
      description: "리스크 관리와 자산 배분 전략",
      level: "고급" as CourseLevel,
      progress: 65,
    },
  ];

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
            <div className="bg-white rounded-lg p-5 flex flex-col gap-5">
              {/* 헤더 */}
              <div className="flex items-center justify-between">
                <h2 className="text-Subtitle_L_Medium text-black">학습 코스</h2>
                <Button
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                  className="!bg-main-1 !text-white !px-[10px] !py-[10px] rounded-lg text-Subtitle_S_Regular !w-[122px] !h-[34px] !min-h-0 border-main-1 !justify-center"
                >
                  +AI 코스 생성
                </Button>
              </div>

              {/* 코스 리스트 */}
              <div className="flex flex-col gap-[10px]">
                {courses.map((course) => (
                  <CourseItem
                    key={course.title}
                    title={course.title}
                    description={course.description}
                    level={course.level}
                    progress={course.progress}
                    isExpanded={expandedCourses.has(course.title)}
                    onToggle={() => toggleCourse(course.title)}
                    onExpand={() => toggleCourse(course.title)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 영역 */}
          <div className="w-[440px] flex flex-col gap-[30px] shrink-0">
            {/* 학습 통계 */}
            <LearningStats />

            {/* 획득 배지 */}
            <div className="bg-white rounded-lg p-5 flex flex-col gap-5">
              <h2 className="text-Subtitle_L_Medium text-black">획득 배지</h2>
              <div className="flex flex-wrap gap-[10px_14px] justify-center">
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
        onCreate={(courseName, keywords) => {
          console.log("코스 생성:", { courseName, keywords });
          // TODO: 실제 API 호출로 코스 생성
        }}
      />
    </div>
  );
};

export default AILearningPage;
