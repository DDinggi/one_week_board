"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const tabClass =
  "relative flex items-center justify-center py-4 text-xs font-semibold after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-10 after:bg-current after:scale-x-0 after:bg-gray-200 after:transition-transform after:origin-center hover:after:scale-x-100";

export default function SidebarCard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="border border-gray-200 p-4 shadow-sm text-sm text-gray-500 rounded-2xl">
        세션 확인 중...
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="p-5 space-y-5 rounded-2xl border border-gray-200 shadow-sm bg-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100" />
          <div>
            <p className="text-base font-semibold leading-tight">{session.user.email}</p>
            <p className="text-xs text-gray-500">즐거운 블로깅 되세요</p>
          </div>
          <span className="ml-auto text-lg text-gray-400">★</span>
        </div>

        <div className="grid grid-cols-3 divide-x divide-gray-200 rounded-[18px] border border-gray-300 overflow-hidden">
          <Link href="/posts/new" className={tabClass}>
            글쓰기
          </Link>
          <Link href="/my" className={tabClass}>
            마이
          </Link>
          <Link href="/settings" className={tabClass}>
            설정
          </Link>
        </div>

        <div className="space-y-3 text-sm text-gray-800">
          <div className="flex justify-between items-center pt-2">
            <span>최근 방문</span>
            <span className="font-bold text-sm">-</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-2">
            <span>댓글</span>
            <span className="font-bold text-sm">-</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-2">
            <span>수익</span>
            <span className="font-bold text-sm">-</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-4 space-y-3 shadow-sm bg-white">
      <p className="text-sm text-gray-800">로그인하고 더 많은 기능을 사용해 보세요.</p>
      <Link
        href="/login"
        className="w-full h-12 rounded-xl bg-black text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-sm hover:bg-gray-900 transition"
      >
        로그인
      </Link>
    </div>
  );
}
