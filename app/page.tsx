
import { fetchCommentData } from "@/lib/fetchCommentData";
import SubscribeToUpdates from "../components/SubscribeToUpdates";
import dynamic from 'next/dynamic';
import ChannelProviderWrapper from "@/components/ChannelWrapper";

const AblyClient = dynamic(() => import('./ablyClient'), {
  ssr: false,
})

export default async function Home() {
  const comments = await fetchCommentData()

  return (
    <div className="p-5">
      <AblyClient>
        <ChannelProviderWrapper channelName="live-comments">
         <SubscribeToUpdates initialComments={comments} />
        </ChannelProviderWrapper>
       </AblyClient>
    </div>
  );
}
