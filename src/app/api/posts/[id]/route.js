import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

const authorSelect = { select: { email: true } };

const parseId = (value) => {
  const id = Number.parseInt(value, 10);
  return Number.isFinite(id) ? id : null;
};

const findPostById = (id) =>
  prisma.post.findUnique({
    where: { id },
    include: { author: authorSelect },
  });

const ensureOwner = async (postId, userId) => {
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (!post) return { exists: false, authorized: false };
  return { exists: true, authorized: post.authorId === userId };
};

export async function GET(_request, { params }) {
  // Return a single post with author email
  const id = parseId(params.id);
  if (!id) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    const post = await findPostById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (err) {
    console.error("GET /api/posts/[id] error", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  // Update post title/content/thumbnail for the owner
  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { exists, authorized } = await ensureOwner(id, session.user.id);
  if (!exists) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const updates = {};
  if (typeof body.title === "string" && body.title.trim()) updates.title = body.title.trim();
  if (typeof body.content === "string" && body.content.trim()) updates.content = body.content.trim();
  if (typeof body.thumbnail === "string") updates.thumbnail = body.thumbnail || null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  try {
    const updated = await prisma.post.update({
      where: { id },
      data: updates,
      include: { author: authorSelect },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/posts/[id] error", err);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  // Delete a post if the requester is the owner
  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { exists, authorized } = await ensureOwner(id, session.user.id);
  if (!exists) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/posts/[id] error", err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
