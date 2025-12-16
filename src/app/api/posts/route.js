import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { email: true } } },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error("GET /api/posts error", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, content, authorId, thumbnail } = body;

    if (
      !title ||
      !content ||
      typeof title !== "string" ||
      typeof content !== "string" ||
      !authorId ||
      Number.isNaN(Number(authorId))
    ) {
      return NextResponse.json(
        { error: "title, content, authorId are required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorId: Number(authorId),
        thumbnail: thumbnail || null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
