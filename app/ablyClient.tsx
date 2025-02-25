'use client';

import * as Ably from "ably";
import { AblyProvider } from 'ably/react';
import { ReactNode } from "react";

interface AblyClientProps {
  children: ReactNode;
}

const AblyClient: React.FC<AblyClientProps> = ({ children }) => {

  const client = new Ably.Realtime({
     authUrl: 'api/ably/authenticate',
     autoConnect: typeof window !== 'undefined',
  });
      
  return (
    <AblyProvider client={client}>
      {children}
    </AblyProvider>
  );
};

export default AblyClient;
