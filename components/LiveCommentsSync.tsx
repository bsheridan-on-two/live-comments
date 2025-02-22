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

// Helper to merge updated fields into an existing comment
// Note: This is a shallow merge. For nested fields (like replies),
 // you might need a deeper merge strategy.
function mergeUpdate(existing: CommentData, updatedFields: any): CommentData {
  // If updatedFields contains a top-level field, we override it.
  return {
    ...existing,
    ...updatedFields,
    // For updated replies, if a key like "replies.X" is provided,
    // you can parse the index and replace that reply in the replies array.
    // This example does a simple string match.
    replies: existing.replies.map((reply) => {
      // Look for a field update key beginning with "replies."
      // If one exists whose key ends with the reply's index (or id match), replace it.
      // You could improve this logic as needed.
      for (const key in updatedFields) {
        if (key.startsWith("replies.")) {
          // For example, if key is "replies.1", check if reply.replyId matches
          // For simplicity, if replyId equals the updated reply's _id in updatedFields
          const updatedReply = updatedFields[key];
          if (updatedReply && (reply.replyId === (updatedReply._id?.$oid || updatedReply._id))) {
            return { ...reply, ...updatedReply };
          }
        }
      }
      return reply;
    }),
  };
}

const LiveCommentsSync: React.FC = () => {
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

  // Initial fetch with transformation
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

  // Ably channel subscription – decode messages based on _ablyMsgName
  useChannel("live-comments", (message) => {
    console.log("Received Ably message:", message.data);
    const msg = message.data;
    const msgName = msg._ablyMsgName;
    if (!msgName) return;

    // For comment_added, use fullDocument directly
    if (msgName === "comment_added" && msg.fullDocument) {
      const newComment = decodeFullDocument(msg.fullDocument);
      setComments((prev) => [...prev, newComment]);
      return;
    }

    // For updates, fullDocument may not exist.
    if (msgName === "comment_updated") {
      if (msg.fullDocument) {
        // Use fullDocument if available
        const updatedComment = decodeFullDocument(msg.fullDocument);
        updateComment(updatedComment);
      } else if (msg.updateDescription && msg.documentKey && msg.documentKey._id) {
        // Otherwise, try merging updatedFields into the existing comment
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === (msg.documentKey._id.$oid || msg.documentKey._id)) {
              return mergeUpdate(c, msg.updateDescription.updatedFields);
            }
            return c;
          })
        );
      }
      return;
    }
    if (msgName === "comment_deleted") {
      setComments((prev) => prev.filter((c) => c.id !== (msg.documentKey._id.$oid || msg.documentKey._id)));
      return;
    }
    if (msgName === "reply_added" || msgName === "reply_updated") {
      // We assume the full comment document is sent, or at least an update.
      if (msg.fullDocument) {
        const updatedComment = decodeFullDocument(msg.fullDocument);
        updateComment(updatedComment);
      } else if (msg.updateDescription && msg.documentKey && msg.documentKey._id) {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === (msg.documentKey._id.$oid || msg.documentKey._id)) {
              return mergeUpdate(c, msg.updateDescription.updatedFields);
            }
            return c;
          })
        );
      }
      return;
    }
    console.warn("Unknown message name:", msgName);
  });

  return <CommentsList comments={comments} />;
};

export default LiveCommentsSync;
