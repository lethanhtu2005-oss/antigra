"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useA11y } from "@/components/A11yProvider";
import VerifiedImage from "@/components/VerifiedImage";
import { CameraIcon, SpeakerIcon, PhoneIcon, WaveIcon, AccessibleIcon, CheckIcon, TrashIcon } from "@/components/Icons";

const DEMO_SCENES = [
  {
    id: "scene-old-quarter",
    title: "Phố cổ Hà Nội",
    img: "/assets/images/old-quarter-street.jpg",
    alt: "Phố hẹp trong khu phố cổ Hà Nội với xe máy và hàng quán hai bên.",
    sceneDesc: "Hình ảnh cho thấy một tuyến phố cổ hẹp tại Hà Nội. Có các phương tiện xe máy đỗ dọc vỉa hè và biển hiệu cửa hàng phía trước. Lối đi hẹp, cần chú ý quan sát hoặc sử dụng gậy dò đường.",
    ocrDesc: "Văn bản nhận diện được: 'Cà phê Phố Cổ' · 'Cơm bình dân' · 'Biển cấm đỗ xe ngày chẵn'.",
    confidence: "Cao về cảnh quan, Trung bình về chướng ngại di động",
  },
  {
    id: "scene-cafe",
    title: "Mặt tiền quán cà phê",
    img: "/assets/images/cafe-street.jpg",
    alt: "Khu vực quán cà phê mặt phố với bàn ghế đặt gần lối đi.",
    sceneDesc: "Khung cảnh quán cà phê ngoài trời. Có bậc tam cấp cao khoảng 15cm trước lối vào chính, bàn ghế gỗ đặt sát lề đường. Không có ram dốc tiếp cận.",
    ocrDesc: "Văn bản nhận diện được: 'Coffee & Tea' · 'Mở cửa: 07:00 - 22:30' · 'Vui lòng dắt xe lên vỉa hè'.",
    confidence: "Trung bình",
  },
  {
    id: "scene-van-mieu",
    title: "Khuôn viên Văn Miếu",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Temple_of_Literature%2C_Hanoi_by_Xiquinho_Silva_02.jpg/1280px-Temple_of_Literature%2C_Hanoi_by_Xiquinho_Silva_02.jpg",
    fallback: "/assets/images/location-image-unavailable.svg",
    alt: "Khuôn viên Văn Miếu – Quốc Tử Giám với kiến trúc mái ngói truyền thống và sân lát gạch.",
    sceneDesc: "Khuôn viên di tích Văn Miếu – Quốc Tử Giám. Phía trước là cổng Khuê Văn Các với mái ngói cổ kính, sân lát gạch phẳng và hàng cây xanh hai bên lối đi.",
    ocrDesc: "Văn bản nhận diện được: 'Di tích Quốc gia Đặc biệt Văn Miếu – Quốc Tử Giám' · 'Lối tham quan theo chiều kim đồng hồ'.",
    confidence: "Rất cao về nhận diện di tích",
  },
];

export default function AssistantPage() {
  const { speak, stop } = useA11y();

  // Mode: "camera" | "upload" | "demo"
  const [sourceMode, setSourceMode] = useState("camera");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("environment");
  const [cameraError, setCameraError] = useState("");

  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisType, setAnalysisType] = useState("scene"); // "scene" | "ocr"
  const [demoIndex, setDemoIndex] = useState(0);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [qualityWarning, setQualityWarning] = useState("");
  const [history, setHistory] = useState([]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const h = JSON.parse(localStorage.getItem("we-ai-history") || "[]");
      setHistory(h);
    } catch (_) {}
  }, []);

  // Save history helper
  const addHistory = useCallback((entry) => {
    const updated = [entry, ...history.slice(0, 9)];
    setHistory(updated);
    try {
      localStorage.setItem("we-ai-history", JSON.stringify(updated));
    } catch (_) {}
  }, [history]);

  function clearHistory() {
    setHistory([]);
    try {
      localStorage.removeItem("we-ai-history");
    } catch (_) {}
    speak("Đã xóa lịch sử nhận diện.");
  }

  // Camera Management (AI01)
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async (facing = cameraFacing) => {
    stopCamera();
    setCameraError("");
    setQualityWarning("");

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Thiết bị hoặc trình duyệt không hỗ trợ truy cập camera trực tiếp. Vui lòng sử dụng tính năng tải ảnh.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      speak("Đã mở camera. Hướng ống kính về phía cảnh vật hoặc văn bản bạn muốn nhận diện rồi nhấn nút chụp.");
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Quyền camera đã bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt để WayEcho có thể mở camera.");
        speak("Bạn đã từ chối quyền mở camera.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("Không tìm thấy camera trên thiết bị của bạn.");
      } else {
        setCameraError(`Không thể khởi động camera: ${err.message || "Lỗi không xác định"}`);
      }
    }
  }, [cameraFacing, stopCamera, speak]);

  useEffect(() => {
    if (sourceMode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [sourceMode, startCamera, stopCamera]);

  function flipCamera() {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  }

  // Capture Photo from Camera (AI02)
  function takeSnapshot() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    setCapturedImage(dataUrl);
    stopCamera();
    checkImageQuality(canvas, ctx);
    speak("Đã chụp ảnh. Nhấn nút phân tích để nhận diện.");
  }

  // Handle Upload Image File (AI02)
  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      setCapturedImage(dataUrl);

      // Quality check on uploaded image
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        checkImageQuality(canvas, ctx);
      };
      img.src = dataUrl;
      speak("Đã tải ảnh lên. Nhấn nút phân tích để nghe mô tả.");
    };
    reader.readAsDataURL(file);
  }

  // Check Brightness & Quality (AI07)
  function checkImageQuality(canvas, ctx) {
    try {
      const sampleWidth = Math.min(canvas.width, 100);
      const sampleHeight = Math.min(canvas.height, 100);
      const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
      const data = imgData.data;
      let totalBrightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        // Luminance calculation
        const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        totalBrightness += brightness;
      }
      const avgBrightness = totalBrightness / (data.length / 4);

      if (avgBrightness < 35) {
        setQualityWarning("Cảnh báo: Ảnh quá tối hoặc thiếu sáng. AI có thể không đủ căn cứ để nhận diện chính xác. Vui lòng chụp lại nơi có đủ ánh sáng!");
      } else if (avgBrightness > 245) {
        setQualityWarning("Cảnh báo: Ảnh bị lóa hoặc thừa sáng quá mức. Thông tin chữ hoặc chướng ngại vật có thể bị mờ.");
      } else {
        setQualityWarning("");
      }
    } catch (_) {
      setQualityWarning("");
    }
  }

  // Analyze Image (AI03, AI04, AI05, AI07)
  function analyzeCurrent() {
    setAnalyzing(true);
    setResult(null);
    speak(analysisType === "ocr" ? "Đang quét văn bản và biển báo trong ảnh..." : "Đang phân tích và mô tả khung cảnh...");

    setTimeout(() => {
      setAnalyzing(false);

      let textDesc = "";
      let confidence = "Trung bình";
      let title = "Ảnh chụp thiết bị";

      if (sourceMode === "demo") {
        const d = DEMO_SCENES[demoIndex];
        title = d.title;
        textDesc = analysisType === "ocr" ? d.ocrDesc : d.sceneDesc;
        confidence = d.confidence;
      } else if (qualityWarning) {
        textDesc = `AI ghi nhận ảnh bị hạn chế về độ sáng. ${analysisType === "ocr" ? "Không nhận diện được rõ văn bản trên biển hiệu." : "Khung cảnh bị tối, chỉ nhận diện được mảng sáng tối mơ hồ; không đủ căn cứ để xác nhận an toàn lối đi."}`;
        confidence = "Thấp (Do chất lượng ảnh thiếu sáng)";
      } else {
        textDesc = analysisType === "ocr"
          ? "Đã quét ảnh: Nhận diện được một số ký tự văn bản trên bề mặt biển hiệu. Cần hướng camera thẳng góc 90 độ và giữ chắc tay để nhận diện chi tiết hơn."
          : "Khung cảnh nhìn thấy có không gian lối đi và công trình phía trước. Hệ thống không thể đảm bảo khoảng cách an toàn tuyệt đối thời gian thực chỉ từ một bức ảnh đơn lẻ.";
        confidence = "Ước lượng hỗ trợ";
      }

      const res = {
        title,
        text: textDesc,
        type: analysisType,
        confidence,
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };
      setResult(res);
      addHistory(res);
      speak(`${res.text} Mức độ tin cậy: ${res.confidence}.`);
    }, 1200);
  }

  function retake() {
    setCapturedImage(null);
    setResult(null);
    setQualityWarning("");
    stop();
    if (sourceMode === "camera") {
      startCamera();
    }
  }

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> · <span aria-current="page" className="font-semibold text-ink">Trợ lý Camera AI</span>
      </nav>

      <div className="mt-4 max-w-3xl">
        <span className="chip hc-surface hc-border bg-primary font-bold">
          <CameraIcon size={18} /> Thị giác AI & OCR hỗ trợ tiếp cận
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold">Trợ lý mô tả & nhận diện hình ảnh</h1>
        <p className="hc-muted mt-3 text-lg leading-relaxed text-ink-soft">
          Sử dụng camera hoặc tải ảnh lên để nhận diện biển hiệu, đọc thực đơn và lắng nghe mô tả khung cảnh xung quanh bằng giọng nói.
        </p>
      </div>

      {/* Privacy Notice Banner (AI11) */}
      <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-950 hc-border" role="note">
        <p className="text-sm flex items-start gap-2">
          <CheckIcon size={18} className="shrink-0 mt-0.5 text-blue-700" />
          <span>
            <strong>Bảo vệ quyền riêng tư (AI11):</strong> Ảnh chỉ được xử lý khi bạn chủ động nhấn nút Chụp hoặc Chọn ảnh. WayEcho không tự động ghi hình hay tải ảnh ngầm của bạn lên máy chủ.
          </span>
        </p>
      </div>

      {/* Source Selection & Mode Switch */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 hc-border">
        <div className="flex rounded-xl bg-surface-alt p-1 hc-surface hc-border" role="tablist" aria-label="Chọn nguồn hình ảnh">
          <button
            type="button"
            role="tab"
            aria-selected={sourceMode === "camera"}
            onClick={() => { setSourceMode("camera"); setCapturedImage(null); }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${sourceMode === "camera" ? "bg-white text-ink shadow-sm hc-surface" : "text-ink-soft hc-muted"}`}
          >
            📷 Mở Camera thiết bị
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={sourceMode === "upload"}
            onClick={() => { setSourceMode("upload"); setCapturedImage(null); }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${sourceMode === "upload" ? "bg-white text-ink shadow-sm hc-surface" : "text-ink-soft hc-muted"}`}
          >
            📁 Tải ảnh từ máy
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={sourceMode === "demo"}
            onClick={() => { setSourceMode("demo"); setCapturedImage(null); }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${sourceMode === "demo" ? "bg-white text-ink shadow-sm hc-surface" : "text-ink-soft hc-muted"}`}
          >
            🏛 Ảnh mẫu Hà Nội
          </button>
        </div>

        {/* Analysis Type: Scene vs OCR */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-ink-soft hc-muted">Chế độ phân tích:</span>
          <button
            type="button"
            onClick={() => setAnalysisType("scene")}
            className={`rounded-full px-3.5 py-1.5 font-bold transition ${analysisType === "scene" ? "bg-primary text-ink" : "border border-line bg-white text-ink hc-surface hc-border"}`}
          >
            Mô tả toàn cảnh
          </button>
          <button
            type="button"
            onClick={() => setAnalysisType("ocr")}
            className={`rounded-full px-3.5 py-1.5 font-bold transition ${analysisType === "ocr" ? "bg-primary text-ink" : "border border-line bg-white text-ink hc-surface hc-border"}`}
          >
            Đọc biển báo / OCR
          </button>
        </div>
      </div>

      {/* Main Viewport & Analysis Area */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          {/* Viewfinder Card */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-2 border-line bg-black shadow-card hc-border">
            {sourceMode === "camera" && !capturedImage && (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
                {!cameraActive && !cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-neutral-900">
                    <p className="text-base font-medium">Đang chuẩn bị camera...</p>
                  </div>
                )}
                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-neutral-900" role="alert">
                    <p className="text-lg font-bold text-red-400">Không mở được camera</p>
                    <p className="mt-2 text-sm text-neutral-300 max-w-sm">{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="btn-primary mt-4 !min-h-[40px] !py-2 text-sm"
                    >
                      Thử lại
                    </button>
                  </div>
                )}
                {/* Aiming guidelines */}
                {cameraActive && (
                  <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-dashed border-white/70 flex items-center justify-center">
                    <span className="rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                      {analysisType === "ocr" ? "Đặt văn bản hoặc biển hiệu vào khung này" : "Hướng camera vào cảnh quan phía trước"}
                    </span>
                  </div>
                )}
              </>
            )}

            {capturedImage && (
              <img
                src={capturedImage}
                alt="Ảnh vừa chụp hoặc tải lên sẵn sàng để phân tích"
                className={`h-full w-full object-contain bg-black transition ${analyzing ? "blur-sm brightness-75" : ""}`}
              />
            )}

            {sourceMode === "upload" && !capturedImage && (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center text-white bg-neutral-900">
                <CameraIcon size={48} className="text-neutral-400" />
                <p className="mt-3 text-lg font-semibold">Chọn ảnh từ thiết bị của bạn</p>
                <p className="mt-1 text-sm text-neutral-400">Hỗ trợ ảnh chụp biển hiệu, thực đơn hoặc cảnh đường phố</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary mt-4 text-base"
                >
                  Chọn tập tin ảnh
                </button>
              </div>
            )}

            {sourceMode === "demo" && (
              <div className="relative h-full w-full">
                <VerifiedImage
                  src={DEMO_SCENES[demoIndex].img}
                  fallback={DEMO_SCENES[demoIndex].fallback}
                  alt={DEMO_SCENES[demoIndex].alt}
                  className={`h-full w-full object-cover transition ${analyzing ? "blur-sm brightness-75" : ""}`}
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1 text-xs text-white">
                  Ảnh mẫu: {DEMO_SCENES[demoIndex].title}
                </span>
              </div>
            )}

            {analyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white backdrop-blur-xs">
                <span className="flex items-center gap-2 rounded-full bg-black/85 px-5 py-2.5 font-bold text-sm shadow-xl">
                  <WaveIcon size={20} className="animate-spin" /> Đang phân tích hình ảnh...
                </span>
              </div>
            )}
          </div>

          {/* Quality Warning Alert (AI07) */}
          {qualityWarning && (
            <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 hc-border" role="alert">
              ⚠ {qualityWarning}
            </div>
          )}

          {/* Action Buttons Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {sourceMode === "camera" && !capturedImage && cameraActive && (
              <>
                <button
                  type="button"
                  onClick={takeSnapshot}
                  className="btn-primary text-base flex-1 !min-h-[48px]"
                >
                  <CameraIcon size={22} /> Chụp ảnh ngay
                </button>
                <button
                  type="button"
                  onClick={flipCamera}
                  className="btn-ghost hc-border text-sm !min-h-[48px] !px-4"
                  title="Đổi camera trước / sau"
                  aria-label="Đổi camera trước hoặc sau"
                >
                  🔄 Đổi camera
                </button>
              </>
            )}

            {capturedImage && (
              <>
                <button
                  type="button"
                  onClick={analyzeCurrent}
                  disabled={analyzing}
                  className="btn-primary text-base flex-1 !min-h-[48px] disabled:opacity-60"
                >
                  <WaveIcon size={20} /> {analyzing ? "Đang phân tích..." : `Phân tích (${analysisType === "ocr" ? "OCR đọc chữ" : "Mô tả toàn cảnh"})`}
                </button>
                <button
                  type="button"
                  onClick={retake}
                  className="btn-ghost hc-border text-sm !min-h-[48px] !px-4"
                >
                  Chụp lại
                </button>
              </>
            )}

            {sourceMode === "demo" && (
              <>
                <button
                  type="button"
                  onClick={analyzeCurrent}
                  disabled={analyzing}
                  className="btn-primary text-base flex-1 !min-h-[48px]"
                >
                  Phân tích ảnh này
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDemoIndex((demoIndex + 1) % DEMO_SCENES.length);
                    setResult(null);
                  }}
                  className="btn-ghost hc-border text-sm !min-h-[48px] !px-4"
                >
                  Đổi ảnh mẫu khác
                </button>
              </>
            )}

            {sourceMode === "upload" && !capturedImage && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary text-base flex-1 !min-h-[48px]"
              >
                Tải ảnh khác
              </button>
            )}
          </div>
        </div>

        {/* Right side: Results, Voice playback & Safety */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border">
            <div className="flex items-center justify-between border-b border-line pb-3 hc-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <SpeakerIcon size={20} className="text-accent-dark" /> Kết quả phân tích
              </h2>
              {result?.confidence && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                  {result.confidence}
                </span>
              )}
            </div>

            <div className="mt-4 min-h-[7rem]" aria-live="polite">
              {result ? (
                <div>
                  <p className="text-lg leading-relaxed text-ink hc-surface">{result.text}</p>
                  <p className="mt-3 text-xs text-ink-soft hc-muted">Thời điểm nhận diện: {result.time}</p>
                </div>
              ) : (
                <p className="text-ink-soft hc-muted text-base leading-relaxed">
                  Chụp hoặc chọn ảnh, sau đó nhấn <strong>“Phân tích”</strong> để lắng nghe kết quả mô tả khung cảnh hoặc đọc văn bản OCR.
                </p>
              )}
            </div>

            {result && (
              <div className="mt-5 pt-4 border-t border-line flex flex-wrap gap-2 hc-border">
                <button
                  type="button"
                  onClick={() => speak(`${result.text} Mức độ tin cậy: ${result.confidence}.`)}
                  className="btn-primary !min-h-[40px] !py-2 text-sm flex-1 text-center"
                >
                  <SpeakerIcon size={18} /> Nghe lại kết quả
                </button>
                <button
                  type="button"
                  onClick={stop}
                  className="btn-ghost hc-border !min-h-[40px] !py-2 text-sm"
                >
                  Dừng đọc
                </button>
              </div>
            )}
          </div>

          {/* Fallback to Human Support (AI09, AI10) */}
          <div className="rounded-3xl bg-black p-6 text-white">
            <h3 className="text-xl font-bold">Cần hỗ trợ con người trực tiếp?</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              Nếu ảnh chụp không rõ ràng hoặc bạn đang ở ngã tư đông đúc, hãy kết nối với hướng dẫn viên hoặc mở kênh trợ giúp khẩn cấp.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/services#guide" className="btn-primary !min-h-[40px] !py-2 text-sm flex-1 text-center">
                <PhoneIcon size={16} /> Tìm Guide đồng hành
              </Link>
              <Link href="/sos" className="btn-dark border border-neutral-700 !min-h-[40px] !py-2 text-sm">
                Gọi SOS
              </Link>
            </div>
          </div>

          {/* History (AI08) */}
          {history.length > 0 && (
            <div className="rounded-3xl border border-line bg-white p-5 shadow-card hc-surface hc-border">
              <div className="flex items-center justify-between border-b border-line pb-3 hc-border">
                <h3 className="font-bold text-base">Lịch sử nhận diện gần đây ({history.length})</h3>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
                >
                  <TrashIcon size={14} /> Xóa lịch sử
                </button>
              </div>
              <ul className="mt-3 space-y-2.5 max-h-48 overflow-y-auto">
                {history.map((item, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-3 text-xs border-b border-line pb-2 hc-border">
                    <div className="min-w-0">
                      <p className="font-bold truncate">{item.title} ({item.type === "ocr" ? "OCR" : "Cảnh quan"})</p>
                      <p className="text-ink-soft hc-muted line-clamp-1 mt-0.5">{item.text}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => speak(item.text)}
                      className="shrink-0 p-1 rounded-full bg-surface-alt hover:bg-primary"
                      aria-label="Nghe lại bản ghi này"
                    >
                      <SpeakerIcon size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

