import mongoose, { Schema, model, models, Document } from 'mongoose';

interface Reply {
  replyId: string; // Added replyId field
  text: string;
  commentId: string;
  reactions: Record<string, number>;
}

interface CommentDocument extends Document {
  text: string;
  reactions: Record<string, number>;
  replies: Reply[];
}

const ReplySchema = new Schema<Reply>(
  {
    replyId: { 
      type: String, 
      required: true, 
      default: function() { 
        // "this" is the subdocument, _id is auto-generated
        return this._id ? this._id.toString() : '' 
      } 
    },
    text: { type: String, required: true },
    reactions: { type: Map, of: Number, default: {} },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const CommentSchema = new Schema<CommentDocument>(
  {
    text: { type: String, required: true },
    reactions: { type: Map, of: Number, default: {} },
    replies: { type: [ReplySchema], default: [] },
  },
  {
    timestamps: true,
  }
);

const Comment = models.Comment || model<CommentDocument>('Comment', CommentSchema);
export default Comment;
