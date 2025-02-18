import Reaction from "./Reaction";

interface ReplyProps {
  reply: { id: string; text: string; reactions: Record<string, number> };
  onReact: (id: string, emoji: string) => void;
  onReply: (id: string, text: string) => void;
}

const Reply: React.FC<ReplyProps> = ({ reply, onReact, onReply }) => {
  return (
    <div className="ml-6 border-l-2 pl-4 mt-2 font-mono">
      <div className="flex justify-between items-center">
        <p>{reply.text}</p>
        <Reaction onReact={(emoji) => onReact(reply.id, emoji)} />

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
