import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// Helpers
const authorSelect = { select: { email: true } };

const listPosts = () =>
  prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: authorSelect },
  });

const createPost = (data) =>
  prisma.post.create({
    data,
  });

export async function GET() {
  // Fetch the latest posts with minimal author info
  try {
    const posts = await listPosts();
    return NextResponse.json(posts);
  } catch (err) {
    console.error("GET /api/posts error", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request) {
  // Create a post for the logged-in user
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

    const post = await createPost({
      title: title.trim(),
      content: content.trim(),
      authorId: session.user.id,
      thumbnail: thumbnail || null,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
