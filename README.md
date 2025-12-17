# FinVibe Frontend

FinVibe 프로젝트의 프론트엔드 컴포넌트 라이브러리입니다.
Figma 디자인 시스템을 기반으로 구축되었습니다.

## 기술 스택

- **React 19.2** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite 7** - 빌드 도구
- **Tailwind CSS 3** - 유틸리티 우선 CSS 프레임워크
- **Storybook 8** - 컴포넌트 개발 환경
- **pnpm** - 패키지 매니저
- **Figma** - 디자인 시스템 소스

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

### 스토리북 실행

```bash
pnpm storybook
```

### 빌드

```bash
pnpm build
```

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Button/         # Button 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   └── index.ts        # 컴포넌트 export
├── utils/              # 유틸리티 함수
│   └── cn.ts          # 클래스 이름 병합 유틸리티
├── App.tsx            # 메인 앱 컴포넌트
├── main.tsx           # 엔트리 포인트
└── index.css          # 글로벌 스타일 (Tailwind)
```

## 컴포넌트

### Button

Figma 디자인 시스템에 기반한 재사용 가능한 버튼 컴포넌트입니다.

**디자인 소스:**

- Figma 파일: `FInVibe`
- Small (s): Node ID `503-333`
- Medium (m): Node ID `500-152`
- Large (l): Node ID `540-161`

**Props:**

- `variant`: "primary" | "secondary"
  - `primary`: 검은색 배경, 흰색 텍스트 (활성 상태)
  - `secondary`: 흰색 배경, 회색 테두리, 검은색 텍스트 (비활성 상태)
- `size`: "small" | "medium" | "large"
  - `small` (s): 작은 크기 - px-3 py-1.5, text-xs, min-h-28px (Figma: 503-333)
  - `medium` (m): 중간 크기 - px-[87px] py-3, text-sm, min-h-36px (Figma: 500-152, 기본값)
  - `large` (l): 큰 크기 - px-6 py-4, text-base, min-h-48px, 틸 색상 (Figma: 540-161)
- `fullWidth`: boolean - 전체 너비 사용 여부
- `loading`: boolean - 로딩 상태
- `disabled`: boolean - 비활성화 상태
- `leftIcon`: ReactNode - 왼쪽 아이콘
- `rightIcon`: ReactNode - 오른쪽 아이콘

**디자인 스펙:**

- 폰트: Noto Sans KR Light, 14px
- 패딩: 12px (상하) × 87px (좌우)
- 보더 반경: 4px
- Line height: 20px

**사용 예시:**

```tsx
import { Button } from "./components";

function App() {
  return (
    <div>
      <Button variant="primary">취소</Button>

      <Button variant="secondary">취소</Button>

      {/* 크기 변형 */}
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>

      <Button loading>로딩 중...</Button>

      <Button leftIcon={<span>✓</span>}>확인</Button>
    </div>
  );
}
```

## 스타일링

이 프로젝트는 Tailwind CSS를 사용합니다. 커스텀 CSS 파일 대신 Tailwind 유틸리티 클래스를 사용하세요.

### cn 유틸리티

`clsx`와 `tailwind-merge`를 결합한 유틸리티 함수로, Tailwind 클래스 충돌을 해결합니다.

```tsx
import { cn } from "./utils/cn";

const className = cn(
  "base-classes",
  condition && "conditional-classes",
  "override-classes"
);
```

## 스토리북

모든 컴포넌트는 Storybook 스토리를 포함해야 합니다.

스토리 파일은 컴포넌트와 같은 디렉토리에 위치합니다:

- `ComponentName.tsx` - 컴포넌트
- `ComponentName.stories.tsx` - 스토리북 스토리

## 개발 가이드

### 새 컴포넌트 추가

1. `src/components/ComponentName/` 디렉토리 생성
2. `ComponentName.tsx` 파일 생성 (Tailwind CSS 사용)
3. `ComponentName.stories.tsx` 파일 생성
4. `index.ts`에서 export
5. `src/components/index.ts`에 추가

### 코드 스타일

- TypeScript 사용
- Tailwind CSS 유틸리티 클래스 사용
- 컴포넌트는 재사용 가능하게 설계
- Props는 명확하게 타입 정의
- JSDoc 주석으로 문서화

## 스크립트

- `pnpm dev` - 개발 서버 실행
- `pnpm build` - 프로덕션 빌드
- `pnpm preview` - 빌드 미리보기
- `pnpm lint` - ESLint 실행
- `pnpm storybook` - 스토리북 개발 서버
- `pnpm build-storybook` - 스토리북 빌드

## 라이선스

Private
