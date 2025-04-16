import { CommentData } from "@/components/CommentsList";
import fs from "fs";
import path from "path";

export const fetchCommentData = async (): Promise<CommentData[]> => {
    const filePath = process.env.COMMENTS_FILE_PATH || path.join(__dirname, 'comments.json');
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    }
    return [];
  };
