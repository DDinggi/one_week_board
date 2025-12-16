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

async function getPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { email: true } } },
  });
}

export default async function Home() {
  const posts = await getPosts();
  const hero = posts[0];
  const rest = posts.slice(1);

  return (
    <main className="max-w-6xl mx-auto px-6 md:px-10 py-4 grid grid-cols-1 md:grid-cols-[5fr_3fr] gap-10">
      <section className="flex flex-col space-y-8">
        {hero ? (
          <div className="w-full relative overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={getThumb(hero.thumbnail)}
                alt={hero.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end text-white">
              <h2 className="text-2xl md:text-3xl font-bold drop-shadow">{hero.title}</h2>
              {hero.author?.email && (
                <p className="text-sm mt-2 drop-shadow">{hero.author.email}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full relative overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-gray-100 aspect-[16/9] flex items-center justify-center text-gray-500">
            아직 게시글이 없습니다.
          </div>
        )}

        <div className="space-y-4">
          {rest.length === 0 && (
            <div className="text-sm text-gray-500">
              아직 게시글이 없습니다. 첫 글을 작성해 보세요.
            </div>
          )}
          {rest.map((post, idx) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="flex items-center gap-4 border-b border-gray-200 pb-4 hover:bg-gray-50 transition"
            >
              <div className="text-2xl font-bold text-orange-500 w-8 text-center">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">{post.author?.email || "익명"}</p>
                <p className="text-lg font-semibold leading-snug line-clamp-2">{post.title}</p>
              </div>
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={getThumb(post.thumbnail)}
                  alt={post.title}
                  width={80}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <aside className="md:pl-6 md:border-l md:border-gray-200 space-y-2">
        <div className="p-4 space-y-3">
          <p className="text-[12px] text-gray-800">
            티스토리에 로그인하고 더 많은 기능을 사용해 보세요.
          </p>
          <Link
            href="/login"
            className="w-full h-14 rounded-xl bg-[#FEE500] text-black font-semibold text-[15px] flex items-center justify-center gap-2 shadow-sm hover:brightness-95 transition"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="#3B1E1E"
              aria-hidden="true"
            >
              <path d="M12 3C6.48 3 2 6.52 2 10.5c0 2.38 1.56 4.5 3.96 5.76-.14.86-.5 2.01-1.37 3.23-.19.26-.03.63.28.63.6 0 2.43-.83 3.91-1.78.93.25 1.92.39 2.96.39 5.52 0 10-3.52 10-7.5S17.52 3 12 3Z" />
            </svg>
            카카오계정으로 시작하기
          </Link>
        </div>
        <hr className="my-2 border-t border-gray-200" />
      </aside>

    </main>
  );
}
