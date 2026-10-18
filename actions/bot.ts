"use server"

import { auth } from "@clerk/nextjs/server"
import { nanoid } from "nanoid"
import { db } from "@/lib/db"
import {
  bots,
  chats,
  chatMembers,
  createBotInputSchema,
  insertBotSchema,
  insertChatSchema,
  insertChatMemberSchema,
  type Bot,
  type Chat,
  type ChatMember,
  type CreateBotInput,
} from "@/lib/db/schema"
import { revalidatePath } from "next/cache"

export type CreateBotResult =
  | {
      success: true
      bot: Bot
      chat: Chat
      chatMember: ChatMember
    }
  | { success: false; error: string }

export async function createBot(input: CreateBotInput): Promise<CreateBotResult> {
  const { userId } = await auth()

  if (!userId) {
    return {
      success: false,
      error: "You must be signed in to create a bot.",
    }
  }

  try {
    const validatedInput = createBotInputSchema.parse(input)

    const botId = nanoid()
    const chatId = nanoid()

    const botPayload = insertBotSchema.parse({
      ...validatedInput,
      id: botId,
      userId,
    })

    const chatPayload = insertChatSchema.parse({
      id: chatId,
      userId,
      kind: "direct",
    })

    const chatMemberPayload = insertChatMemberSchema.parse({
      chatId,
      botId,
    })

    const [[newBot], [newChat], [newChatMember]] = await db.batch([
      db.insert(bots).values(botPayload).returning(),
      db.insert(chats).values(chatPayload).returning(),
      db.insert(chatMembers).values(chatMemberPayload).returning(),
    ])

    revalidatePath("/")

    return {
      success: true,
      bot: newBot,
      chat: newChat,
      chatMember: newChatMember,
    }
  } catch (error) {
    console.error("Failed to create bot:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create bot",
    }
  }
}

