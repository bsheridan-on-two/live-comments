"use client"
import CommentsList from "../components/CommentsList";
import dynamic from 'next/dynamic';

const AblyClient = dynamic(() => import('./ablyClient'), {
  ssr: false,
})

export default function Home() {
  return (
    <div className="p-5">
      <AblyClient>
        <CommentsList />
      </AblyClient>
    </div>
  );
}
