// 이 파일은 JSX를 포함한 `badgeConfig.tsx`를 다시 export 하기 위한 래퍼입니다.
// 브라우저가 `badgeConfig.ts` 경로를 요청할 때 404가 나지 않도록 하기 위한 용도입니다.
// 동일 이름의 .ts / .tsx가 공존하므로, .tsx 파일을 명시적으로 가리킵니다.
export * from "./badgeConfig.tsx";

