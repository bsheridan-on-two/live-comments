import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Comment from '@/models/Comment';

export async function POST(req: Request) {
  await dbConnect();
  const results = await Comment.deleteMany({});
  return NextResponse.json({ success: true, data: results });
}
