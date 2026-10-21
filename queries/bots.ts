import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getUserChats(authenticatedUserId?: string) {
  const userId = authenticatedUserId ?? (await auth()).userId

  if (!userId) {
    return []
  }

  try {
    const userChats = await db.query.chats.findMany({
      where: (chats, { eq }) => eq(chats.userId, userId),
      orderBy: (chats, { desc }) => [desc(chats.lastMessageAt)],
      with: {
        members: {
          with: {
            bot: true,
          },
        },
      },
    })

    return userChats
  } catch (error) {
    console.error("Failed to get user chats:", error)
    return []
  }
}

export const getChats = getUserChats

export type UserChat = Awaited<ReturnType<typeof getUserChats>>[number]
