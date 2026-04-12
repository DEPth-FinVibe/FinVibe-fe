import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components";
import type { AuthSessionDto } from "@/api/auth/sessions";
import { useAuthSessions, useRevokeAuthSession } from "@/hooks/useAuthSessionQueries";
import { useAuthStore } from "@/store/useAuthStore";
import SessionLogoutConfirmModal from "./modals/SessionLogoutConfirmModal";

function formatDeviceName(session: AuthSessionDto) {
  const parts = [session.browserName, session.osName].filter(Boolean);
  return parts.length > 0 ? parts.join(" / ") : "알 수 없는 기기";
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusLabel(status: string) {
  switch (status) {
    case "ACTIVE":
      return "사용 중";
    case "INVALIDATED":
    case "REVOKED":
      return "로그아웃됨";
    case "EXPIRED":
      return "만료됨";
    case "REUSED_DETECTED":
      return "보안 감지";
    default:
      return status;
  }
}

function isRevocableSession(session: AuthSessionDto) {
  return !session.currentDevice && session.status === "ACTIVE";
}

const LoginDeviceManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const tokens = useAuthStore((state) => state.tokens);
  const { data: sessions = [], isLoading, isError, refetch, error } = useAuthSessions();
  const revokeSessionMutation = useRevokeAuthSession();
  const [selectedSession, setSelectedSession] = useState<AuthSessionDto | null>(null);

  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => Number(b.currentDevice) - Number(a.currentDevice) || new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime()),
    [sessions]
  );

  if (!tokens) {
    return <Navigate to="/login" replace />;
  }

  const currentSession = sortedSessions.find((session) => session.currentDevice) ?? null;
  const otherSessions = sortedSessions.filter((session) => !session.currentDevice);

  const handleConfirmLogout = async () => {
    if (!selectedSession) return;

    try {
      await revokeSessionMutation.mutateAsync(selectedSession.tokenFamilyId);
      setSelectedSession(null);
    } catch {
      alert("기기 로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const errorMessage = error instanceof Error ? error.message : "기기 목록을 불러오지 못했습니다.";

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
      <main className="px-8 2xl:px-60 pt-5 pb-28">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-8">
          <div className="w-full px-12 py-2.5 flex items-center">
            <button
              type="button"
              onClick={() => navigate("/mypage/settings")}
              className="flex items-center gap-5 text-Headline_L_Bold text-black"
            >
              <span className="w-8 h-8 flex items-center justify-center text-[32px] leading-none" aria-hidden="true">
                ←
              </span>
              로그인 기기 관리
            </button>
          </div>

          <section className="bg-white border border-gray-300 rounded w-full px-10 py-8 flex flex-col gap-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex flex-col gap-3">
                <h2 className="text-Title_L_Medium text-black">로그인된 기기</h2>
                <p className="text-Subtitle_S_Regular text-[#4C4C4C] break-keep">
                  현재 로그인 중인 기기를 확인하고, 다른 기기의 세션만 안전하게 종료할 수 있습니다.
                </p>
              </div>
              <Button
                variant="secondary"
                size="small"
                onClick={() => refetch()}
                disabled={isLoading || revokeSessionMutation.isPending}
                className="!px-5 !py-3 !min-h-0 rounded-lg !bg-white !border-gray-300 !text-[#4C4C4C]"
              >
                새로고침
              </Button>
            </div>

            {isLoading ? (
              <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg px-10 py-16 text-center">
                <p className="text-Subtitle_L_Regular text-gray-400">로그인 기기 정보를 불러오는 중입니다...</p>
              </div>
            ) : isError ? (
              <div className="bg-etc-light-red border border-red-600 rounded-lg px-10 py-12 flex flex-col items-center gap-5 text-center">
                <p className="text-Subtitle_L_Medium text-red-600">기기 정보를 불러오지 못했습니다.</p>
                <p className="text-Subtitle_S_Regular text-[#4C4C4C]">{errorMessage}</p>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => refetch()}
                  className="!px-5 !py-3 !min-h-0 rounded-lg !bg-main-1 !border-main-1 !text-white"
                >
                  다시 시도
                </Button>
              </div>
            ) : sortedSessions.length === 0 ? (
              <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg px-10 py-16 text-center">
                <p className="text-Subtitle_L_Medium text-black">로그인된 기기가 없습니다.</p>
                <p className="text-Subtitle_S_Regular text-[#4C4C4C] pt-3">새로운 로그인 세션이 생성되면 이곳에서 확인할 수 있습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {currentSession ? (
                  <section className="bg-main-1/5 border border-main-1 rounded-lg px-8 py-7 flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-Subtitle_S_Regular text-main-1">현재 사용 중인 기기</p>
                        <h3 className="text-Title_M_Medium text-black">{formatDeviceName(currentSession)}</h3>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-main-1 px-4 py-2 text-Subtitle_S_Regular text-white">
                        현재 기기
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg border border-main-1/20 px-5 py-4 flex flex-col gap-2">
                        <p className="text-Caption_L_Light text-[#4C4C4C]">위치 / IP</p>
                        <p className="text-Subtitle_S_Regular text-black break-all">
                          {[currentSession.location, currentSession.ipAddress].filter(Boolean).join(" · ") || "정보 없음"}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg border border-main-1/20 px-5 py-4 flex flex-col gap-2">
                        <p className="text-Caption_L_Light text-[#4C4C4C]">최근 사용</p>
                        <p className="text-Subtitle_S_Regular text-black">{formatDateTime(currentSession.lastUsedAt)}</p>
                      </div>
                      <div className="bg-white rounded-lg border border-main-1/20 px-5 py-4 flex flex-col gap-2">
                        <p className="text-Caption_L_Light text-[#4C4C4C]">세션 상태</p>
                        <p className="text-Subtitle_S_Regular text-black">{getStatusLabel(currentSession.status)}</p>
                      </div>
                    </div>
                  </section>
                ) : null}

                <section className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-300 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-Title_M_Medium text-black">다른 기기</h3>
                      <p className="text-Subtitle_S_Regular text-[#4C4C4C] pt-2">현재 기기를 제외한 세션만 로그아웃할 수 있습니다.</p>
                    </div>
                    <span className="text-Subtitle_S_Regular text-[#4C4C4C]">총 {otherSessions.length}대</span>
                  </div>

                  {otherSessions.length === 0 ? (
                    <div className="px-8 py-14 text-center">
                      <p className="text-Subtitle_L_Regular text-gray-400">다른 기기에서 로그인된 세션이 없습니다.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {otherSessions.map((session, index) => {
                        const deviceMeta = [session.location, session.ipAddress].filter(Boolean).join(" · ");
                        const isPendingTarget = revokeSessionMutation.isPending && selectedSession?.tokenFamilyId === session.tokenFamilyId;
                        const canRevoke = isRevocableSession(session);

                        return (
                          <div
                            key={session.tokenFamilyId}
                            className={index < otherSessions.length - 1 ? "px-8 py-6 border-b border-gray-300 flex items-center justify-between gap-6" : "px-8 py-6 flex items-center justify-between gap-6"}
                          >
                            <div className="flex flex-col gap-3 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap">
                                <p className="text-Subtitle_L_Medium text-black">{formatDeviceName(session)}</p>
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-Caption_L_Light text-[#4C4C4C]">
                                  {getStatusLabel(session.status)}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1.5 text-Subtitle_S_Regular text-[#4C4C4C] break-all">
                                <p>{deviceMeta || "위치 및 IP 정보 없음"}</p>
                                <p>최근 사용 {formatDateTime(session.lastUsedAt)}</p>
                                <p>로그인 시작 {formatDateTime(session.createdAt)}</p>
                              </div>
                            </div>

                            {canRevoke ? (
                              <Button
                                variant="secondary"
                                size="small"
                                onClick={() => setSelectedSession(session)}
                                disabled={revokeSessionMutation.isPending}
                                className="!px-5 !py-3 !min-h-0 rounded-lg !bg-white !border-red-600 !text-red-600 shrink-0"
                              >
                                {isPendingTarget ? "처리 중..." : "로그아웃"}
                              </Button>
                            ) : (
                              <span className="text-Subtitle_S_Regular text-[#9AA4B2] shrink-0">
                                {session.status === "ACTIVE" ? "현재 기기" : "종료된 세션"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            )}
          </section>
        </div>
      </main>

      <SessionLogoutConfirmModal
        isOpen={selectedSession != null}
        session={selectedSession}
        onClose={() => {
          if (!revokeSessionMutation.isPending) {
            setSelectedSession(null);
          }
        }}
        onConfirm={handleConfirmLogout}
        isSubmitting={revokeSessionMutation.isPending}
      />
    </div>
  );
};

export default LoginDeviceManagementPage;
