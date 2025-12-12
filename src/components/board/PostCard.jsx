import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PostCard({ post }) {
  return (
    <Link href={`/board/${post.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* 썸네일 영역 (임시 배경색) */}
        <div className="h-40 w-full bg-gray-200 rounded-t-lg flex items-center justify-center text-gray-400">
          No Image
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
          <p className="text-sm text-gray-500">{post.author}</p>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
        </CardContent>
        <CardFooter className="text-xs text-gray-400">
          {post.date} · 댓글 {post.comments}
        </CardFooter>
      </Card>
    </Link>
  );
}