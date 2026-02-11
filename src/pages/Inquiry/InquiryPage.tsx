import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components";
import { cn } from "@/utils/cn";
import UploadIcon from "@/assets/icons/upload.svg?react";

type InquiryTab = "write" | "history";

const MAX_TITLE_LEN = 50;
const MAX_CONTENT_LEN = 2000;
const MAX_IMAGES = 3;

const InquiryPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [tab, setTab] = useState<InquiryTab>("write");
  const [inquiryType, setInquiryType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [agree, setAgree] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return (
      tab === "write" &&
      inquiryType.trim().length > 0 &&
      title.trim().length > 0 &&
      content.trim().length > 0 &&
      agree
    );
  }, [tab, inquiryType, title, content, agree]);

  const pickFiles = () => {
    fileInputRef.current?.click();
  };

  const onFilesSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const fileList = Array.from(e.target.files ?? []);
    // 동일 파일 재선택 가능하도록 초기화
    e.target.value = "";

    if (fileList.length === 0) return;

    const filtered = fileList.filter((f) =>
      ["image/jpeg", "image/png"].includes(f.type)
    );

    if (filtered.length !== fileList.length) {
      setImageError("JPG 또는 PNG 파일만 첨부할 수 있어요.");
    } else {
      setImageError(null);
    }

    const next = [...images, ...filtered].slice(0, MAX_IMAGES);
    if (images.length + filtered.length > MAX_IMAGES) {
      setImageError(`이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있어요.`);
    }
    setImages(next);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageError(null);
  };

  const onCancel = () => {
    // 화면 디자인상 "취소"는 이전 페이지로 이동하는 UX가 자연스러움
    navigate(-1);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!isValid) return;

    // TODO: 백엔드 API 연동 시 여기에서 multipart 업로드로 전환
    window.alert("문의가 접수되었습니다. 감사합니다.");

    setInquiryType("");
    setTitle("");
    setContent("");
    setImages([]);
    setAgree(false);
    setImageError(null);
  };

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
      <main className="w-full px-4 sm:px-8 2xl:px-60 pt-10 pb-20">
        <div className="w-full max-w-[1440px] mx-auto">
          <section className="bg-white border border-gray-300 rounded-[4px] px-5 sm:px-10 py-[30px] flex flex-col gap-[30px]">
            <h1 className="text-Headline_L_Bold text-black">1:1 문의</h1>

            {/* Tabs */}
            <div
              className="w-full border-b border-gray-300 flex"
              role="tablist"
              aria-label="1:1 문의 탭"
            >
              <button
                type="button"
                role="tab"
                aria-selected={tab === "write"}
                onClick={() => setTab("write")}
                className={cn(
                  "px-5 py-2.5 text-Subtitle_L_Regular text-black",
                  tab === "write" ? "border-b-2 border-main-1 -mb-px" : "opacity-90"
                )}
              >
                문의하기
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "history"}
                onClick={() => setTab("history")}
                className={cn(
                  "px-5 py-2.5 text-Subtitle_L_Regular text-black",
                  tab === "history"
                    ? "border-b-2 border-main-1 -mb-px"
                    : "opacity-90"
                )}
              >
                나의 문의 내역
              </button>
            </div>

            {tab === "history" ? (
              <div className="px-2 sm:px-5 py-10 text-center text-Body_L_Light text-gray-500">
                문의 내역이 없습니다.
              </div>
            ) : (
              <form onSubmit={onSubmit} className="w-full flex flex-col gap-6">
                {/* 문의 유형 */}
                <div className="w-full px-5 pt-2">
                  <label className="block text-Subtitle_M_Regular text-black mb-3">
                    문의 유형 <span className="text-etc-red">*</span>
                  </label>
                  <input
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    placeholder="문의 유형을 입력해주세요."
                    className={cn(
                      "w-full h-[52px] rounded-lg px-7",
                      "bg-white border border-gray-300",
                      "text-Body_M_Light text-black placeholder:text-gray-500",
                      "focus:outline-none focus:border-main-1"
                    )}
                  />
                </div>

                {/* 제목 */}
                <div className="w-full px-5 pt-2">
                  <label className="block text-Subtitle_M_Regular text-black mb-3">
                    제목 <span className="text-etc-red">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LEN))}
                    placeholder="제목을 입력해주세요. (최대 50자)"
                    className={cn(
                      "w-full h-[52px] rounded-lg px-7",
                      "bg-white border border-gray-300",
                      "text-Body_M_Light text-black placeholder:text-gray-500",
                      "focus:outline-none focus:border-main-1"
                    )}
                  />
                  <div className="w-full flex justify-end pt-2">
                    <p className="text-Body_L_Light text-black">
                      {title.length} / {MAX_TITLE_LEN}
                    </p>
                  </div>
                </div>

                {/* 내용 */}
                <div className="w-full px-5 pt-2">
                  <label className="block text-Subtitle_M_Regular text-black mb-3">
                    내용 <span className="text-etc-red">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) =>
                      setContent(e.target.value.slice(0, MAX_CONTENT_LEN))
                    }
                    placeholder="문의 내용을 상세히 적어주세요. (단말기 정보, 오류 화면 등)"
                    className={cn(
                      "w-full min-h-[315px] rounded-lg px-7 py-5 resize-none",
                      "bg-white border border-gray-300",
                      "text-Body_M_Light text-black placeholder:text-gray-500",
                      "focus:outline-none focus:border-main-1"
                    )}
                  />
                  <div className="w-full flex justify-end pt-2">
                    <p className="text-Body_L_Light text-black">
                      {content.length} / {MAX_CONTENT_LEN}
                    </p>
                  </div>
                </div>

                {/* 이미지 첨부 */}
                <div className="w-full px-5 pt-2">
                  <p className="text-Subtitle_M_Regular text-black mb-3">이미지 첨부</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col items-start gap-2">
                      <button
                        type="button"
                        onClick={pickFiles}
                        className={cn(
                          "border-2 border-sub-blue rounded-lg",
                          "px-5 py-2.5 inline-flex items-center justify-center gap-2",
                          "text-Body_L_Regular text-black hover:bg-gray-50 transition-colors"
                        )}
                      >
                        <UploadIcon className="size-6" aria-hidden="true" />
                        파일 선택
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        multiple
                        className="hidden"
                        onChange={onFilesSelected}
                      />

                      <p className="text-Body_L_Light text-black">
                        최대 {MAX_IMAGES}장 (JPG, PNG)
                      </p>
                    </div>

                    {imageError && (
                      <p className="text-Body_M_Light text-etc-red">{imageError}</p>
                    )}

                    {images.length > 0 && (
                      <div className="border border-gray-300 rounded-lg p-4 bg-white">
                        <ul className="flex flex-col gap-2">
                          {images.map((f, idx) => (
                            <li
                              key={`${f.name}-${idx}`}
                              className="flex items-center justify-between gap-3"
                            >
                              <span className="text-Body_M_Light text-black break-all">
                                {f.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="text-Body_M_Light text-gray-500 hover:text-black"
                                aria-label={`${f.name} 삭제`}
                              >
                                삭제
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* 개인정보 동의 */}
                <div className="w-full">
                  <div className="bg-[#EAEBED] rounded-lg px-5 py-2.5 w-full">
                    <label className="flex items-center gap-2.5 px-2 py-2.5 cursor-pointer">
                      <span className="relative inline-flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={agree}
                          onChange={(e) => setAgree(e.target.checked)}
                          className="peer sr-only"
                        />
                        <span
                          className={cn(
                            "size-4 rounded-[2px] border border-gray-300 bg-white",
                            "inline-flex items-center justify-center",
                            "peer-checked:bg-main-1 peer-checked:border-main-1",
                            "[&_svg]:opacity-0 peer-checked:[&_svg]:opacity-100"
                          )}
                          aria-hidden="true"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="size-3 transition-opacity"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                      </span>
                      <span className="text-Subtitle_M_Regular text-black">
                        문의 처리를 위한 개인정보 수집 및 이용에 동의합니다.{" "}
                        <span className="text-etc-red">(필수)</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-[30px] px-4 sm:px-[122px] py-2.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="large"
                    fullWidth={false}
                    className={cn(
                      "w-full sm:!flex-1 !rounded-[4px]",
                      "!px-0 !py-2 !min-h-0",
                      "!border-gray-300 !bg-white !text-black !text-Body_L_Regular",
                      "hover:!bg-gray-50"
                    )}
                    onClick={onCancel}
                  >
                    취소
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    fullWidth={false}
                    disabled={!isValid}
                    className={cn(
                      "w-full sm:!flex-1 !rounded-[4px]",
                      "!px-0 !py-2 !min-h-0 !text-Body_L_Regular",
                      isValid
                        ? "!bg-main-1 !border-main-1 hover:!bg-teal"
                        : "!bg-gray-200 !border-gray-200 !text-gray-400"
                    )}
                  >
                    문의 접수하기
                  </Button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default InquiryPage;


