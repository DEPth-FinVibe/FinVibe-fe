# 1단계: 빌드 단계
FROM node:20-slim AS builder

# pnpm 설치를 위한 설정
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 소스 코드 복사 및 프로젝트 빌드
COPY . .
RUN pnpm run build

# 2단계: 실행 단계 (Nginx)
FROM nginx:stable-alpine

# 기본 설정 제거 및 커스텀 Nginx 설정 복사
RUN rm /etc/nginx/conf.d/default.conf
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 단계에서 생성된 정적 파일들을 Nginx 경로로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
