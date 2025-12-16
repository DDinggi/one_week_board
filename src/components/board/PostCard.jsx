import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PostCard({ post }) {
  const created = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : "알 수 없음";

  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="h-40 w-full bg-gray-200 rounded-t-lg flex items-center justify-center text-gray-400">
          No Image
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
          {post.author?.email && <p className="text-sm text-gray-500">{post.author.email}</p>}
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
        </CardContent>
        <CardFooter className="text-xs text-gray-400">
          {created}
        </CardFooter>
      </Card>
    </Link>
  );
}
