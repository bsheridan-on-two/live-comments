"use client";
import { useState, useCallback } from "react";
import { useChannel } from "ably/react";
import CommentsList, { CommentData } from "./CommentsList";

const LiveCommentsSync: React.FC = () => {
  const [comments, setComments] = useState<CommentData[]>([]);

  // Utility: update a comment in state (by id)
  const updateComment = useCallback((updated: CommentData) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  }, []);

  // Ably channel subscription
  useChannel("live-comments", (message) => {
    // Debug log message data
    console.log("Received Ably message:", message.data);

    // Because our integration rule pipeline sets _ablyMsgName,
    // we can handle the four types:
    // "comment_added", "comment_updated", "reply_added", "reply_updated" (and "comment_deleted" perhaps).
    const msg = message.data;
    const msgName = msg._ablyMsgName;
    
    if (!msgName) return;

    switch (msgName) {
      case "comment_added":
        // Append new comment from fullDocument
        setComments((prev) => [...prev, msg.fullDocument]);
        break;
      case "comment_updated":
        updateComment(msg.fullDocument);
        break;
      case "comment_deleted":
        setComments((prev) => prev.filter(c => c.id !== msg.documentKey._id));
        break;
      case "reply_added":
        // For reply_added, we assume fullDocument holds the updated comment document.
        updateComment(msg.fullDocument);
        break;
      case "reply_updated":
        // Similarly for reply updates:
        updateComment(msg.fullDocument);
        break;
      default:
        console.warn("Unknown message name:", msgName);
    }
  });

  return <CommentsList comments={comments} />;
};

export default LiveCommentsSync;
