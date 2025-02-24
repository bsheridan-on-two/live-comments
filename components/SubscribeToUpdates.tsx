"use client";
import { useState, useCallback, useEffect } from "react";
import { useChannel } from "ably/react";
import CommentsList, { CommentData } from "./CommentsList";

// Helper to decode a fullDocument record into our CommentData shape.
function decodeFullDocument(fullDoc: any): CommentData {
  return {
    id: fullDoc._id.$oid || fullDoc._id,
    text: fullDoc.text,
    createdAt: fullDoc.createdAt?.$date?.$numberLong
      ? new Date(Number(fullDoc.createdAt.$date.$numberLong)).toISOString()
      : fullDoc.createdAt,
    replies: (fullDoc.replies || []).map((r: any) => ({
      commentId: r._id.$oid || r._id,
      replyId: r.replyId || (r._id.$oid || r._id),
      text: r.text,
      reactions: r.reactions || {},
    })),
    reactions: fullDoc.reactions || {},
  };
}

// Helper to merge updatedFields into an existing comment.
// This function handles top-level fields, reactions (keys like "reactions.❤️"),
// and nested updates for replies (e.g. "replies.2.reactions.😂").
function mergeCommentUpdate(current: CommentData, updatedFields: any): CommentData {
  const updated: CommentData = { ...current };
  console.log("UpdatedFields: ", updatedFields);

  for (const key in updatedFields) {
    
    // New reaction to the comment
    if (key.startsWith("reactions.")) {
      const emoji = key.split(".")[1];
      updated.reactions = { ...updated.reactions, [emoji]: updatedFields[key].$numberInt };
      
    } else if (key.startsWith("replies")) {
      const parts = key.split(".")

      // For the first reply to a comment, the key comes in nested so that replies[0] is how to access the data - not sure why this is.
      if (parts.length === 1) {
        updated.replies = [
            ...current.replies,
            {
              commentId: current.id,
              text: updatedFields[key][0].text,
              replyId: updatedFields[key][0].replyId,
              reactions: updatedFields[key][0].reactions || {}
            }
          ]
      }
      
      // For new subsequent replies to the comment,the key comes in partitioned by fullstops  e.g. replies.2
      if (parts.length === 2) {
        updated.replies = [
          ...current.replies,
          {
            commentId: current.id,
            text: updatedFields[key].text,
            replyId: updatedFields[key].replyId,
            reactions: updatedFields[key].reactions || {}
          }
        ]
      }

      // For new reactions to a reply, the key comes in the form replies.{{replyNumber}}.reactions.{{emoji}} so for example 'replies.2.reactions.😂'
      if (parts.length === 4 && parts[2] === "reactions") {
        const index = parseInt(parts[1], 10);
        const emoji = parts[3];
        const emojiInc = updatedFields[key].$numberInt;
        updated.replies = [...current.replies];
        if (updated.replies[index]) {
          updated.replies[index] = {
            ...updated.replies[index],
            reactions: {
              ...updated.replies[index].reactions,
              [emoji]: emojiInc,
            },
          };
        }
      }
    }
   }
   
  return updated;
}

const SubscribeToUpdates: React.FC = () => {
  const [comments, setComments] = useState<CommentData[]>([]);

  // Utility: update a comment in state by id
  const updateComment = useCallback((updated: CommentData) => {
    if (!updated || !updated.id) {
      console.error("updateComment received an invalid object:", updated);
      return;
    }
    setComments((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  }, []);

  // Fetch initial comments with transformation
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/mongo/get_comments");
        const data = await res.json();
        if (data.success) {
          const transformed = data.data.map((c: any) => decodeFullDocument(c));
          setComments(transformed);
        } else {
          throw new Error("Failed to load comments");
        }
      } catch (err: any) {
        console.error("Error fetching comments:", err.message);
      }
    };
    fetchComments();
  }, []);

  // Ably subscription for new comments
  useChannel("live-comments", "comment_added", (message) => {
    console.log("Received Ably message (comment_added):", message.data);
    if (message.data.fullDocument) {
      const newComment = decodeFullDocument(message.data.fullDocument);
      setComments((prev) => [...prev, newComment]);
    }
  });

  // Ably subscription for comment updates (which may include reactions or reply changes)
  useChannel("live-comments", "comment_updated", (message) => {
    console.log("Received Ably message (comment_updated):", message.data);
    const commentId = message.data.documentKey?._id?.$oid;
    setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return mergeCommentUpdate(c, message.data.updateDescription.updatedFields);
          }
          return c;
        })
      );
    }
  );

  // Ably subscription for comment deletion, if needed.
  useChannel("live-comments", "comment_deleted", (message) => {
    console.log("Received Ably message (comment_deleted):", message.data);
    const commentId = message.data.documentKey?._id?.$oid || message.data.documentKey?._id;
    if (commentId) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  });

  return <CommentsList comments={comments} />;
};

export default SubscribeToUpdates;
