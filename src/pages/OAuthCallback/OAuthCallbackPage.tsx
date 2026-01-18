import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const OAuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);

  useEffect(() => {
    const registrationRequired =
      searchParams.get("registration_required") === "true";
    const temporaryToken = searchParams.get("temporary_token");
    const accessToken = searchParams.get("access_token");
    const email = searchParams.get("email");

    console.log("OAuth Callback Params:", {
      registrationRequired,
      hasTemporaryToken: !!temporaryToken,
      hasAccessToken: !!accessToken,
      email,
    });

    // 1. 신규 유저 (회원가입 필요): registration_required가 true이거나, temporary_token이 있는 경우
    if (registrationRequired || (temporaryToken && !accessToken)) {
      console.log("New user detected, redirecting to signup...");
      navigate("/signup/oauth", {
        state: { temporaryToken, email },
        replace: true,
      });
    }
    // 2. 기존 유저 (로그인 완료): access_token이 있는 경우
    else if (accessToken) {
      const tokens = {
        accessToken: accessToken,
        refreshToken: searchParams.get("refresh_token") ?? "",
        accessExpiresAt: searchParams.get("access_expires_at") ?? "",
        refreshExpiresAt: searchParams.get("refresh_expires_at") ?? "",
      };

      console.log("Existing user detected, saving tokens...");
      setTokens(tokens);
      navigate("/", { replace: true });
    }
    // 3. 에러 케이스
    else {
      console.error(
        "Invalid OAuth callback state - No access_token or temporary_token found"
      );
      alert("로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      navigate("/login", { replace: true });
    }
  }, [searchParams, setTokens, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#42d6ba] border-t-transparent"></div>
        <p className="text-lg font-medium text-gray-600 font-noto">
          로그인 중입니다...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
