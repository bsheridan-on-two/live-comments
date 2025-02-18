import { useState, useRef, useEffect } from "react";

const reactions = ["👍", "❤️", "😂", "😮", "😢"];

interface ReactionProps {
  onReact: (emoji: string) => void;
}

const Reaction: React.FC<ReactionProps> = ({ onReact }) => {
  const [showReactions, setShowReactions] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  // Close the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReactions]);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setShowReactions(!showReactions)}
        className="text-xl hover:scale-110 transition-transform"
      >
        😊
      </button>
      {showReactions && (
        <div className="absolute bg-white border rounded shadow-lg p-2 flex gap-2 left-0 -translate-x-full">
          {reactions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onReact(emoji);
                setShowReactions(false);
              }}
              className="text-xl hover:scale-110 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reaction;
