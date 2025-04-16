"use server";

import { CommentData } from "@/components/CommentsList";
import { revalidateTag } from "next/cache";
import fs from "fs";
import path from "path";

export const saveCommentServerAction = async (comment: CommentData) => {
    const filePath = "c:/VS Code/live-comments/lib/comments.json";
    const comments = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
    comments.push(comment);
    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));

    // Revalidate a specific tag
    revalidateTag("comments");

    // Return a success message
    return { message: "Server action completed successfully" };
}