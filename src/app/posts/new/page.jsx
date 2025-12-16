"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    authorId: "",
    thumbnail: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        authorId: Number(form.authorId),
        thumbnail: form.thumbnail || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "게시글 생성에 실패했습니다");
      setLoading(false);
      return;
    }

    const post = await res.json();
    router.push(`/posts/${post.id}`);
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">새 게시글 작성</h1>
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
          <label className="text-sm font-semibold">작성자 ID</label>
          <input
            name="authorId"
            type="number"
            className="w-full border p-3 rounded outline-none"
            value={form.authorId}
            onChange={handleChange}
            required
            min={1}
          />
          <p className="text-xs text-gray-500">Prisma Studio에서 만든 User의 id를 입력하세요.</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold">썸네일 URL (옵션)</label>
          <input
            name="thumbnail"
            className="w-full border p-3 rounded outline-none"
            value={form.thumbnail}
            onChange={handleChange}
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
