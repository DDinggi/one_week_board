"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const loginSchema = z
  .object({
    username: z.string().min(1, "아이디를 입력하세요"),
    password: z.string().min(6, "비밀번호를 6자 이상 입력하세요"),
    passwordConfirm: z.string().min(6, "비밀번호 확인을 6자 이상 입력하세요"),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다",
  });

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    // 임시 로그인 처리: 로컬스토리지에 사용자명 저장 후 메인으로 이동
    localStorage.setItem("loggedInUser", form.username);
    router.push("/");
  };

  return (
    <main className="max-w-md mx-auto px-6 py-10 space-y-5">
      <h1 className="text-2xl font-bold">로그인</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <input
            name="username"
            placeholder="아이디"
            className="w-full border p-3 rounded outline-none"
            value={form.username}
            onChange={handleChange}
          />
          {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
        </div>

        <div className="space-y-1">
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            className="w-full border p-3 rounded outline-none"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-1">
          <input
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            className="w-full border p-3 rounded outline-none"
            value={form.passwordConfirm}
            onChange={handleChange}
          />
          {errors.passwordConfirm && <p className="text-sm text-red-500">{errors.passwordConfirm}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-900 transition"
        >
          로그인
        </button>
      </form>
    </main>
  );
}
