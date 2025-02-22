'use client';

import * as Ably from "ably";
import { AblyProvider } from 'ably/react';
import { ReactNode } from "react";

interface AblyClientProps {
  children: ReactNode;
}

const AblyClient: React.FC<AblyClientProps> = ({ children }) => {

  console.log(process.env.ABLY_API_KEY);
  const client = new Ably.Realtime({
         authUrl: 'api/ably/authenticate',
         autoConnect: typeof window !== 'undefined',
        //  logLevel: 2
      });
      
  client.connection.on((stateChange) => {
    console.log('New connection state is ' + stateChange.current);
  });
  return (
    <AblyProvider client={client}>
      {children}
    </AblyProvider>
  );
};

export default AblyClient;
