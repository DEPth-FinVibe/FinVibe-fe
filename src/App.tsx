import { Button, TextField, Header } from "@/components";
import UserIcon from "@/assets/user.svg?react";
import LockIcon from "@/assets/lock.svg?react";
import EyeIcon from "@/assets/eye.svg?react";
import BackIcon from "@/assets/back.svg?react";
import CloseIcon from "@/assets/close.svg?react";
import { useState } from "react";

function App() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            FinVibe Components
          </h1>
          <p className="text-lg text-gray-600">
            Figma 디자인 시스템 기반 컴포넌트 라이브러리
          </p>
        </div>

        {/* Header 컴포넌트 섹션 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden space-y-6">
          <div className="p-8 pb-0">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Header 컴포넌트
            </h2>
          </div>
          <div className="border-y border-gray-100 bg-gray-50 p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 px-4">
                기본 헤더 (뒤로가기 + 타이틀)
              </h3>
              <Header title="회원가입" leftIcon={<BackIcon />} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 px-4">
                전체 구성 (뒤로가기 + 타이틀 + 닫기)
              </h3>
              <Header
                title="정보 입력"
                leftIcon={<BackIcon />}
                rightIcon={<CloseIcon />}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 px-4">
                타이틀만 있는 경우
              </h3>
              <Header title="홈" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Button 컴포넌트
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                기본 변형
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">취소</Button>
                <Button variant="secondary">취소</Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                크기 변형 (s, m, l)
              </h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="small">Small (s)</Button>
                <Button size="medium">Medium (m)</Button>
                <Button size="large">Large (l)</Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                크기와 변형 조합
              </h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="primary" size="small">
                    Small
                  </Button>
                  <Button variant="primary" size="medium">
                    Medium
                  </Button>
                  <Button variant="primary" size="large">
                    Large
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="secondary" size="small">
                    Small
                  </Button>
                  <Button variant="secondary" size="medium">
                    Medium
                  </Button>
                  <Button variant="secondary" size="large">
                    Large
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                상태 변형
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button loading>로딩중</Button>
                <Button disabled>비활성화</Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                전체 너비
              </h3>
              <Button fullWidth>전체 너비 버튼</Button>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                아이콘 포함
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button leftIcon={<span>✓</span>}>확인</Button>
                <Button variant="secondary" rightIcon={<span>×</span>}>
                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            TextField 컴포넌트
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                정보입력
              </h3>
              <div className="flex flex-wrap gap-4">
                <TextField
                  size="small"
                  label="아이디"
                  placeholder="영어, 숫자 4-20자"
                  leftIcon={<UserIcon className="w-6 h-6" aria-hidden />}
                  rightAddon={
                    <Button variant="secondary" size="small">
                      중복확인
                    </Button>
                  }
                />

                <TextField
                  size="small"
                  label="이름"
                  placeholder="홍길동"
                  leftIcon={<UserIcon className="w-6 h-6" aria-hidden />}
                />

                <TextField
                  size="small"
                  label="비밀번호"
                  type={visible ? "text" : "password"}
                  rightIcon={<EyeIcon />}
                  onRightIconClick={() => setVisible((v) => !v)}
                  rightIconAriaLabel="비밀번호 표시/숨김"
                  placeholder="8자 이상 입력"
                  leftIcon={<LockIcon className="w-6 h-6" aria-hidden />}
                />
                <TextField
                  size="medium"
                  label="학교"
                  placeholder="예: 서울대학교"
                />
                <TextField
                  size="large"
                  label="이메일 또는 휴대전화"
                  placeholder="이메일 또는 휴대전화"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
