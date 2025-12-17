"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

// Client-side actions for edit/delete, rendered on post detail.
export default function PostActions({ postId, authorId }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwner = session?.user?.id === authorId;

  const handleDelete = async () => {
    if (!isOwner) return;
    if (!confirm("이 글을 삭제하시겠습니까?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "삭제에 실패했습니다.");
        setLoading(false);
        return;
      }
      router.push("/");
    } catch (err) {
      setError("삭제에 실패했습니다.");
      setLoading(false);
    }
  };

  if (!isOwner) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push(`/posts/edit/${postId}`)}
          className="px-3 py-1 rounded border text-sm hover:bg-gray-100"
          disabled={loading}
        >
          수정
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-3 py-1 rounded border text-sm text-red-600 hover:bg-red-50"
          disabled={loading}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
