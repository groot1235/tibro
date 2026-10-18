import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getUserChats() {
  const { userId } = await auth()

  if (!userId) {
    return []
  }

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
}

export const getChats = getUserChats

export type UserChat = Awaited<ReturnType<typeof getUserChats>>[number]
