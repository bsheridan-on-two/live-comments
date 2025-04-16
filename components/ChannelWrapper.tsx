"use client";

import { ChannelProvider } from "ably/react";

export default function ChannelProviderWrapper({
    children,
    channelName
}: {
    children: React.ReactNode;
    channelName: string;
}) {
    return (
        <ChannelProvider channelName={channelName}>
            {children}
        </ChannelProvider>
    );
}