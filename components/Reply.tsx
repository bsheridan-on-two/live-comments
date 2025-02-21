import Reaction from "./Reaction";

interface ReplyProps {
  reply: { commentId: string; replyId: string; text: string; reactions: Record<string, number> };
  onReact: (emoji: string) => void;
}

const Reply: React.FC<ReplyProps> = ({ reply, onReact }) => {
  return (
    <div className="ml-6 border-l-2 pl-4 mt-2 font-mono">
      <div className="flex justify-between items-center">
        <p>{reply.text}</p>
        <Reaction onReact={(emoji) => {
            // Pass the received emoji directly without adding reply.commentId
            onReact(emoji);
            console.log("Reaction callback, emoji:", emoji);
          }}
        />
      </div>
      <p>
        {Object.entries(reply.reactions).map(([emoji, count]) => (
          <span key={emoji}>{emoji}({count}) </span>
        ))}
      </p>
    </div>
  );
};

export default Reply;
