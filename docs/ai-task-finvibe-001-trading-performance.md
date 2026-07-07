# AI-TASK-FINVIBE-001: 매매 시나리오 성능 측정 및 상태 재동기화

승인 문구: `APPROVED: AI-TASK-FINVIBE-001`

## 목적

FinVibe 매매 이후 상태 반영 흐름을 빌드 결과, React Profiler, Network 패널 기준으로 검증하고, 포트폴리오에 사용할 수 있는 근거 자료를 과장 없이 정리한다.

## 측정 환경

- 프로젝트: FinVibe frontend
- 빌드 명령: `npm run build`
- 린트 명령: `npm run lint`
- 측정일: 2026-07-07
- Node.js: `22.11.0`
- 번들러: Vite `7.2.4`

주의: Vite는 Node.js `20.19+` 또는 `22.12+`를 요구한다고 경고했다. 현재 Node `22.11.0`에서도 빌드는 성공했지만, 포트폴리오에 수치를 기재할 때는 Node 버전을 함께 남기는 것이 안전하다.

## 빌드 결과

`npm run build`는 성공했다.

| 산출물 | 크기 | gzip | 비고 |
| --- | ---: | ---: | --- |
| `dist/index.html` | 0.61 kB | 0.34 kB | HTML 엔트리 |
| `dist/assets/index-D48d6LdG.css` | 58.36 kB | 11.17 kB | 전역 CSS |
| `dist/assets/useTradeQueries-0WdWXcyc.js` | 3.35 kB | 1.46 kB | 거래 query/mutation 로직 |
| `dist/assets/StockDetailPage-BlSA1AK0.js` | 17.74 kB | 5.81 kB | 종목 상세 페이지 |
| `dist/assets/SimulationPage-CKtJ_a3k.js` | 21.11 kB | 6.48 kB | 시뮬레이션 페이지 |
| `dist/assets/vendor-CVDv-REV.js` | 47.84 kB | 17.00 kB | React/vendor chunk |
| `dist/assets/charts-PD8lPVbr.js` | 165.86 kB | 53.19 kB | `lightweight-charts` chunk |
| `dist/assets/index-Clw1FUtG.js` | 836.51 kB | 246.97 kB | 메인 앱 chunk |

빌드 경고:

- `index-Clw1FUtG.js`가 minify 후 500 kB를 초과한다.
- `caniuse-lite`, `baseline-browser-mapping` 데이터가 오래되었다는 경고가 출력된다.
- 위 경고들은 빌드 실패는 아니지만, 성능 개선 과제로 기록할 수 있다.

## 차트 chunk 분리 확인

차트 라이브러리는 별도 chunk로 분리되어 있다.

근거:

- `vite.config.ts`의 `build.rollupOptions.output.manualChunks`에 `charts: ["lightweight-charts"]`가 설정되어 있다.
- 실제 빌드 결과에 `dist/assets/charts-PD8lPVbr.js`가 생성되었다.
- 해당 chunk 크기는 `165.86 kB`, gzip 기준 `53.19 kB`다.

포트폴리오 표현 예시:

> Lightweight Charts를 Vite manualChunks로 분리해 차트 라이브러리 번들을 별도 chunk로 관리했다. 측정 시점 기준 차트 chunk는 165.86 kB, gzip 53.19 kB로 생성되었다.

## 매매 이후 상태 반영 흐름

주문 실행 진입점:

- `src/pages/Simulation/components/OrderPanel.tsx`
- `handleOrder`에서 `useCreateTrade().mutateAsync(request)` 호출
- 성공 후 주문 성공 메시지 표시
- 성공 후 `useCreateTrade`가 wallet/portfolio/trade query를 무효화해 활성 화면을 재동기화
- 성공 후 `onTradeSuccess?.()` 호출 가능

React Query 관리 대상:

- `src/hooks/useTradeQueries.ts`
- `tradeKeys.all`: `["trade"]`
- `tradeKeys.status(tradeId)`: `["trade", "status", tradeId]`
- `tradeKeys.reservedStockIds()`: `["trade", "reserved-stock-ids"]`
- `tradeKeys.history(year, month)`: `["trade", "history", year, month]`

매매 성공 시 invalidate 정책:

- 일반/예약 거래 생성 성공 시 `["trade", "history"]` 범위 무효화
- 일반/예약 거래 생성 성공 시 `walletKeys.balance()` 무효화
- 일반/예약 거래 생성 성공 시 `portfolioKeys.all` 범위 무효화
- 예약 거래 생성 성공 시 `["trade", "reserved-stock-ids"]` 추가 무효화
- 예약 거래 취소 성공 시 `["trade", "status", tradeId]`는 `setQueryData`로 즉시 갱신
- 예약 거래 취소 성공 시 `["trade", "reserved-stock-ids"]`, `["trade", "history"]` 무효화

wallet/portfolio React Query 관리 대상:

- `src/hooks/useWalletQueries.ts`
- `walletKeys.balance()`: `["wallet", "balance"]`
- `src/hooks/usePortfolioQueries.ts`
- `portfolioKeys.list()`: `["portfolio", "list"]`
- `portfolioKeys.assets(portfolioId)`: `["portfolio", "assets", portfolioId]`
- `portfolioKeys.comparison()`: `["portfolio", "comparison"]`
- `portfolioKeys.allocation()`: `["portfolio", "allocation"]`
- `portfolioKeys.performanceChart(startDate, endDate, interval)`: `["portfolio", "performance-chart", ...]`

현재 구조상 남은 한계:

- 거래 이력, 잔액, 포트폴리오 목록/자산/배분/비교/성과 차트는 React Query로 재동기화된다.
- React Query Devtools 또는 Network 패널에서 실제 주문 1회당 재요청 수는 인증된 세션으로 별도 캡처가 필요하다.
- `tradeKeys`, `walletKeys`, `portfolioKeys`가 파일별로 나뉘어 있어, 추후 도메인 query key index를 만들면 탐색성이 더 좋아질 수 있다.

## React Profiler 측정 방법

목표:

- 매수/매도 버튼 클릭 이후 주문 완료 메시지와 관련 UI가 반영될 때까지 어떤 컴포넌트가 commit되는지 확인한다.
- 주문 성공 시 전체 화면이 과도하게 다시 그려지는지 확인한다.

사전 조건:

- 운영 또는 개발 서버에 로그인 가능한 계정이 필요하다.
- 테스트용 포트폴리오가 최소 1개 있어야 한다.
- 테스트 종목의 현재가가 표시되어야 한다.
- 동일 시나리오를 비교하려면 브라우저 캐시와 React Query 캐시 상태를 맞춘다.

절차:

1. `npm run dev`로 앱을 실행한다.
2. Chrome DevTools > React > Profiler 탭을 연다.
3. `/simulation/:stockId` 종목 상세 화면으로 이동한다.
4. Profiler record를 시작한다.
5. 지정가 또는 시장가 매수 주문을 1회 실행한다.
6. 주문 완료 메시지와 잔액 갱신이 끝난 뒤 record를 중지한다.
7. commit 목록에서 가장 큰 commit duration, commit 수, 주요 re-render 컴포넌트를 기록한다.
8. 같은 조건으로 매도 또는 예약 주문도 1회 반복한다.

기록 템플릿:

| 시나리오 | Commit 수 | 최대 commit duration | 주요 re-render 컴포넌트 | 메모 |
| --- | ---: | ---: | --- | --- |
| 시장가 매수 1회 | 캡처 후 입력 | 캡처 후 입력 | 예: `OrderPanel`, `StockDetailPage` | 로그인 실측 필요 |
| 지정가 매도 1회 | 캡처 후 입력 | 캡처 후 입력 | 캡처 후 입력 | 로그인 실측 필요 |
| 예약 주문 1회 | 캡처 후 입력 | 캡처 후 입력 | 캡처 후 입력 | 로그인 실측 필요 |

판정 기준:

- 주문 성공 메시지 표시를 위해 `OrderPanel`이 다시 렌더링되는 것은 정상이다.
- 거래 이력 탭이 열린 상태라면 `useTradeHistory` invalidation으로 거래 목록 영역이 갱신되는 것은 정상이다.
- 주문과 직접 관계없는 좌측 종목 리스트, 차트, 전체 레이아웃이 큰 duration으로 반복 commit되면 추가 최적화 후보로 본다.

## Network 패널 확인 방법

목표:

- 매매 성공 이후 필요한 API만 재요청되는지 확인한다.
- 동일 query key invalidation 때문에 같은 endpoint가 불필요하게 중복 호출되는지 확인한다.

필터:

- `trade`
- `wallet`
- `portfolio`
- `assets`

매수/매도 성공 시 기대 요청:

| 시점 | 예상 요청 | 비고 |
| --- | --- | --- |
| 주문 클릭 | `POST /api/trade/trades` | 주문 생성 |
| 주문 성공 후 | `GET /api/wallets/balance` | `walletKeys.balance()` invalidation 영향 |
| 주문 성공 후 | `GET /api/portfolios`, `GET /api/portfolios/{portfolioId}/assets` 등 | 활성 portfolio query가 있을 때 `portfolioKeys.all` invalidation 영향 |
| 거래 내역 화면 활성 상태 | `GET /api/trade/trades/history?year=...&month=...` | `["trade", "history"]` invalidation 영향 |
| 예약 주문 성공 시 | `GET /api/trade/trades/reserved/stock-ids` | 예약 주문만 해당 |

중복 요청 확인 절차:

1. Chrome DevTools > Network 탭에서 `Preserve log`를 켠다.
2. `Fetch/XHR` 필터를 선택한다.
3. 주문 직전 로그를 clear한다.
4. 주문을 1회 실행한다.
5. `POST /api/trade/trades` 이후 발생한 요청만 확인한다.
6. 같은 URL과 같은 query string의 GET 요청이 짧은 시간 안에 2회 이상 반복되는지 확인한다.
7. 반복 요청이 있다면 Initiator와 React Profiler commit 시점을 함께 기록한다.

기록 템플릿:

| 시나리오 | POST trade | balance 재조회 | trade history 재조회 | reserved ids 재조회 | 중복 의심 요청 |
| --- | ---: | ---: | ---: | ---: | --- |
| 일반 매수 1회 | 캡처 후 입력 | 캡처 후 입력 | 캡처 후 입력 | 해당 없음 | 캡처 후 입력 |
| 일반 매도 1회 | 캡처 후 입력 | 캡처 후 입력 | 캡처 후 입력 | 해당 없음 | 캡처 후 입력 |
| 예약 주문 1회 | 캡처 후 입력 | 캡처 후 입력 | 캡처 후 입력 | 캡처 후 입력 | 캡처 후 입력 |

판정 기준:

- `POST /api/trade/trades` 1회는 정상이다.
- 주문 성공 후 잔액/포트폴리오 활성 query 재조회 1회는 현재 구현상 정상이다.
- 거래 이력 탭 또는 예약 주문 데이터가 활성 상태일 때 관련 GET 재조회 1회는 정상이다.
- 같은 endpoint가 같은 사용자 액션 1회에 대해 2회 이상 발생하면 중복 요청 후보로 기록한다.

## Query key / invalidate 정책 정리

현재 장점:

- 거래 도메인은 `tradeKeys` factory를 이미 사용한다.
- mutation 성공 시 거래 이력과 예약 주문 목록을 명시적으로 무효화한다.
- 예약 취소는 상태 query를 `setQueryData`로 즉시 갱신한 뒤 목록성 query를 무효화한다.
- wallet 도메인은 `walletKeys`와 `useWalletBalance`로 잔액을 관리한다.
- portfolio 도메인은 `portfolioKeys`와 조회/변경 hook으로 목록, 자산, 배분, 비교, 성과 차트를 관리한다.

현재 정책:

- 서버 상태는 query key factory로 관리한다.
- mutation 성공 후 화면별 로컬 setState보다 도메인 query invalidation을 우선한다.
- 잔액, 포트폴리오 목록, 포트폴리오 자산은 매매 결과와 직접 관련되므로 `walletKeys`, `portfolioKeys`로 재동기화한다.
- 포트폴리오 자산 query는 `["portfolio", "assets", portfolioId]`처럼 portfolioId를 key에 포함한다.

## Query key factory 도입 결과

구현된 내용:

- `useWalletQueries.ts` 추가
  - `walletKeys.balance()`
  - `useWalletBalance`

- `usePortfolioQueries.ts` 추가
  - `portfolioKeys.list()`
  - `portfolioKeys.assets(portfolioId)`
  - `portfolioKeys.comparison()`
  - `portfolioKeys.allocation()`
  - `portfolioKeys.performanceChart(startDate, endDate, interval)`
  - `usePortfolioGroups`
  - `usePortfolioAssets`
  - `usePortfolioAssetsQueries`
  - `usePortfolioComparison`
  - `useAssetAllocation`
  - `usePortfolioPerformanceChart`
  - `useCreatePortfolioGroup`
  - `useUpdatePortfolioGroup`
  - `useDeletePortfolioGroup`
  - `useTransferPortfolioAsset`

- `useCreateTrade` 성공 시 재동기화 확장
  - `walletKeys.balance()` invalidate
  - `portfolioKeys.all` invalidate
  - 기존 `tradeKeys.history` / `tradeKeys.reservedStockIds` invalidate 유지

- 직접 fetch에서 query hook으로 전환한 화면
  - `OrderPanel`
  - `SimulationPage`
  - `SimulationPortfolioTab`
  - `MyPage`
  - `MyAssetsPage`
  - `MyPortfolioManagementPage`
  - `PortfolioPerformanceWrapper`

후속 검증:

- 주문 1회당 Network 요청 수를 이전 문서 템플릿에 기록한다.
- Profiler에서 주문 성공 후 commit 수와 주요 re-render 컴포넌트를 비교한다.

## 검증 결과

| 항목 | 결과 | 메모 |
| --- | --- | --- |
| `npx tsc -b` | 성공 | TypeScript project build 통과 |
| `npm run build` | 성공 | chunk 크기 표 기록 완료 |
| 차트 chunk 분리 | 확인 | `charts-PD8lPVbr.js` 생성 |
| `npm run lint` | 성공 | `baseline-browser-mapping` 데이터 경고만 출력 |
| React Profiler 캡처 | 미수행 | 로그인 가능한 브라우저 세션과 수동 DevTools 캡처 필요 |
| Network 패널 캡처 | 미수행 | 로그인 가능한 브라우저 세션과 수동 DevTools 캡처 필요 |

린트 정리 요약:

- `@typescript-eslint/no-explicit-any` 제거
- `react-hooks/set-state-in-effect` 대응
- `react-refresh/only-export-components` 대응
- `no-empty` 빈 catch 블록 정리
- `@typescript-eslint/no-unused-vars` 정리
- unused `react-hooks/exhaustive-deps` disable 주석 제거

## 포트폴리오 기재용 요약

FinVibe 매매 시나리오에서 주문 생성 이후 서버 상태 재동기화 흐름을 점검하고 wallet/portfolio 서버 상태를 TanStack Query로 승격했다. Vite 빌드 결과 기준 `lightweight-charts`는 별도 `charts` chunk로 분리되어 gzip 53.19 kB로 생성되었고, 거래 query/mutation 로직도 별도 chunk로 분리되었다. 매매 성공 시 React Query는 거래 이력, 예약 주문 목록, 지갑 잔액, 포트폴리오 목록/자산/배분/비교/성과 차트 query를 무효화해 활성 화면을 재동기화한다. 이를 통해 매매 후 상태 반영 책임을 컴포넌트별 직접 fetch에서 도메인 query key 기반 캐시 정책으로 옮겼다.

## 남은 위험과 후속 작업

- 실제 React Profiler 수치는 로그인 가능한 브라우저 환경에서 수동 캡처가 필요하다.
- 실제 Network 중복 요청 여부도 인증된 세션에서 주문을 수행해야 확인할 수 있다.
- 메인 앱 chunk가 836.51 kB로 커서 라우트 단위 lazy loading 검토 여지가 있다.
- Node.js를 Vite 권장 버전인 `22.12+` 또는 `20.19+`로 맞춘 뒤 같은 빌드 수치를 다시 기록하는 것이 좋다.
- lint 실패가 남아 있으므로 성능 개선 전 별도 코드 품질 안정화 작업이 필요하다.
