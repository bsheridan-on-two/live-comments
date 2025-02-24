import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Comment from '@/models/Comment';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { commentId, emoji, replyId } = await req.json();
    if (!commentId || !emoji) {
      return NextResponse.json({ success: false, message: 'Missing commentId or emoji' }, { status: 400 });
    }
    let result;
    if (replyId) {
      // Update reaction count for a specific reply
      result = await Comment.updateOne(
        { _id: commentId },
        { $inc: { ['replies.$[elem].reactions.' + emoji]: 1 } },
        { arrayFilters: [{ 'elem._id': replyId }] }
      );
      if (result.modifiedCount === 0) {
        return NextResponse.json({ success: false, message: 'Reply not found' }, { status: 404 });
      }
    } else {
      // Update reaction count for the comment
      result = await Comment.updateOne(
        { _id: commentId },
        { $inc: { ['reactions.' + emoji]: 1 } }
      );
      if (result.modifiedCount === 0) {
        return NextResponse.json({ success: false, message: 'Comment not found' }, { status: 404 });
      }
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
      let errorMessage = 'Server Error';
  
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return NextResponse.json({ success: false, message: errorMessage }, { status: 500 }); 
     
    }
  }
