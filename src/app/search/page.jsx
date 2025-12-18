import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

const getThumb = (src) => {
  if (!src) return "/kitty.webp";
  const s = String(src).trim();
  if (!s || s.toLowerCase() === "null") return "/kitty.webp";
  if (s.startsWith("/") || s.startsWith("http://") || s.startsWith("https://")) return s;
  return "/kitty.webp";
};

async function searchPosts(term) {
  if (!term) return [];
  return prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: term, mode: "insensitive" } },
        { content: { contains: term, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { email: true } } },
  });
}

export default async function SearchPage({ searchParams }) {
  const raw = searchParams?.q || searchParams?.query || "";
  const term = Array.isArray(raw) ? raw[0] : raw;
  const query = (term || "").trim();
  const results = query ? await searchPosts(query) : [];

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-10 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Search</p>
          <h1 className="text-3xl font-bold text-gray-900">
            {query ? `"${query}" 검색 결과` : "검색"}
          </h1>
        </div>
        <span className="text-sm text-gray-500">
          {query ? `${results.length}개 결과` : "검색어를 입력하세요"}
        </span>
      </div>

      {!query && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600">
          상단 검색창에서 제목 또는 본문 키워드를 입력하세요.
        </div>
      )}

      {query && results.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600">
          결과가 없습니다.
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((post, idx) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="flex items-center gap-4 border border-gray-200 rounded-xl bg-white p-4 hover:border-gray-300 hover:shadow-sm transition"
            >
              <div className="text-xl font-bold text-orange-500 w-8 text-center">{idx + 1}</div>
              <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={getThumb(post.thumbnail)}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-[13px] text-gray-500 line-clamp-1">
                  {post.author?.email || "작성자 미상"}
                </p>
                <p className="text-lg font-semibold leading-snug line-clamp-2">{post.title}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
              </div>
              <div className="text-xs text-gray-500 shrink-0">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
