import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Comment from '@/models/Comment';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ success: false, message: 'Missing comment text' }, { status: 400 });
    }
    const comment = await Comment.create({ text });
    return NextResponse.json({ success: true, data: { id: comment._id } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
