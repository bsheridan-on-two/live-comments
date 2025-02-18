import { useState } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

interface CommentData {
  id: string;
  text: string;
  replies: { id: string; text: string; reactions: Record<string, number> }[];
  reactions: Record<string, number>;
}

const CommentList = () => {
  const [comments, setComments] = useState<CommentData[]>([]);

  const addComment = (text: string) => {
    setComments([...comments, { id: Date.now().toString(), text, replies: [], reactions: {} }]);
  };

  const replyToComment = (id: string, text: string) => {
    setComments(
      comments.map((c) =>
        c.id === id ? { ...c, replies: [...c.replies, { id: Date.now().toString(), text, reactions: {} }] } : c
      )
    );
  };

  const reactToComment = (id: string, emoji: string) => {
    setComments(
      comments.map((c) =>
        c.id === id
          ? { ...c, reactions: { ...c.reactions, [emoji]: (c.reactions[emoji] || 0) + 1 } }
          : c
      )
    );
  };

  const reactToReply = (commentId: string, replyId: string, emoji: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: c.replies.map((r) =>
                r.id === replyId ? { ...r, reactions: { ...r.reactions, [emoji]: (r.reactions[emoji] || 0) + 1 } } : r
              ),
            }
          : c
      )
    );
  };

  return (
    <div className="font-mono">
      <h2 className="text-xl font-bold">Live Comments</h2>
      <div className="mt-4">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} onReply={replyToComment} onReact={reactToComment} onReactToReply={reactToReply} />
        ))}
      </div>
      <CommentForm onSubmit={addComment} />
    </div>
  );
};

export default CommentList;
