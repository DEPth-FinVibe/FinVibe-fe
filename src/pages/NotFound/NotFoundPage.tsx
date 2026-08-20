import { useLocation, useNavigate } from "react-router-dom";

/**
 * 라우트가 매칭되지 않은 경로에서 보여주는 404 페이지.
 * catch-all 라우트가 없으면 화면이 완전히 비어버리기 때문에 항상 존재해야 한다.
 */
const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <main className="flex flex-col items-center justify-center gap-6 px-6 py-[120px] text-center">
      <p className="text-[80px] leading-none font-bold text-main-1">404</p>

      <div className="flex flex-col gap-2">
        <h1 className="text-Headline_S_Bold text-black">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-Subtitle_M_Medium text-gray-2">
          주소가 바뀌었거나 삭제된 페이지일 수 있습니다.
        </p>
        <p className="text-Subtitle_S_Regular text-gray-2 break-all">
          {location.pathname}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-Body_M_Light text-black hover:bg-gray-100 transition-colors"
        >
          이전으로
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-lg bg-main-1 text-white text-Body_M_Light hover:bg-main-2 transition-colors"
        >
          홈으로
        </button>
      </div>
    </main>
  );
};

export default NotFoundPage;
