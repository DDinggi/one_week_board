//AXIOS 라이브러리 이용해서, -> 라우터 바꾸셈


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { nickname: true } } },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error("GET /api/posts error", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, thumbnail } = body;

    if (!title || !content || typeof title !== "string" || typeof content !== "string") {
      return NextResponse.json({ error: "title and content are required" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorId: session.user.id,
        thumbnail: thumbnail || null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
