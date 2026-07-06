import "server-only"

import { StreamClient } from "@stream-io/node-sdk";

let streamVideoClient: StreamClient | null = null;

const getStreamVideoClient = () => {
  if (streamVideoClient) return streamVideoClient;

  // Prefer server-side API key; fall back to NEXT_PUBLIC if needed.
  const apiKey =
    process.env.STREAM_VIDEO_API_KEY || process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
  const secretKey = process.env.STREAM_VIDEO_SECRET_KEY;

  if (!apiKey) {
    throw new Error("STREAM_VIDEO_API_KEY (or NEXT_PUBLIC_STREAM_VIDEO_API_KEY) is not set");
  }

  if (!secretKey) {
    throw new Error("STREAM_VIDEO_SECRET_KEY is not set");
  }

  streamVideoClient = new StreamClient(apiKey, secretKey);
  return streamVideoClient;
};

export const streamVideo = new Proxy({} as StreamClient, {
  get(_target, prop) {
    const client = getStreamVideoClient();
    const value = Reflect.get(client, prop);

    return typeof value === "function" ? value.bind(client) : value;
  },
});
