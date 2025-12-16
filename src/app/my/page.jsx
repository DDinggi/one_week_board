import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function MyPostsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-sm text-gray-500">로그인 후 이용해 주세요.</p>
        <Link href="/login" className="underline text-blue-600 text-sm">
          로그인 하러가기
        </Link>
      </main>
    );
  }

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">내 글 목록</h1>
      {posts.length === 0 ? (
        <p className="text-sm text-gray-500">작성한 글이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block border-b border-gray-200 pb-3 hover:bg-gray-50 rounded"
            >
              <p className="text-lg font-semibold">{post.title}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
