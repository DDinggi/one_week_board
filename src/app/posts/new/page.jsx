"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

// Post creation form with optional thumbnail upload, styled like a clean editor.
export default function NewPostPage() {
  const router = useRouter();
  const { status } = useSession();
  const [form, setForm] = useState({
    title: "",
    content: "",
    file: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let thumbnailUrl = "";

    if (form.file) {
      const data = new FormData();
      data.append("file", form.file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: data });
      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json().catch(() => ({}));
        setError(uploadErr.error || "이미지 업로드에 실패했습니다.");
        setLoading(false);
        return;
      }
      const uploadJson = await uploadRes.json();
      thumbnailUrl = uploadJson.url || thumbnailUrl;
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        thumbnail: thumbnailUrl || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "게시글 생성에 실패했습니다.");
      setLoading(false);
      return;
    }

    const post = await res.json();
    router.push(`/posts/${post.id}`);
  };

  if (status === "loading") {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-sm text-gray-500">세션 확인 중...</p>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">New Post</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">새 글 작성</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            자동 저장 없음
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">제목</label>
              <input
                name="title"
                placeholder="제목을 입력하세요"
                className="w-full text-2xl md:text-3xl font-semibold text-gray-900 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/60 focus:border-black"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">본문</label>
              <textarea
                name="content"
                placeholder="내용을 입력하세요"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 min-h-[260px] text-base leading-7 outline-none focus:ring-2 focus:ring-black/60 focus:border-black resize-none"
                value={form.content}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">이미지 업로드 (선택)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm border border-dashed border-gray-300 rounded-xl px-4 py-3 bg-gray-50 hover:border-gray-400 cursor-pointer"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "작성 중..." : "게시하기"}
              </button>
              <button
                type="button"
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => router.back()}
                disabled={loading}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
