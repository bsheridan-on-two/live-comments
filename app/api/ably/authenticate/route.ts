import { NextRequest, NextResponse } from "next/server";
import * as Ably from "ably";

const CLIENT_IDS = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot"];
const getRandomClientId = (): string => {
  let r = (Math.random() + 1).toString(36).substring(7);
  return CLIENT_IDS[Math.floor(Math.random() * CLIENT_IDS.length)] + '_' + r;
};

export const GET = async () => {
    const clientId = getRandomClientId();
    const client = new Ably.Rest({
      key: process.env.ABLY_API_KEY,
      clientId: clientId,
    });
    const tokenRequestData = await client.auth.createTokenRequest();
    return NextResponse.json(tokenRequestData)
  }
