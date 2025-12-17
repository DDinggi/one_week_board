"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

// Auth-gated post creation form (client-side); uploads image (optional) then creates a post.
export default function NewPostPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form, setForm] = useState({
    title: "",
    content: "",
    thumbnail: "",
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

    let thumbnailUrl = form.thumbnail || "";

    // Optional image upload to /api/upload before creating the post
    if (form.file) {
      const data = new FormData();
      data.append("file", form.file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
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
      setError(data.error || "게시글 작성에 실패했습니다.");
      setLoading(false);
      return;
    }

    const post = await res.json();
    router.push(`/posts/${post.id}`);
  };

  if (status === "loading") {
    return (
      <main className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-sm text-gray-500">세션 확인 중...</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">글 작성</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-sm font-semibold">제목</label>
          <input
            name="title"
            className="w-full border p-3 rounded outline-none"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold">내용</label>
          <textarea
            name="content"
            className="w-full border p-3 rounded outline-none h-40"
            value={form.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold">썸네일 URL (선택)</label>
          <input
            name="thumbnail"
            className="w-full border p-3 rounded outline-none"
            value={form.thumbnail}
            onChange={handleChange}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-900 transition"
          disabled={loading}
        >
          {loading ? "작성 중..." : "게시글 등록"}
        </button>
      </form>
    </main>
  );
}
