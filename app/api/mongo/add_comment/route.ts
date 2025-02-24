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
    }
  catch (error: unknown) {
    let errorMessage = 'Server Error';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 }); 
   }
}
