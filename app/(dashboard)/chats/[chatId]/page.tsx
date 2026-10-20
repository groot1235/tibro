import { notFound } from "next/navigation"
import { getChat } from "@/chats/queries"
import { ChatHeader } from "@/components/chat-header"

interface ChatPageProps {
  params: Promise<{
    chatId: string
  }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params
  const chat = await getChat(chatId)

  if (!chat) {
    notFound()
  }

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-background text-foreground">
      <ChatHeader chat={chat} />
      <main className="flex-1" />
    </div>
  )
}
