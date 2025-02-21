import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Comment from '@/models/Comment';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { commentId, text } = await req.json();
    if (!commentId || !text) {
      return NextResponse.json({ success: false, message: 'Missing commentId or text' }, { status: 400 });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: { text } } },
      { new: true }
    );
    if (!updatedComment) {
      return NextResponse.json({ success: false, message: 'Comment not found' }, { status: 404 });
    }
    // Assume the new reply is the last in the replies array
    const newReply = updatedComment.replies[updatedComment.replies.length - 1];
    return NextResponse.json({ success: true, data: { id: commentId, replyId: newReply.replyId } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}
