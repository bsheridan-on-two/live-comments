"use client"
import LiveCommentsSync from "@/components/LiveCommentsSync";
import CommentsList from "../components/CommentsList";
import { ChannelProvider } from "ably/react";
import dynamic from 'next/dynamic';

const AblyClient = dynamic(() => import('./ablyClient'), {
  ssr: false,
})

export default function Home() {
  return (
    <div className="p-5">
      <AblyClient>
        <ChannelProvider channelName="live-comments">
         <LiveCommentsSync />
        </ChannelProvider>
       </AblyClient>
    </div>
  );
}
