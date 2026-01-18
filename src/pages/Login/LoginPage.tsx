import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoIcon from "@/assets/svgs/LogoIcon";
import NaverIcon from "@/assets/svgs/NaverIcon";
import GoogleIcon from "@/assets/svgs/GoogleIcon";
import EmailIcon from "@/assets/svgs/EmailIcon";
import { TextField, Button } from "@/components";
import UserIcon from "@/assets/svgs/UserIcon";
import LockIcon from "@/assets/svgs/LockIcon";
import EyeIcon from "@/assets/svgs/EyeIcon";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);
  
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authApi.login({ loginId, password });
      setTokens(response.data);
      navigate("/");
    } catch (error: any) {
      alert(error.response?.data?.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-noto">
      <div className="w-full max-w-[480px] bg-white px-[56px] py-[75px] shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)] rounded-lg">
        {/* Header */}
        <div className="flex flex-col items-center gap-[40px] mb-[40px]">
          <div className="flex flex-col items-center gap-[20px]">
            <LogoIcon className="size-[76px]" />
            <h1 className="text-Headline_L_Bold text-black">FinVibe</h1>
          </div>
          <p className="text-Subtitle_L_Regular text-black text-center">
            간편하게 시작하고 스마트하게 관리하세요
          </p>
        </div>

        {/* Local Login Form */}
        <form onSubmit={handleLocalLogin} className="flex flex-col gap-[12px] mb-[24px]">
          <TextField
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            leftIcon={<UserIcon className="size-[24px] text-gray-400" />}
            fullWidth
          />
          <TextField
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<LockIcon className="size-[24px] text-gray-400" />}
            rightIcon={<EyeIcon />}
            onRightIconClick={() => setShowPassword(!showPassword)}
            fullWidth
          />
          <Button 
            type="submit" 
            fullWidth 
            loading={isLoading}
            className="bg-black text-white py-3 rounded-lg mt-2"
          >
            로그인
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-[19px] mb-[24px]">
          <div className="h-[1px] flex-1 bg-gray-200" />
          <span className="text-Body_M_Light text-gray-400">또는 SNS 로그인</span>
          <div className="h-[1px] flex-1 bg-gray-200" />
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col gap-[12px] mb-[32px]">
          {/* Naver */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "https://finvibe.space/api/user/oauth2/authorization/naver";
            }}
            className="flex items-center justify-center gap-[10px] w-full bg-[#03c75a] py-[10px] rounded-[8px] text-white text-Body_M_Light hover:opacity-90 transition-opacity"
          >
            <NaverIcon className="size-[20px]" />
            <span>네이버로 계속하기</span>
          </button>

          {/* Google */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "https://finvibe.space/api/user/oauth2/authorization/google";
            }}
            className="flex items-center justify-center gap-[10px] w-full bg-white border border-gray-300 py-[10px] rounded-[8px] text-black text-Body_M_Light hover:bg-gray-50 transition-colors"
          >
            <GoogleIcon className="size-[20px]" />
            <span>구글로 계속하기</span>
          </button>
        </div>

        {/* Signup Link */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-main-1 text-Body_M_Regular hover:underline"
          >
            아직 계정이 없으신가요? 회원가입하기
          </button>
        </div>

        {/* Footer */}
        <div className="mt-[40px] text-center text-Caption_L_Light text-gray-400">
          <p>계속 진행하면 이용약관 및 개인정보처리방침에</p>
          <p>동의하는 것으로 간주됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

