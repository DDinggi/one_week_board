"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const TABS = ["홈", "피드", "스킨", "포럼"];

export default function Header() {
  const { data: session } = useSession();
  const [active, setActive] = useState("홈");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 flex items-center gap-6 px-6 md:px-10 bg-white border-b border-gray-200">
      <span className="tit_tistory text-[22px] font-bold">tistory</span>

      <ul className="flex items-center gap-5 text-sm font-semibold">
        {TABS.map((tab) => (
          <li key={tab}>
            <button
              onClick={() => setActive(tab)}
              className={`pb-1 border-b-2 transition-colors ${
                active === tab
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-700 hover:text-black"
              }`}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      <div className="relative">
        <div
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-orange-200"
          onFocus={() => setOpen(true)}
          onClick={() => setOpen((prev) => !prev)}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
          tabIndex={0}
        >
          <input
            type="search"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-32 md:w-48"
          />
          <span className="text-black" aria-hidden="true">
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
          </span>
        </div>
        {open && (
          <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl border bg-white shadow-xl p-4">
            최근 검색어 박스 예시
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-4 text-sm text-gray-800 ml-auto">
        <div className="flex items-center gap-2">
          <span className="text-black">🔔</span>
          <span className="text-[14px]">새로운 소식을 확인하세요</span>
        </div>
        {session?.user ? (
          <>
            <span className="text-sm text-gray-700">{session.user.email}</span>
            <Link
              href="/posts/new"
              className="px-5 py-2.5 rounded-full bg-black text-white text-[14px] font-semibold"
            >
              글쓰기
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 rounded-full border border-gray-300 text-sm"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-7 py-3 rounded-full bg-black text-white text-[14px] font-semibold"
          >
            시작하기
          </Link>
        )}
      </div>
    </header>
  );
}
