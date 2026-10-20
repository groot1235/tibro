"use server"

import { auth } from "@clerk/nextjs/server"
import { and, eq, inArray } from "drizzle-orm"
import { nanoid } from "nanoid"
import { db } from "@/lib/db"
import {
  bots,
  chats,
  chatMembers,
  createBotInputSchema,
  updateBotInputSchema,
  deleteBotInputSchema,
  insertBotSchema,
  insertChatSchema,
  insertChatMemberSchema,
  type Bot,
  type Chat,
  type ChatMember,
  type CreateBotInput,
  type UpdateBotInput,
  type DeleteBotInput,
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

    revalidatePath("/", "layout")

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

export type UpdateBotResult =
  | {
      success: true
      bot: Bot
    }
  | { success: false; error: string }

export async function updateBot(
  input: UpdateBotInput
): Promise<UpdateBotResult> {
  const { userId } = await auth()

  if (!userId) {
    return {
      success: false,
      error: "You must be signed in to update a bot.",
    }
  }

  try {
    const validatedInput = updateBotInputSchema.parse(input)

    insertBotSchema.parse({
      ...validatedInput,
      userId,
    })

    const [updatedBot] = await db
      .update(bots)
      .set({
        name: validatedInput.name,
        job: validatedInput.job,
        avatar: validatedInput.avatar,
        instructions: validatedInput.instructions?.trim() || null,
      })
      .where(and(eq(bots.id, validatedInput.id), eq(bots.userId, userId)))
      .returning()

    if (!updatedBot) {
      return {
        success: false,
        error: "Bot not found or unauthorized.",
      }
    }

    revalidatePath("/", "layout")

    return {
      success: true,
      bot: updatedBot,
    }
  } catch (error) {
    console.error("Failed to update bot:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update bot",
    }
  }
}

export type DeleteBotResult =
  | { success: true }
  | { success: false; error: string }

export async function deleteBot(
  input: DeleteBotInput
): Promise<DeleteBotResult> {
  const { userId } = await auth()

  if (!userId) {
    return {
      success: false,
      error: "You must be signed in to delete a bot.",
    }
  }

  try {
    const validatedInput = deleteBotInputSchema.parse(input)

    // Find any direct chats that belong to this bot
    const memberships = await db.query.chatMembers.findMany({
      where: (members, { eq }) => eq(members.botId, validatedInput.id),
      with: {
        chat: true,
      },
    })

    const directChatIds = memberships
      .filter((m) => m.chat?.userId === userId && m.chat?.kind === "direct")
      .map((m) => m.chatId)

    // Delete the bot scoped to the current user
    const [deletedBot] = await db
      .delete(bots)
      .where(and(eq(bots.id, validatedInput.id), eq(bots.userId, userId)))
      .returning()

    if (!deletedBot) {
      return {
        success: false,
        error: "Bot not found or unauthorized.",
      }
    }

    // Delete associated direct chats if any
    if (directChatIds.length > 0) {
      await db
        .delete(chats)
        .where(
          and(
            inArray(chats.id, directChatIds),
            eq(chats.userId, userId)
          )
        )
    }

    revalidatePath("/", "layout")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Failed to delete bot:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete bot",
    }
  }
}



