import CommentForm from "./CommentForm";
import Comment from "./Comment";

interface Reply {
  commentId: string;
  replyId: string;
  text: string;
  reactions: Record<string, number>;
}

export interface CommentData {
  id: string;
  text: string;
  createdAt: string;
  replies: Reply[];
  reactions: Record<string, number>;
}

interface CommentsListProps {
  comments: CommentData[];
}

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {

  const addComment = async (text: string) => {
    try {
      await fetch("/api/mongo/add_comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    } catch (error: any) {
      console.error("Failed to add comment:", error.message);
    }
  };

  const replyToComment = async (commentId: string, text: string) => {
    try {
      await fetch("/api/mongo/add_reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, text }),
      });
    } catch (error: any) {
      console.error("Failed to add reply:", error.message);
    }
  };

  const reactToComment = async (commentId: string, emoji: string) => {
    try {
      await fetch("/api/mongo/add_reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, emoji }),
      });
    } catch (error: any) {
      console.error("Failed to add reaction to comment:", error.message);
    }
  };

  const reactToReply = async (commentId: string, replyId: string, emoji: string) => {
    try {
      await fetch("/api/mongo/add_reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, emoji, replyId }),
      });
    } catch (error: any) {
      console.error("Failed to add reaction to reply:", error.message);
    }
  };

  return (
    <div className="font-mono">
      <h2 className="text-xl font-bold">Live Comments</h2>
      {comments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={replyToComment}
            onReact={reactToComment}
            onReactToReply={reactToReply}
          />
        ))}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <CommentForm onSubmit={addComment} />
      </div>
    </div>
  );
}
export default CommentsList;
