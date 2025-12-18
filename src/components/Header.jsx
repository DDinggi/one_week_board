"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const NAV_ITEMS = [
  { label: "홈", href: "/" },
  { label: "글쓰기", href: "/posts/new" },
];

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 h-16 flex items-center gap-6 px-6 md:px-10 bg-white border-b border-gray-200">
      <Link href="/" className="tit_tistory text-[22px] font-bold">
        tistory
      </Link>

      <nav className="hidden md:flex items-center gap-4 text-sm font-semibold">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`pb-1 border-b-2 transition-colors ${
                active
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-700 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-orange-200"
      >
        <input
          type="search"
          placeholder="검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm w-32 md:w-48"
        />
        <button type="submit" className="text-black" aria-label="검색">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
          </svg>
        </button>
      </form>

      <div className="hidden md:flex items-center gap-4 text-sm text-gray-800 ml-auto">
        {session?.user ? (
          <>
            <span className="text-sm text-gray-700">{session.user.email}</span>
            <Link
              href="/posts/new"
              className="px-5 py-2.5 rounded-full bg-black text-white text-[14px] font-semibold transition hover:bg-orange-500"
            >
              글쓰기
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 rounded-full border border-gray-300 text-sm transition hover:bg-gray-200"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-7 py-3 rounded-full bg-black text-white text-[14px] font-semibold"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
