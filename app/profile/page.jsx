"use client";

import { useEffect, useState } from "react";
import { useA11y } from "@/components/A11yProvider";
import { UserIcon, SpeakerIcon, AccessibleIcon, PhoneIcon, CheckIcon, MoonIcon, SunIcon } from "@/components/Icons";

const GROUPS = [
  { title: "Visual — Thị giác", items: [["largeText", "Large Text — Chữ lớn"], ["highContrast", "High Contrast — Tương phản cao"], ["magnification", "Screen Magnification — Phóng to màn hình"], ["colorAdjust", "Color Adjustment — Điều chỉnh màu sắc"]] },
  { title: "Audio — Âm thanh", items: [["screenReader", "Screen Reader — Đọc màn hình"], ["audioDescription", "Audio Description — Mô tả âm thanh"], ["voiceNavigation", "Voice Navigation — Điều hướng giọng nói"], ["voiceCommand", "Voice Command — Điều khiển giọng nói"]] },
  { title: "Mobility — Di chuyển & Hỗ trợ", items: [["stepFree", "Step-free Access — Lối không bậc"], ["elevator", "Elevator Access — Thang máy"], ["staff", "Staff Assistance — Nhân viên hỗ trợ"], ["guideDog", "Guide Dog Accommodation — Hỗ trợ chó dẫn đường"]] },
  { title: "Travel Assistance — Hỗ trợ hành trình", items: [["checkin", "Check-in Assistance — Hỗ trợ làm thủ tục"], ["navigation", "Navigation Assistance — Hỗ trợ tìm đường"], ["transport", "Transport Assistance — Hỗ trợ lên/xuống xe"], ["attraction", "Attraction Assistance — Hỗ trợ tại di tích"]] },
];

const DEFAULT_PREFS = { screenReader: true, audioDescription: true, staff: true, navigation: true };

export default function ProfilePage() {
  const { theme, toggleTheme, speak, contrast, largeText, setContrastEnabled, setLargeTextEnabled, speechRate, setSpeechRate } = useA11y();

  // User auth state
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [loginForm, setLoginForm] = useState({ account: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", userType: "lowvision", emergency: "", password: "", confirmPassword: "" });
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Accessibility & profile state
  const [userType, setUserType] = useState("lowvision");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [personalNotes, setPersonalNotes] = useState("");
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [shareWithBusiness, setShareWithBusiness] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("we-user") || "null");
      if (savedUser) setUser(savedUser);

      setUserType(localStorage.getItem("we-usertype") || "lowvision");
      const emg = localStorage.getItem("we-emergency") || "";
      const sep = emg.lastIndexOf(" - ");
      if (sep >= 0) {
        setEmergencyName(emg.slice(0, sep));
        setEmergencyPhone(emg.slice(sep + 3));
      } else {
        setEmergencyPhone(emg);
      }
      setPersonalNotes(localStorage.getItem("we-personal-notes") || "");
      const savedPrefs = JSON.parse(localStorage.getItem("we-access-prefs") || "null");
      if (savedPrefs) setPrefs(savedPrefs);
      setShareWithBusiness(localStorage.getItem("we-share-business") !== "0");
      setShareLocation(localStorage.getItem("we-share-location") !== "0");
    } catch (_) {}
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    setAuthError("");
    if (!loginForm.account.trim()) {
      setAuthError("Vui lòng nhập email hoặc số điện thoại.");
      return;
    }
    if (!loginForm.password.trim()) {
      setAuthError("Vui lòng nhập mật khẩu.");
      return;
    }

    const loggedUser = {
      name: loginForm.account.includes("@") ? loginForm.account.split("@")[0] : loginForm.account.trim(),
      account: loginForm.account,
      token: `demo_tok_${Date.now()}`,
    };
    try {
      localStorage.setItem("we-user", JSON.stringify(loggedUser));
    } catch (_) {}
    setUser(loggedUser);
    setAuthSuccess("Đăng nhập thành công!");
    speak(`Xin chào ${loggedUser.name}, bạn đã đăng nhập thành công.`);
  }

  function handleRegister(e) {
    e.preventDefault();
    setAuthError("");
    if (!regForm.name.trim()) {
      setAuthError("Vui lòng nhập họ và tên.");
      return;
    }
    if (!regForm.email.trim() && !regForm.phone.trim()) {
      setAuthError("Vui lòng nhập email hoặc số điện thoại.");
      return;
    }
    if (regForm.password.length < 6) {
      setAuthError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setAuthError("Mật khẩu xác nhận không khớp.");
      return;
    }

    const newUser = {
      name: regForm.name.trim(),
      email: regForm.email.trim(),
      phone: regForm.phone.trim(),
      userType: regForm.userType,
      token: `demo_tok_${Date.now()}`,
    };
    try {
      localStorage.setItem("we-user", JSON.stringify(newUser));
      localStorage.setItem("we-usertype", regForm.userType);
      if (regForm.emergency) localStorage.setItem("we-emergency", regForm.emergency);
    } catch (_) {}
    setUser(newUser);
    setUserType(regForm.userType);
    setAuthSuccess("Đăng ký tài khoản thành công!");
    speak(`Chúc mừng ${newUser.name}, tài khoản của bạn đã được khởi tạo.`);
  }

  function handleLogout() {
    try {
      localStorage.removeItem("we-user");
    } catch (_) {}
    setUser(null);
    setAuthSuccess("");
    speak("Bạn đã đăng xuất tài khoản.");
  }

  function togglePref(id) { setPrefs((p) => ({ ...p, [id]: !p[id] })); setSaved(false); }

  function saveAll() {
    const fullEmergency = emergencyName ? `${emergencyName} - ${emergencyPhone}` : emergencyPhone;
    try {
      localStorage.setItem("we-usertype", userType);
      localStorage.setItem("we-emergency", fullEmergency);
      localStorage.setItem("we-personal-notes", personalNotes);
      localStorage.setItem("we-access-prefs", JSON.stringify(prefs));
      localStorage.setItem("we-share-business", shareWithBusiness ? "1" : "0");
      localStorage.setItem("we-share-location", shareLocation ? "1" : "0");
    } catch (_) {}
    setContrastEnabled(!!prefs.highContrast);
    setLargeTextEnabled(!!prefs.largeText);
    setSaved(true);
    speak("Đã lưu và áp dụng toàn bộ hồ sơ tiếp cận cùng cài đặt bảo mật.");
  }

  return (
    <div className="container-page py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6 hc-border">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-ink text-2xl font-black">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={32} />}
          </span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              {user ? user.name : "Tài khoản & Hồ sơ tiếp cận"}
            </h1>
            <p className="hc-muted text-sm sm:text-base text-ink-soft mt-1">
              {user ? `Tài khoản: ${user.account || user.email || user.phone || "Traveler"}` : "Quản lý tài khoản, cài đặt trợ năng và quyền riêng tư"}
            </p>
          </div>
        </div>
        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="btn-ghost hc-border !min-h-[40px] !py-2 text-sm text-red-700 hover:bg-red-50 self-start sm:self-auto"
          >
            Đăng xuất
          </button>
        )}
      </div>

      {/* Account Login / Register Section (FR01) */}
      {!user && (
        <section aria-labelledby="auth-title" className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border sm:p-8">
          <div className="flex items-center justify-between border-b border-line pb-4 hc-border">
            <h2 id="auth-title" className="text-2xl font-bold">Tài khoản du khách (Traveler)</h2>
            <div className="flex rounded-xl bg-surface-alt p-1 hc-surface hc-border" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={authMode === "login"}
                onClick={() => { setAuthMode("login"); setAuthError(""); }}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${authMode === "login" ? "bg-white text-ink shadow-sm hc-surface" : "text-ink-soft hc-muted"}`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authMode === "register"}
                onClick={() => { setAuthMode("register"); setAuthError(""); }}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${authMode === "register" ? "bg-white text-ink shadow-sm hc-surface" : "text-ink-soft hc-muted"}`}
              >
                Đăng ký
              </button>
            </div>
          </div>

          {authError && (
            <div className="mt-4 rounded-xl bg-red-100 p-3.5 text-sm font-semibold text-red-900 hc-border" role="alert">
              ⚠ {authError}
            </div>
          )}

          {authMode === "login" ? (
            <>
            <p className="mt-4 max-w-md rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950" role="note"><strong>Demo:</strong> tài khoản chỉ lưu trên trình duyệt này, chưa có máy chủ xác thực. Không dùng mật khẩu thật.</p>
            <form onSubmit={handleLogin} className="mt-6 space-y-4 max-w-md">
              <div>
                <label htmlFor="login-acc" className="block text-sm font-semibold">Email hoặc số điện thoại</label>
                <input
                  id="login-acc"
                  type="text"
                  required
                  value={loginForm.account}
                  onChange={(e) => setLoginForm({ ...loginForm, account: e.target.value })}
                  placeholder="name@example.com hoặc 0912..."
                  className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none hc-surface hc-border"
                />
              </div>
              <div>
                <label htmlFor="login-pwd" className="block text-sm font-semibold">Mật khẩu</label>
                <input
                  id="login-pwd"
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none hc-surface hc-border"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary text-base flex-1">
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginForm({ account: "minhduc@wayecho.vn", password: "password123" });
                  }}
                  className="btn-ghost hc-border text-xs !px-3"
                  title="Điền tài khoản demo"
                >
                  Dùng mẫu demo
                </button>
              </div>
            </form>
            </>
          ) : (
            <form onSubmit={handleRegister} className="mt-6 space-y-4 max-w-lg">
              <div>
                <label htmlFor="reg-name" className="block text-sm font-semibold">Họ và tên *</label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Minh Đức"
                  className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none hc-surface hc-border"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-semibold">Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="name@example.com"
                    className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none hc-surface hc-border"
                  />
                </div>
                <div>
                  <label htmlFor="reg-phone" className="block text-sm font-semibold">Số điện thoại</label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none hc-surface hc-border"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold">Nhu cầu tiếp cận chính</label>
                <select
                  value={regForm.userType}
                  onChange={(e) => setRegForm({ ...regForm, userType: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none hc-surface hc-border"
                >
                  <option value="lowvision">Low Vision — Người nhìn kém (chữ lớn, tương phản cao)</option>
                  <option value="blind">Blind — Người mù (screen reader, giọng nói, định hướng)</option>
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="reg-pwd" className="block text-sm font-semibold">Mật khẩu *</label>
                  <input
                    id="reg-pwd"
                    type="password"
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="Ít nhất 6 ký tự"
                    className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none hc-surface hc-border"
                  />
                </div>
                <div>
                  <label htmlFor="reg-cpwd" className="block text-sm font-semibold">Nhập lại mật khẩu *</label>
                  <input
                    id="reg-cpwd"
                    type="password"
                    required
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    placeholder="Khớp mật khẩu trên"
                    className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none hc-surface hc-border"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary text-base w-full mt-2">
                Đăng ký tài khoản
              </button>
            </form>
          )}
        </section>
      )}

      {/* 1. User Type Selection (FR03) */}
      <section aria-labelledby="user-type" className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border sm:p-8">
        <h2 id="user-type" className="text-2xl font-bold">1. Loại hồ sơ tiếp cận</h2>
        <p className="hc-muted mt-1 text-sm text-ink-soft">Chọn nhu cầu để WayEcho tự động tối ưu hóa giao diện và thông tin hỗ trợ phù hợp.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2" role="radiogroup" aria-label="Loại người dùng">
          {[
            ["lowvision", "Low Vision — Người nhìn kém", "Ưu tiên chữ lớn, chế độ tương phản cao, phóng to hình ảnh và hỗ trợ giọng đọc."],
            ["blind", "Blind — Người mù", "Ưu tiên tương thích Screen Reader (NVDA, VoiceOver), điều hướng bằng giọng nói, bàn phím và chỉ dẫn chi tiết."],
          ].map(([id, label, desc]) => (
            <label
              key={id}
              className={`cursor-pointer rounded-2xl border p-5 transition hc-border ${
                userType === id ? "border-primary bg-surface-alt hc-surface shadow-sm" : "border-line hover:bg-surface-alt/50"
              }`}
            >
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  name="usertype"
                  checked={userType === id}
                  onChange={() => { setUserType(id); setSaved(false); }}
                  className="mt-1 h-5 w-5 accent-[#f8ae38]"
                />
                <span>
                  <span className="block text-lg font-bold">{label}</span>
                  <span className="hc-muted mt-1.5 block text-sm leading-relaxed text-ink-soft">{desc}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* 2. My Accessibility Preferences (FR03, FR04) */}
      <section aria-labelledby="prefs" className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border sm:p-8">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 id="prefs" className="flex items-center gap-2 text-2xl font-bold">
              <AccessibleIcon size={24} /> 2. Tùy chọn trợ năng chi tiết
            </h2>
            <p className="hc-muted mt-1 text-sm text-ink-soft">
              Các tùy chọn bạn đã lưu sẽ được tự động áp dụng và gợi ý khi đặt dịch vụ.
            </p>
          </div>
          <span className="chip hc-surface hc-border font-semibold">
            {Object.values(prefs).filter(Boolean).length} tùy chọn đang bật
          </span>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {GROUPS.map((group) => (
            <fieldset key={group.title} className="rounded-2xl border border-line p-4 hc-border">
              <legend className="px-2 font-bold text-sm text-ink-soft hc-muted">{group.title}</legend>
              <div className="mt-2 space-y-1">
                {group.items.map(([id, label]) => (
                  <label key={id} className="flex min-h-[46px] cursor-pointer items-center justify-between gap-3 rounded-xl px-2.5 hover:bg-surface-alt">
                    <span className="text-sm font-medium">{label}</span>
                    <input
                      type="checkbox"
                      checked={!!prefs[id]}
                      onChange={() => togglePref(id)}
                      className="h-5 w-5 shrink-0 accent-[#f8ae38]"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      {/* 3. Display, Theme & Voice Speed (FR04) */}
      <section aria-labelledby="display-theme" className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border sm:p-8">
          <h2 id="display-theme" className="flex items-center gap-2 text-2xl font-bold">
            <SpeakerIcon size={24} /> 3. Giọng đọc & Giao diện
          </h2>
          <label htmlFor="rate" className="mt-5 block font-semibold text-sm">
            Tốc độ đọc giọng nói: {speechRate.toFixed(1)}×
          </label>
          <input
            id="rate"
            type="range"
            min="0.6"
            max="1.6"
            step="0.1"
            value={speechRate}
            onChange={(e) => setSpeechRate(Number(e.target.value))}
            className="mt-2 w-full accent-[#f8ae38]"
          />
          <button
            type="button"
            onClick={() => speak("Đây là tốc độ đọc thử nghiệm của trợ lý giọng nói WayEcho.")}
            className="btn-ghost hc-border mt-3 text-sm !min-h-[38px] !py-1.5"
          >
            <SpeakerIcon size={16} /> Nghe thử tốc độ này
          </button>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-xl border border-line p-3 hc-surface hc-border text-left"
            >
              <span className="flex items-center gap-2 font-semibold text-sm">
                {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />} Giao diện {theme === "dark" ? "nền tối (Dark Mode)" : "nền sáng (Light Mode)"}
              </span>
              <span className="text-xs font-bold text-accent-dark">{theme === "dark" ? "BẬT NỀN TỐI" : "BẬT NỀN SÁNG"}</span>
            </button>
            <label className="flex items-center justify-between rounded-xl border border-line p-3 hc-border">
              <span className="font-semibold text-sm">Chế độ tương phản cao</span>
              <input
                type="checkbox"
                checked={contrast}
                onChange={(e) => {
                  setContrastEnabled(e.target.checked);
                  setPrefs((p) => ({ ...p, highContrast: e.target.checked }));
                  setSaved(false);
                }}
                className="h-5 w-5 accent-[#f8ae38]"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-line p-3 hc-border">
              <span className="font-semibold text-sm">Chế độ chữ phóng lớn</span>
              <input
                type="checkbox"
                checked={largeText}
                onChange={(e) => {
                  setLargeTextEnabled(e.target.checked);
                  setPrefs((p) => ({ ...p, largeText: e.target.checked }));
                  setSaved(false);
                }}
                className="h-5 w-5 accent-[#f8ae38]"
              />
            </label>
          </div>
        </div>

        {/* 4. Emergency Contact & Privacy Controls (FR05, FR06) */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card hc-surface hc-border sm:p-8">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <PhoneIcon size={24} /> 4. Liên hệ khẩn cấp & Quyền riêng tư
          </h2>

          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="emg-name" className="block text-sm font-semibold">Tên người thân / liên hệ khẩn cấp</label>
              <input
                id="emg-name"
                value={emergencyName}
                onChange={(e) => { setEmergencyName(e.target.value); setSaved(false); }}
                placeholder="Ví dụ: Bố, Mẹ, Bạn đồng hành"
                className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-base outline-none hc-surface hc-border"
              />
            </div>
            <div>
              <label htmlFor="emg-phone" className="block text-sm font-semibold">Số điện thoại khẩn cấp</label>
              <input
                id="emg-phone"
                value={emergencyPhone}
                onChange={(e) => { setEmergencyPhone(e.target.value); setSaved(false); }}
                placeholder="Ví dụ: 0912 345 678"
                autoComplete="tel"
                className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-base outline-none hc-surface hc-border"
              />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <label className="flex items-start gap-3 rounded-xl border border-line p-3.5 hc-border">
              <input
                type="checkbox"
                checked={shareWithBusiness}
                onChange={(e) => { setShareWithBusiness(e.target.checked); setSaved(false); }}
                className="mt-1 h-5 w-5 accent-[#f8ae38]"
              />
              <span className="text-sm">
                <strong className="block">Cho phép đính kèm Accessibility Request khi đặt dịch vụ</strong>
                <span className="text-xs text-ink-soft hc-muted">Chỉ các cơ sở lưu trú và hướng dẫn viên bạn đặt mới nhận được thông tin hỗ trợ cần thiết.</span>
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-line p-3.5 hc-border">
              <input
                type="checkbox"
                checked={shareLocation}
                onChange={(e) => { setShareLocation(e.target.checked); setSaved(false); }}
                className="mt-1 h-5 w-5 accent-[#f8ae38]"
              />
              <span className="text-sm">
                <strong className="block">Cho phép chia sẻ tọa độ GPS khi kích hoạt SOS</strong>
                <span className="text-xs text-ink-soft hc-muted">Chỉ kích hoạt khi bạn chủ động nhấn nút SOS để cứu trợ khẩn cấp.</span>
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Save Button & Feedback */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={saveAll}
          className="btn-primary text-lg !px-8 shadow-card"
        >
          <CheckIcon size={22} /> Lưu cài đặt hồ sơ
        </button>
        {saved && (
          <span role="status" className="font-bold text-green-700 flex items-center gap-1.5">
            ✓ Đã lưu thành công trên thiết bị của bạn.
          </span>
        )}
      </div>
    </div>
  );
}
