"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useA11y } from "./A11yProvider";
import Logo from "./Logo";
import { ContrastIcon, TextSizeIcon, MenuIcon, UserIcon, SunIcon, MoonIcon, PhoneIcon } from "./Icons";

const NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/explore", label: "Khám phá" },
  { href: "/services", label: "Dịch vụ" },
  { href: "/cam-nang", label: "Cẩm nang" },
  { href: "/help", label: "Hỗ trợ" },
  { href: "/business", label: "Đối tác" },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme, contrast, largeText, toggleContrast, toggleLargeText } = useA11y();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("we-user") || "null");
      if (u?.name) setUserName(u.name);
    } catch (_) {}
  }, []);

  if (pathname.startsWith("/guide") || pathname.startsWith("/admin") || pathname.startsWith("/business")) return null;

  const renderNavLinks = (mobile = false) => (
    <ul className={mobile ? "grid gap-1" : "flex items-center gap-1"}>
      {NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-[44px] ${mobile ? "w-full" : ""} items-center rounded-xl px-3 text-[14px] font-semibold transition-colors ${
                active ? "bg-primary text-ink shadow-sm" : "text-ink hover:bg-surface-alt hover:underline"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur hc-surface hc-border">
      <div className="container-page flex min-h-[72px] items-center justify-between gap-3 py-2">
        <Link href="/" aria-label="WayEcho — về trang chủ" className="flex items-center shrink-0">
          <Logo height={31} />
        </Link>
        <nav aria-label="Điều hướng chính" className="hidden lg:block">{renderNavLinks()}</nav>
        <div className="flex items-center gap-2" role="group" aria-label="Tùy chọn truy cập và tài khoản">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Chuyển sang giao diện ${theme === "dark" ? "sáng" : "tối"}`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white hover:bg-surface-alt hc-surface hc-border"
          >
            {theme === "dark" ? <SunIcon size={19} /> : <MoonIcon size={19} />}
          </button>
          <button
            type="button"
            onClick={toggleContrast}
            aria-pressed={contrast}
            className="hidden min-h-[44px] items-center gap-2 rounded-full border border-line bg-white px-3.5 text-sm font-semibold hc-surface hc-border xl:flex"
          >
            <ContrastIcon size={17} /> Tương phản
          </button>
          <button
            type="button"
            onClick={toggleLargeText}
            aria-pressed={largeText}
            className="hidden min-h-[44px] items-center gap-2 rounded-full border border-line bg-white px-3.5 text-sm font-semibold hc-surface hc-border xl:flex"
          >
            <TextSizeIcon size={17} /> Chữ lớn
          </button>
          <Link
            href="/sos"
            className="hidden min-h-[44px] items-center gap-1.5 rounded-full bg-red-600 px-3.5 text-sm font-bold text-white hover:bg-red-700 sm:inline-flex"
            aria-label="Gọi SOS khẩn cấp"
          >
            <PhoneIcon size={16} /> SOS
          </Link>
          <Link
            href="/profile"
            className="min-h-[44px] items-center gap-2 rounded-full border-2 border-[#ef6d28] px-3.5 text-sm font-semibold text-[#c94d1b] hover:bg-[#fff2e9] inline-flex"
          >
            <UserIcon size={17} /> {userName ? userName.split(" ")[0] : "Tài khoản"}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white hc-surface hc-border lg:hidden"
            aria-label={open ? "Đóng menu" : "Mở menu"}
          >
            <MenuIcon size={22} />
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-white px-4 py-4 hc-surface hc-border lg:hidden">
          <div className="container-page !px-0">
            <nav aria-label="Điều hướng chính trên điện thoại">{renderNavLinks(true)}</nav>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <button type="button" onClick={toggleTheme} className="btn-ghost hc-border !px-2 !py-2">
                {theme === "dark" ? <SunIcon size={17} /> : <MoonIcon size={17} />} Theme
              </button>
              <button type="button" onClick={toggleContrast} aria-pressed={contrast} className="btn-ghost hc-border !px-2 !py-2">
                <ContrastIcon size={17} /> Tương phản
              </button>
              <button type="button" onClick={toggleLargeText} aria-pressed={largeText} className="btn-ghost hc-border !px-2 !py-2">
                <TextSizeIcon size={17} /> Chữ lớn
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/sos" onClick={() => setOpen(false)} className="btn-dark !bg-red-700 text-white w-full text-center">
                <PhoneIcon size={18} /> SOS Khẩn cấp
              </Link>
              <Link href="/profile" onClick={() => setOpen(false)} className="btn-primary w-full text-center">
                <UserIcon size={18} /> {userName ? "Hồ sơ của tôi" : "Đăng nhập"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
