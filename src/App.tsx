import { Button, TextField, Header } from "@/components";
import UserIcon from "@/assets/user.svg?react";
import LockIcon from "@/assets/lock.svg?react";
import EyeIcon from "@/assets/eye.svg?react";
import { useState } from "react";

function App() {
  const [visible, setVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState("홈");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 이미지 기반 GNB 헤더 */}
      <Header
        activeMenu={activeMenu}
        onMenuClick={(menu) => setActiveMenu(menu)}
      />

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              FinVibe Components
            </h1>
            <p className="text-lg text-gray-600">
              Figma 이미지 디자인 기반 데스크탑 GNB 및 컴포넌트
            </p>
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
                  상태 변형
                </h3>
                <div className="flex flex-wrap gap-4">
                  <Button loading>로딩중</Button>
                  <Button disabled>비활성화</Button>
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
                <div className="flex flex-col gap-6 max-w-md">
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
                    label="비밀번호"
                    type={visible ? "text" : "password"}
                    rightIcon={<EyeIcon />}
                    onRightIconClick={() => setVisible((v) => !v)}
                    rightIconAriaLabel="비밀번호 표시/숨김"
                    placeholder="8자 이상 입력"
                    leftIcon={<LockIcon className="w-6 h-6" aria-hidden />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
