"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
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
      setServerError(res?.error || "로그인에 실패했습니다.");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <main className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-sm p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
          <p className="text-sm text-gray-600">이메일과 비밀번호로 계속 진행하세요.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">이메일</label>
            <input
              name="email"
              placeholder="email@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/60 focus:border-black"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/60 focus:border-black"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          {serverError && <p className="text-xs text-red-500">{serverError}</p>}

          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-black text-white font-semibold text-sm shadow-sm transition hover:bg-gray-900 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <span className="text-gray-500">계정이 없나요?</span>
          <Link href="/register" className="font-semibold text-black hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </main>
  );
}
