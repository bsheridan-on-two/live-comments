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
  publishComment: (text: string) => void;
}

const CommentsList: React.FC<CommentsListProps> = ({ comments, publishComment }) => {
  return (
    <div className="font-mono">
      <h2 className="text-xl font-bold">Live Comments</h2>
      {comments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
          />
        ))}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <CommentForm onSubmit={publishComment} />
      </div>
    </div>
  );
}
export default CommentsList;
