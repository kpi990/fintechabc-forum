import Link from "next/link";
import LogoIcon from "@/components/LogoIcon";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/markets", label: "Markets" },
  { href: "/news", label: "News" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

export default function MobileTopBar() {
  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur md:hidden">
      <div className="flex items-center justify-between px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2">
          <LogoIcon size={28} />
          <span className="text-[15px] font-semibold tracking-tight">
            <span className="text-slate-900">fintech</span>
            <span className="text-violet-600">abc</span>
          </span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/login" className="text-slate-500 hover:text-slate-900">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-violet-600 px-3 py-1.5 font-medium text-white shadow-sm hover:bg-violet-500"
          >
            Sign up
          </Link>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 text-sm text-slate-600">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap transition hover:text-violet-600">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
