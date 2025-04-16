import { useState } from "react";

interface CommentFormProps {
  onSubmit: (text: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [input, setInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
    setInput(""); // Clear input after submission
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 font-mono text-black">
      <input
        type="text"
        value={input}
        placeholder="Write your comment..."
        onChange={handleChange}
        className="border rounded p-2 w-full"
      />
      <button type="submit">
        ➡️    
      </button>
    </form>
  );
};

export default CommentForm;
