"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import {
  bots,
  createBotInputSchema,
  insertBotSchema,
  type Bot,
  type CreateBotInput,
} from "@/lib/db/schema"
import { revalidatePath } from "next/cache"

export type CreateBotResult =
  | { success: true; bot: Bot }
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

    const insertPayload = insertBotSchema.parse({
      ...validatedInput,
      userId,
    })

    const [newBot] = await db.insert(bots).values(insertPayload).returning()

    revalidatePath("/")

    return {
      success: true,
      bot: newBot,
    }
  } catch (error) {
    console.error("Failed to create bot:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create bot",
    }
  }
}
