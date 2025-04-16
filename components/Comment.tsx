

interface CommentProps {
  comment: {
    id: string;
    text: string;
    replies: { commentId: string; replyId: string; text: string; reactions: Record<string, number> }[];
    reactions: Record<string, number>;
  };
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className="border p-3 my-3 rounded font-mono">
      <div className="flex justify-between items-center">
        <p>{comment.text}</p>
      </div>
    </div>
  );
};

export default Comment;
