import { NextRequest, NextResponse } from "next/server";
// import { SignJWT } from "jose";
import * as Ably from "ably";

const CLIENT_IDS = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot"];
const getRandomClientId = (): string => {
  return CLIENT_IDS[Math.floor(Math.random() * CLIENT_IDS.length)];
};

const createToken = async (clientId:string, apiKey: string) => {
    const client = new Ably.Rest({
      key: process.env.ABLY_API_KEY,
      clientId: clientId,
    });
    const tokenRequestData = await client.auth.createTokenRequest();

  return tokenRequestData;
}

export const GET = async () => {
    const clientId = getRandomClientId();
    const token = await createToken(clientId, process.env.ABLY_API_KEY);
    console.log("token request: ", token);
    return NextResponse.json(token)
  }
