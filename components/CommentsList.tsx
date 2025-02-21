import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { ObjectId } from 'bson';
// Updated CommentData uses replyId
interface CommentData {
  id: string;
  text: string;
  replies: { commentId: string; replyId: string; text: string; reactions: Record<string, number> }[];
  reactions: Record<string, number>;
}

const CommentList = () => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/mongo/get_comments");
        const data = await res.json();
        if (data.success) {
          // Transform documents: use replyId field from Mongo; if not present, default to empty string.
          const transformed = data.data.map((c: any) => ({
            id: c._id,
            text: c.text,
            replies: (c.replies || []).map((r: any) => ({
              commentId: r._id, // keep the reply's comment reference from DB if stored that way
              replyId: r.replyId || r._id, // use replyId if exists; otherwise fallback to _id
              text: r.text,
              reactions: r.reactions || {},
            })),
            reactions: c.reactions || {},
          }));
          setComments(transformed);
        } else {
          throw new Error("Failed to load comments");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load comments");
      }
    };
    fetchComments();
  }, []);

  const addComment = async (text: string) => {
    try {
      const res = await fetch("/api/mongo/add_comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setComments([...comments, { id: data.data.id, text, replies: [], reactions: {} }]);
      setError(null);
    } catch (error: any) {
      setError(error.message || "Failed to add comment");
    }
  };

  const replyToComment = async (commentId: string, text: string) => {
    console.log("replyToComment called with:", { commentId, text });
    try {
      const res = await fetch("/api/mongo/add_reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, text }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      // Use the replyId returned from the API
      const serverReplyId = data.data.replyId;
      setComments(
        comments.map((c) =>
          c.id === commentId
            ? { ...c, replies: [...c.replies, { commentId, replyId: serverReplyId, text, reactions: {} }] }
            : c
        )
      );
      setError(null);
    } catch (error: any) {
      setError(error.message || "Failed to add reply");
    }
  };

  const reactToComment = async (commentId: string, emoji: string) => {
    try {
      const res = await fetch("/api/mongo/add_reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, emoji }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setComments(
        comments.map((c) =>
          c.id === commentId
            ? { ...c, reactions: { ...c.reactions, [emoji]: (c.reactions[emoji] || 0) + 1 } }
            : c
        )
      );
      setError(null);
    } catch (error: any) {
      setError(error.message || "Failed to add reaction");
    }
  };

  const reactToReply = async (commentId: string, replyId: string, emoji: string) => {
    try {
      console.log("reactToReply called with:", { commentId, replyId, emoji });
      const res = await fetch("/api/mongo/add_reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, emoji, replyId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setComments(
        comments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                replies: c.replies.map((r) =>
                  r.replyId === replyId ? { ...r, reactions: { ...r.reactions, [emoji]: (r.reactions[emoji] || 0) + 1 } } : r
                ),
              }
            : c
        )
      );
      setError(null);
    } catch (error: any) {
      setError(error.message || "Failed to add reaction to reply");
    }
  };

  return (
    <>
      <div className="font-mono">
        <h2 className="text-xl font-bold">Live Comments</h2>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mt-4"></div>
        {comments.map((comment, index) => (
          <Comment
            key={comment.id || index}
            comment={comment}
            onReply={replyToComment}
            onReact={reactToComment}
            onReactToReply={reactToReply}
          />
        ))}
        <CommentForm onSubmit={addComment} />
      </div>
    </>
  );
};

export default CommentList;
