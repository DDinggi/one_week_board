"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const registerSchema = z
  .object({
    email: z.string().email("아이디(이메일)을 입력하세요"),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
    passwordConfirm: z.string().min(6, "비밀번호 확인을 6자 이상 입력하세요"),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다",
  });

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", passwordConfirm: "" });
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

    const result = registerSchema.safeParse(form);
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

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setServerError(data.error || "회원가입에 실패했습니다");
      setLoading(false);
      return;
    }

    router.push("/login");
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 shadow-sm bg-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">회원가입</h1>

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

          <input
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            className="w-full border border-gray-400 p-3 rounded outline-none"
            value={form.passwordConfirm}
            onChange={handleChange}
          />
          {errors.passwordConfirm && (
            <p className="text-xs text-red-500">{errors.passwordConfirm}</p>
          )}

          {serverError && <p className="text-xs text-red-500">{serverError}</p>}

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#FEE500] text-black font-semibold text-[15px] flex items-center justify-center shadow-sm hover:brightness-95 transition"
            disabled={loading}
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>
      </div>
    </main>
  );
}
