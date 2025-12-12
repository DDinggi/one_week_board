import PostCard from "@/components/board/PostCard";

// 임시 더미 데이터
const DUMMY_POSTS = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: `Tistory 클론 코딩 - ${i + 1}번째 게시글입니다.`,
  content: "Next.js와 Shadcn UI를 사용하여 멋진 블로그를 만들어 봅시다. 이 내용은 미리보기 내용입니다.",
  author: "JungleUser",
  date: "2024.05.21",
  comments: i * 2,
}));

export default function MainPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Today's Tistory</h1>
      {/* 그리드 레이아웃: 모바일 1열, 태블릿 2열 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DUMMY_POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}