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
| `dist/assets/useTradeQueries-ClklENO2.js` | 3.26 kB | 1.44 kB | 거래 query/mutation 로직 |
| `dist/assets/StockDetailPage-CQHpDVIX.js` | 17.90 kB | 5.82 kB | 종목 상세 페이지 |
| `dist/assets/SimulationPage-Crag21XD.js` | 21.69 kB | 6.66 kB | 시뮬레이션 페이지 |
| `dist/assets/vendor-CVDv-REV.js` | 47.84 kB | 17.00 kB | React/vendor chunk |
| `dist/assets/charts-PD8lPVbr.js` | 165.86 kB | 53.19 kB | `lightweight-charts` chunk |
| `dist/assets/index-Yxmp7zh_.js` | 836.01 kB | 246.85 kB | 메인 앱 chunk |

빌드 경고:

- `index-Yxmp7zh_.js`가 minify 후 500 kB를 초과한다.
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
- 성공 후 `walletApi.getBalance()`를 직접 재호출해 잔액 state 갱신
- 성공 후 `onTradeSuccess?.()` 호출 가능

React Query 관리 대상:

- `src/hooks/useTradeQueries.ts`
- `tradeKeys.all`: `["trade"]`
- `tradeKeys.status(tradeId)`: `["trade", "status", tradeId]`
- `tradeKeys.reservedStockIds()`: `["trade", "reserved-stock-ids"]`
- `tradeKeys.history(year, month)`: `["trade", "history", year, month]`

매매 성공 시 invalidate 정책:

- 일반/예약 거래 생성 성공 시 `["trade", "history"]` 범위 무효화
- 예약 거래 생성 성공 시 `["trade", "reserved-stock-ids"]` 추가 무효화
- 예약 거래 취소 성공 시 `["trade", "status", tradeId]`는 `setQueryData`로 즉시 갱신
- 예약 거래 취소 성공 시 `["trade", "reserved-stock-ids"]`, `["trade", "history"]` 무효화

React Query 밖에서 관리되는 서버 상태:

- 주문 패널의 잔액: `walletApi.getBalance()`
- 주문 패널의 포트폴리오 목록: `assetPortfolioApi.getPortfolios()`
- 시뮬레이션 포트폴리오 탭의 그룹/자산: `assetPortfolioApi.getPortfolios()`, `assetPortfolioApi.getAssetsByPortfolio(portfolioId)`

현재 구조상 한계:

- 거래 이력은 React Query로 재동기화된다.
- 잔액과 포트폴리오 목록/자산은 컴포넌트 로컬 state와 직접 API 호출로 관리된다.
- 따라서 매매 후 포트폴리오 자산 상태까지 일관되게 재동기화하려면 wallet/portfolio 영역도 query key로 승격하는 것이 다음 개선 지점이다.

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
| 주문 성공 후 | `GET /api/wallets/balance` | `OrderPanel`이 직접 잔액 재조회 |
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
- 주문 성공 후 잔액 재조회 1회는 현재 구현상 정상이다.
- 거래 이력 탭 또는 예약 주문 데이터가 활성 상태일 때 관련 GET 재조회 1회는 정상이다.
- 같은 endpoint가 같은 사용자 액션 1회에 대해 2회 이상 발생하면 중복 요청 후보로 기록한다.

## Query key / invalidate 정책 정리

현재 장점:

- 거래 도메인은 `tradeKeys` factory를 이미 사용한다.
- mutation 성공 시 거래 이력과 예약 주문 목록을 명시적으로 무효화한다.
- 예약 취소는 상태 query를 `setQueryData`로 즉시 갱신한 뒤 목록성 query를 무효화한다.

현재 불일치:

- `trade` 도메인만 query key factory가 있다.
- `wallet`, `asset/portfolio` 도메인은 React Query가 아니라 직접 API 호출과 로컬 state로 관리된다.
- 매매 성공 후 포트폴리오 목록/자산 재동기화가 query invalidation으로 연결되어 있지 않다.

권장 정책:

- 서버 상태는 query key factory로 관리한다.
- mutation 성공 후 화면별 로컬 setState보다 도메인 query invalidation을 우선한다.
- 잔액, 포트폴리오 목록, 포트폴리오 자산은 매매 결과와 직접 관련되므로 `walletKeys`, `portfolioKeys`로 승격한다.
- 포트폴리오 자산 query는 `["portfolio", "assets", portfolioId]`처럼 portfolioId를 key에 포함한다.

## Query key factory 도입 계획

대규모 리팩토링 없이 다음 순서로 도입한다.

1. `walletKeys` 추가
   - 예: `walletKeys.balance() => ["wallet", "balance"]`
   - `useWalletBalance` query hook 추가
   - 주문 성공 후 `walletKeys.balance()` invalidate

2. `portfolioKeys` 추가
   - 예: `portfolioKeys.list() => ["portfolio", "list"]`
   - 예: `portfolioKeys.assets(portfolioId) => ["portfolio", "assets", portfolioId]`
   - `usePortfolioGroups`, `usePortfolioAssets(portfolioId)` query hook 추가

3. 매매 성공 invalidation 확장
   - 일반 거래 성공: `tradeKeys.history prefix`, `walletKeys.balance()`, `portfolioKeys.list()`, 해당 portfolio의 `portfolioKeys.assets(portfolioId)`
   - 예약 거래 성공: 위 항목 + `tradeKeys.reservedStockIds()`

4. 화면 단위 전환
   - 먼저 `OrderPanel`의 잔액 조회만 `useWalletBalance`로 이동
   - 다음으로 포트폴리오 dropdown 목록을 `usePortfolioGroups`로 이동
   - 마지막으로 `SimulationPortfolioTab`의 자산 조회를 `usePortfolioAssets`로 이동

5. 검증
   - 주문 1회당 Network 요청 수를 이전 문서 템플릿에 기록
   - Profiler에서 주문 성공 후 commit 수와 주요 re-render 컴포넌트를 비교

도입하지 않은 이유:

- 이번 작업의 범위는 측정 및 문서화다.
- 기능 로직 대규모 리팩토링은 명시적으로 제외되어 있다.
- query key factory 확장은 상태 책임을 바꾸는 작업이므로 별도 PR에서 테스트와 함께 진행하는 것이 안전하다.

## 검증 결과

| 항목 | 결과 | 메모 |
| --- | --- | --- |
| `npm run build` | 성공 | chunk 크기 표 기록 완료 |
| 차트 chunk 분리 | 확인 | `charts-PD8lPVbr.js` 생성 |
| `npm run lint` | 실패 | 기존 ESLint 오류 39개, warning 1개 |
| React Profiler 캡처 | 미수행 | 로그인 가능한 브라우저 세션과 수동 DevTools 캡처 필요 |
| Network 패널 캡처 | 미수행 | 로그인 가능한 브라우저 세션과 수동 DevTools 캡처 필요 |

린트 실패 요약:

- `@typescript-eslint/no-explicit-any`
- `react-hooks/set-state-in-effect`
- `react-refresh/only-export-components`
- `no-empty`
- `@typescript-eslint/no-unused-vars`
- `react-hooks/exhaustive-deps` unused disable warning

이번 문서 작업에서 린트 오류를 수정하지 않은 이유:

- 작업 범위가 성능 측정 및 상태 재동기화 문서화다.
- 기존 기능 로직 대규모 리팩토링을 하지 않는다는 제한이 있다.
- 린트 오류 수정은 여러 도메인 파일을 건드리므로 별도 안정화 작업으로 분리하는 것이 안전하다.

## 포트폴리오 기재용 요약

FinVibe 매매 시나리오에서 주문 생성 이후 서버 상태 재동기화 흐름을 점검했다. Vite 빌드 결과 기준 `lightweight-charts`는 별도 `charts` chunk로 분리되어 gzip 53.19 kB로 생성되었고, 거래 query/mutation 로직도 별도 chunk로 분리되었다. 매매 성공 시 React Query는 거래 이력과 예약 주문 목록을 무효화하며, 잔액은 주문 패널에서 직접 재조회한다. 측정 결과, 거래 도메인의 query key factory는 정리되어 있으나 wallet/portfolio 도메인은 아직 로컬 state와 직접 fetch가 섞여 있어, 향후 `walletKeys`, `portfolioKeys`를 도입하면 매매 후 상태 재동기화 책임을 더 일관되게 만들 수 있다.

## 남은 위험과 후속 작업

- 실제 React Profiler 수치는 로그인 가능한 브라우저 환경에서 수동 캡처가 필요하다.
- 실제 Network 중복 요청 여부도 인증된 세션에서 주문을 수행해야 확인할 수 있다.
- 메인 앱 chunk가 836.01 kB로 커서 라우트 단위 lazy loading 검토 여지가 있다.
- Node.js를 Vite 권장 버전인 `22.12+` 또는 `20.19+`로 맞춘 뒤 같은 빌드 수치를 다시 기록하는 것이 좋다.
- lint 실패가 남아 있으므로 성능 개선 전 별도 코드 품질 안정화 작업이 필요하다.
