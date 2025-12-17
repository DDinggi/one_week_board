"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { signupSchema } from "@/lib/schemas";

// Simple signup form: validates with zod on the client, then posts to /api/auth/register.
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

    // Client-side validation first
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
      router.push("/login");
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 shadow-sm bg-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">Sign Up</h1>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            className="w-full border border-gray-400 p-3 rounded outline-none"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            className="w-full border border-gray-400 p-3 rounded outline-none"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password (optional)"
            className="w-full border border-gray-400 p-3 rounded outline-none"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword}</p>
          )}

          {serverError && <p className="text-xs text-red-500">{serverError}</p>}

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#FEE500] text-black font-semibold text-[15px] flex items-center justify-center shadow-sm hover:brightness-95 transition"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </main>
  );
}
