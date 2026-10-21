import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { getChat } from "@/chats/queries"
import { ChatHeader } from "@/components/chat-header"
import { ChatView } from "@/components/chat-view"

interface ChatPageProps {
  params: Promise<{
    chatId: string
  }>
}

export const dynamic = "force-dynamic"

export default async function ChatPage({ params }: ChatPageProps) {
  const { userId } = await auth.protect()
  const { chatId } = await params
  const chat = await getChat(chatId, userId)

  if (!chat) {
    notFound()
  }

  const firstMember = chat.members?.[0]
  const bot = firstMember?.bot

  return (
    <div className="flex h-svh max-h-svh flex-1 flex-col overflow-hidden bg-background text-foreground">
      <ChatHeader chat={chat} />
      <main className="flex flex-1 min-h-0 flex-col overflow-hidden">
        <ChatView bot={bot} />
      </main>
    </div>
  )
}
