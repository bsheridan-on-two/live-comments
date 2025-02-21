import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Comment from '@/models/Comment';

export async function GET(req: Request) {
  await dbConnect();
  const comments = await Comment.find({});
  return NextResponse.json({ success: true, data: comments });
}
