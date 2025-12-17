"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { status } = useSession();

  const [form, setForm] = useState({ title: "", content: "", thumbnail: "", file: null });
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError("Invalid post id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setLoaded(false);

      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Failed to load post.");
          return;
        }
        const data = await res.json();
        setForm({
          title: data.title || "",
          content: data.content || "",
          thumbnail: data.thumbnail || "",
          file: null,
        });
        setLoaded(true);
      } catch {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchPost();
    }
  }, [postId, status]);

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
    if (!postId) return;

    setError("");
    setSaving(true);

    let thumbnailUrl = form.thumbnail || "";
    if (form.file) {
      const data = new FormData();
      data.append("file", form.file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: data });
      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json().catch(() => ({}));
        setError(uploadErr.error || "Image upload failed.");
        setSaving(false);
        return;
      }
      const uploadJson = await uploadRes.json();
      thumbnailUrl = uploadJson.url || thumbnailUrl;
    }

    const res = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        thumbnail: thumbnailUrl || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to update post.");
      setSaving(false);
      return;
    }

    router.push(`/posts/${postId}`);
  };

  if (status === "loading" || loading) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-sm text-gray-500">Loading post...</p>
      </main>
    );
  }

  if (!loaded) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-10 space-y-3">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <p className="text-sm text-red-500">{error || "Post not found."}</p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded border text-sm hover:bg-gray-100"
        >
          Go home
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-sm font-semibold">Title</label>
          <input
            name="title"
            className="w-full border p-3 rounded outline-none"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold">Content</label>
          <textarea
            name="content"
            className="w-full border p-3 rounded outline-none h-40"
            value={form.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold">Thumbnail URL (optional)</label>
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

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 bg-black text-white py-3 rounded font-semibold hover:bg-gray-900 transition disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            className="px-4 py-3 rounded border text-sm hover:bg-gray-100"
            onClick={() => router.push(`/posts/${postId}`)}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
