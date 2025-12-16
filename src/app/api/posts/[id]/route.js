import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_request, { params }) {
  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: { email: true } } },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (err) {
    console.error("GET /api/posts/[id] error", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
