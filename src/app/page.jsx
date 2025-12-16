import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import SidebarCard from "@/components/SidebarCard";

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

      <aside className="mt-0 md:pl-5 md:border-l md:border-gray-200 space-y-2">
        <SidebarCard />
        <hr className="my-2 border-t" />
      </aside>

    </main>
  );
}
