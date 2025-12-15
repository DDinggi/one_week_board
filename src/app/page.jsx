import Image from "next/image";
import kakaoLogo from "@/assets/kakao-icon.svg" 
import PostCard from "@/components/board/PostCard";
import Link from "next/link";

const posts_one = [
  {
    id:1,
    title: "Tistory 클론 코딩 - 1번째 게시글입니다.",
    category: "응애 치타",
    thumb: "/img1.jpg",
  },
   {
    id:2,
    title: "Tistory 클론 코딩 - 2번째 게시글입니다.",
    category: "응애 여우",
    thumb: "/img2.jfif",
  },
   {
    id:3,
    title: "Tistory 클론 코딩 - 3번째 게시글입니다.",
    category: "응애 매",
    thumb: "/img3.jfif",
  },
   {
    id:4,
    title: "Tistory 클론 코딩 - 4번째 게시글입니다.",
    category: "응애 펭귄",
    thumb: "/img4.jfif",
  },
   {
    id:5,
    title: "Tistory 클론 코딩 - 5번째 게시글입니다.",
    category: "응애 호랑이",
    thumb: "/img5.jpg",
  },
];

const creators = [
  {
    id: "c1",
    name: "응애응애",
    category: "응애 크리에이터",
    subscribers: "1557명",
    thumbnail: "",
    posts: [
      {
        id: "p1",
        title: "응애응애응애",
        date: "2025.12.13",
        likes: 7,
        coments: 3,
        thumb: "/img6.jpg",
      },
      {
        id: "p2",
        title: "응애응애응애",
        date: "2025.12.14",
        likes: 7,
        coments: 3,
        thumb: "/img7.jfif",
      },
    ],
  },
];

const creators_two = [
  {
    id: "c1",
    name: "우앙우앙",
    category: "응애 크리에이터",
    subscribers: "888484명",
    thumbnail: "",
    posts: [
      {
        id: "p1",
        title: "응애응애응애",
        date: "2025.12.13",
        likes: 7,
        coments: 3,
        thumb: "/img6.jpg",
      },
      {
        id: "p2",
        title: "응애응애응애",
        date: "2025.12.14",
        likes: 7,
        coments: 3,
        thumb: "/img7.jfif",
      },
    ],
  },
];

const posts_two = [
  /*카드 데이터 배열2 */
]

function ListItem({ rank, item }) {
  return (
    <div className="grid grid-cols-[52px_1fr_auto] items-center gap-4 py-4 border-b border-gray-400">
      <div className="text-3xl font-extrabold text-gray-300 leading-none">{rank}/</div>

      <div className="space-y-1">
        <p className="text-xs text-gray-500 font-semibold">{item.category}</p>
        <p className="text-lg font-semibold leading-tight line-clamp-2">{item.title}</p>
      </div>

      <div className="w-20 h-16 rounded-2xl overflow-hidden bg-gray-100">
        {item.thumb && (
          <img src={item.thumb} alt={item.title} className="w-full h-full object-cover" />
        )}
      </div>
    </div>
  );
}

function CreatorCard({ creator }) {
  return (
    <div className="bg-white py-3">
      {/* 상단: 이름 + 구독 */}
      <div className="w-full rounded-lg border border-gray-300 bg-gray-100 p-2 flex items-center">
        <div className="flex-1">
          <p className="text-[17px] font-semibold">{creator.name}</p>
          <button className="text-xs text-gray-500">
            S {creator.category} · {creator.subscribers} 구독
          </button>
        </div>
        <button className="px-3 py-1.5 rounded-full border border-black-400 text-sm">
          + 구독
        </button>
      </div>

      {/* 최근 글 리스트 */}
      <div className="mt-3 space-y-3">
        {creator.posts.map((p) => (
          <div key={p.id} className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight line-clamp-2">{p.title}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                <span>♥ {p.likes}</span>
                <span>💬 {p.comments}</span>
                <span>{p.date}</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <img src={p.thumb} alt={p.title} className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6 md:px-10 py-8 grid grid-cols-1 md:grid-cols-[5fr_3fr] gap-20">
      {/* 왼쪽: 포스트 카드 리스트 */}
      <section className="flex flex-col space-y-6">
        <div className="w-full relative aspect-[16/9] overflow-hidden rounded-xl">
          <Image src="/kitty.webp" alt="intro image" fill className="object-cover" />
        </div>



        <div className="w-full">
          {posts_one.map((item, idx) => (
          <ListItem key={item.id} rank={idx+1} item = {item} />
        ))}
        </div>



        <div>
          {posts_two.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </section>

      {/* 오른쪽: 로그인/배너 영역 */}
      <aside className="mt-6 md:pl-8 md:border-l md:border-gray-200">
        <div>
          <p className="text-[12px] text-gray-800 mb-4">
            티스토리에 로그인하시고 더 많은 기능을 이용해보세요!
          </p>
          <button className="w-full h-12 md:h-14 rounded-xl bg-yellow-300 text-black font-semibold
          text-[14px] flex items-center justify-center gap-2 shadow-sm hover:bg-yellow-500 transition">
            <Link href="/login" className="flex items-center gap-2">
            <Image src={kakaoLogo} alt="카카오 아이콘" width={20} height={20} />
            카카오계정으로 시작하기
            </Link>
          </button>
        </div>
        <div className = "border-t border-gray-200 my-4">
        </div>

        <h2 className="text-lg mt-12 font-extrabold flex items-center gap-2">
          스토리 크리에이터 <span className="text-green-500 text-[20px]">S</span>
        </h2>
        
        <div className= "w-full">
          {creators.map((c) => (
            <CreatorCard key = {c.id} creator={c} />
          ))}
          {creators_two.map((c) => (
            <CreatorCard key = {c.id} creator={c} />
          ))}
        </div>
      </aside>
    </main>
  );
}
