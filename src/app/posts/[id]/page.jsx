import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PostActions from "@/components/board/PostActions";

// Post detail page: SSR fetch of a single post with author email and thumbnail fallback.
async function getPost(id) {
  const numericId = Number.parseInt(id, 10);
  if (!Number.isFinite(numericId)) return null;
  return prisma.post.findUnique({
    where: { id: numericId },
    include: { author: { select: { email: true, id: true } } },
  });
}

const getThumb = (src) => {
  if (!src) return "/kitty.webp";
  const s = String(src).trim();
  if (!s || s.toLowerCase() === "null") return "/kitty.webp";
  if (s.startsWith("/") || s.startsWith("http://") || s.startsWith("https://")) return s;
  return "/kitty.webp";
};

export default async function PostDetail({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="text-sm text-gray-500">
            {post.author?.email ? `작성자 ${post.author.email}` : "작성자 정보 없음"} ·{" "}
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
        <PostActions postId={post.id} authorId={post.author?.id} />
      </div>

      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border">
        <Image
          src={getThumb(post.thumbnail)}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="text-base whitespace-pre-wrap leading-7">{post.content}</div>
    </main>
  );
}
