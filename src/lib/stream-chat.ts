import "server-only";

import { StreamChat } from "stream-chat";

let streamChatClient: StreamChat | null = null;

const getStreamChatClient = () => {
    if (streamChatClient) return streamChatClient;

    const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
    const secretKey = process.env.STREAM_VIDEO_SECRET_KEY;

    if (!apiKey) {
        throw new Error("NEXT_PUBLIC_STREAM_VIDEO_API_KEY is not set");
    }

    if (!secretKey) {
        throw new Error("STREAM_VIDEO_SECRET_KEY is not set");
    }

    streamChatClient = StreamChat.getInstance(apiKey, secretKey);
    return streamChatClient;
};

export const streamChat = new Proxy({} as StreamChat, {
    get(_target, prop) {
        const client = getStreamChatClient();
        const value = Reflect.get(client, prop);

        return typeof value === "function" ? value.bind(client) : value;
    },
});
