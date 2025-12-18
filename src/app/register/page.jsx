"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import { signupSchema } from "@/lib/schemas";

// Signup form: validate with zod, create user, auto-login, then go home.
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
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

    const result = signupSchema.safeParse(form);
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

    try {
      await axios.post("/api/auth/register", {
        email: form.email,
        password: form.password,
      });
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (signInResult?.error) {
        setServerError("자동 로그인에 실패했습니다. 다시 로그인해 주세요.");
        router.push("/login");
        return;
      }

      router.push("/");
    } catch (err) {
      const msg = err.response?.data?.error || "회원가입에 실패했습니다.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-sm p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
          <p className="text-sm text-gray-600">새 계정을 만들고 바로 시작하세요.</p>
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
              placeholder="최소 6자"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/60 focus:border-black"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="다시 입력"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/60 focus:border-black"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {serverError && <p className="text-xs text-red-500">{serverError}</p>}

          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-black text-white font-semibold text-sm shadow-sm transition hover:bg-gray-900 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <span className="text-gray-500">이미 계정이 있나요?</span>
          <a href="/login" className="font-semibold text-black hover:underline">
            로그인
          </a>
        </div>
      </div>
    </main>
  );
}
