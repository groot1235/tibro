"use server";

import { auth as clerkAuth } from "@clerk/nextjs/server";
import { auth as triggerAuth } from "@trigger.dev/sdk";
import { chat, defaultStorage } from "@trigger.dev/sdk/ai";
import { getChat } from "@/chats/queries";
import type { chatAgent } from "@/trigger/chat";

const defaultStartSession = chat.createStartSessionAction<typeof chatAgent>("chat-agent");
const defaultLoadTranscript = chat.createLoadTranscriptAction(defaultStorage, { limit: 50 });

export async function startChatSession(
  params: Parameters<typeof defaultStartSession>[0]
) {
  const { userId } = await clerkAuth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingChat = await getChat(params.chatId, userId);
  if (!existingChat) {
    throw new Error("Chat not found or unauthorized");
  }

  return defaultStartSession(params);
}

export async function mintChatAccessToken(chatId: string) {
  const { userId } = await clerkAuth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingChat = await getChat(chatId, userId);
  if (!existingChat) {
    throw new Error("Chat not found or unauthorized");
  }

  return triggerAuth.createPublicToken({
    scopes: { read: { sessions: chatId }, write: { sessions: chatId } },
    expirationTime: "1h",
  });
}

export async function loadTranscript(
  params: Parameters<typeof defaultLoadTranscript>[0]
) {
  const { userId } = await clerkAuth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingChat = await getChat(params.chatId, userId);
  if (!existingChat) {
    throw new Error("Chat not found or unauthorized");
  }

  return defaultLoadTranscript(params);
}
