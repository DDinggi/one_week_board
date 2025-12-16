"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const tabClass =
  "relative flex items-center justify-center py-4 text-xs font-semibold after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-10 after:bg-current after:scale-x-0 after:bg-gray-200 after:transition-transform after:origin-center hover:after:scale-x-100";

export default function SidebarCard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="border border-gray-200 p-4 shadow-sm text-sm text-gray-500 rounded-none">
        세션 확인 중...
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="p-5 space-y-5 rounded-none">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100" />
          <div>
            <p className="text-base font-semibold leading-tight">{session.user.email}</p>
            <p className="text-xs text-gray-500">구독자 0명</p>
          </div>
          <span className="ml-auto text-lg text-gray-500">⌄</span>
        </div>

        <div className="grid grid-cols-3 divide-x divide-gray-300 rounded-[18px] border border-black overflow-hidden">
          <Link href="/posts/new" className={tabClass}>
            글쓰기
          </Link>
          <Link href="/my" className={tabClass}>
            내 블로그
          </Link>
          <Link href="/settings" className={tabClass}>
            관리
          </Link>
        </div>

        <div className="space-y-3 text-sm text-gray-800">
          <div className="flex justify-between items-center pt-2">
            <span>조회수</span>
            <span className="font-bold text-sm">0회 ▸</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-2">
            <span>방문자</span>
            <span className="font-bold text-sm">0명 ▸</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-2">
            <span>수익</span>
            <span className="font-bold text-sm">₩ 내 수익 예측해보기 ▸</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-4 space-y-3 shadow-sm">
      <p className="text-sm text-gray-800">티스토리에 로그인하고 더 많은 기능을 사용해 보세요.</p>
      <Link
        href="/login"
        className="w-full h-14 rounded-xl bg-[#FEE500] font-semibold text-[15px] flex items-center justify-center gap-2 shadow-sm hover:brightness-95 transition"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#3B1E1E" aria-hidden="true">
          <path d="M12 3C6.48 3 2 6.52 2 10.5c0 2.38 1.56 4.5 3.96 5.76-.14.86-.5 2.01-1.37 3.23-.19.26-.03.63.28.63.6 0 2.43-.83 3.91-1.78.93.25 1.92.39 2.96.39 5.52 0 10-3.52 10-7.5S17.52 3 12 3Z" />
        </svg>
        카카오계정으로 시작하기
      </Link>
    </div>
  );
}
