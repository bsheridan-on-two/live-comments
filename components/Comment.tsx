import { useState } from "react";
import Reply from "./Reply";
import Reaction from "./Reaction";
import CommentForm from "./CommentForm";

interface CommentProps {
  comment: {
    id: string;
    text: string;
    replies: { commentId: string; replyId: string; text: string; reactions: Record<string, number> }[];
    reactions: Record<string, number>;
  };
  onReply: (commentId: string, text: string) => void;
  onReact: (id: string, emoji: string) => void;
  onReactToReply: (commentId: string, replyId: string, emoji: string) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onReply, onReact, onReactToReply }) => {
  return (
    <div className="border p-3 my-3 rounded font-mono">
      <div className="flex justify-between items-center">
        <p>{comment.text}</p>
        <Reaction onReact={(emoji) => onReact(comment.id, emoji)} />
      </div>
      <div className="flex gap-2 items-center">
        <p>{Object.entries(comment.reactions).map(([emoji, count]) => `${emoji}(${count}) `)}</p>
      </div>
      {/* Render Replies */}
      {[...comment.replies]
        .sort((a, b) => (a.replyId > b.replyId ? 1 : -1))
        .map((reply) => (
          <Reply key={reply.replyId} reply={reply} onReact={(emoji) => {
              onReactToReply(comment.id, reply.replyId, emoji);
              console.log("onReactToReply called with:", { commentId: comment.id, replyId: reply.replyId, emoji });
            }
          } />
        ))}
      {/* Reply Form */}
      <div className="p-3">
        <CommentForm onSubmit={(text) => onReply(comment.id, text)} />
      </div>
    </div>
  );
};

export default Comment;
