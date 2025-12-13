"use client";
import { useState } from "react";

const TABS = ["홈", "피드", "스킨", "포럼"];

export default function Header() {
  const [active, setActive] = useState("홈");

  return (
    <header className="sticky top-0 z-50 h-16 flex items-center gap-6 px-6 md:px-10 bg-white border-b">

        
      <span className="tit_tistory text-[22px] font-bold">tistory</span>

        
        <ul className="flex items-center gap-5 text-sm font-semibold">
          {TABS.map(tab => (
            <li className="" key={tab}>
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
      

         
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-orange-200">
        <input
          type="search"
          placeholder="검색어 입력"
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

          
      <div className = "hidden md:flex items-center gap-4 text-sm text-gray-800 ml-auto">
        <div className = "flex items-center gap-2">
            <span className = "text-black ">🔊</span>
            <span className = "text-[14px]">댓글 자동화·유사한 문구 댓글 규제 정책 도입 안내</span>
        </div>
        <button className = "px-7 py-3 rounded-full bg-black text-white text-[14px] font-semibold">
           시작하기 
        </button>
      </div>
    </header>
  );
}
