import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getChat(chatId: string) {
  const { userId } = await auth()

  if (!userId || !chatId) {
    return null
  }

  const chat = await db.query.chats.findFirst({
    where: (chats, { eq, and }) =>
      and(eq(chats.id, chatId), eq(chats.userId, userId)),
    with: {
      members: {
        with: {
          bot: true,
        },
      },
    },
  })

  return chat ?? null
}

export const getChatById = getChat

export type ChatWithMembers = NonNullable<Awaited<ReturnType<typeof getChat>>>
