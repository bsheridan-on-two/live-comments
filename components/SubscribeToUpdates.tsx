"use client";
import { useState, useCallback, useEffect } from "react";
import { useChannel } from "ably/react";
import CommentsList, { CommentData } from "./CommentsList";
import { saveCommentServerAction } from "@/lib/saveCommentServeraction";

const SubscribeToUpdates = ({initialComments}: { initialComments: CommentData[]}) => {
  const [comments, setComments] = useState<CommentData[]>(initialComments);

  // Ably subscription for new comments
  const { channel } = useChannel("live-comments", (message) => {
    if (message.data.fullDocument) {
      setComments((prev) => [...prev, message.data.fullDocument]);
    }
  });

  const publishComment = async (messageText: string): Promise<void> => {
    if(channel === null) return
    const comment: CommentData = {
      id: "temp-id",
      text: messageText,
      createdAt: new Date().toISOString(),
      replies: [],
      reactions: {},
    };
    channel.publish('update-from-client', {fullDocument: comment});

    await saveCommentServerAction(comment);
  }

  return <CommentsList comments={comments} publishComment={publishComment} />;
};

export default SubscribeToUpdates;
