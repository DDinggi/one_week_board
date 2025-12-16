"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("아이디(이메일)을 입력하세요"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
});

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0];
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (!res || res.error) {
      setServerError(res?.error || "로그인에 실패했습니다");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 shadow-sm bg-white p-6 space-y-6">
        <p className="text-sm text-gray-800">로그인하고 더 많은 기능을 사용해 보세요.</p>

        <button
          type="button"
          className="w-full h-14 rounded-xl bg-[#FEE500] text-black font-semibold text-[15px] flex items-center justify-center gap-2 shadow-sm hover:brightness-95 transition"
          onClick={() => router.push("/login")}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#3B1E1E"
            aria-hidden="true"
          >
            <path d="M12 3C6.48 3 2 6.52 2 10.5c0 2.38 1.56 4.5 3.96 5.76-.14.86-.5 2.01-1.37 3.23-.19.26-.03.63.28.63.6 0 2.43-.83 3.91-1.78.93.25 1.92.39 2.96.39 5.52 0 10-3.52 10-7.5S17.52 3 12 3Z" />
          </svg>
          카카오계정으로 시작하기
        </button>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="아이디(이메일)"
            className="w-full border border-gray-400 p-3 rounded outline-none"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            className="w-full border border-gray-400 p-3 rounded outline-none"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}

          {serverError && <p className="text-xs text-red-500">{serverError}</p>}

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#FEE500] text-black font-semibold text-[15px] flex items-center justify-center shadow-sm hover:brightness-95 transition"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인하기"}
          </button>
        </form>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <Link href="/register" className="underline">
            회원가입
          </Link>
        </div>
      </div>
    </main>
  );
}
