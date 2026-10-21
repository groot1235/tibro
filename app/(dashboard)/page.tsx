import { auth } from "@clerk/nextjs/server"
import { nanoid } from "nanoid"
import { BotDialog } from "@/components/bot-dialog"
import { ChatAvatar } from "@/components/chat-avatar"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const dynamic = "force-dynamic"

export default async function Page() {
  await auth.protect()
  const seed = nanoid()

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-background text-foreground">
      <main className="flex flex-1 items-center justify-center p-4">
        <Empty className="border-0">
          <EmptyHeader className="max-w-md gap-2">
            <EmptyMedia>
              <ChatAvatar seed={seed} className="size-12" />
            </EmptyMedia>
            <EmptyTitle className="text-xl font-medium tracking-tight">
              Meet your first bot
            </EmptyTitle>
            <EmptyDescription className="text-muted-foreground">
              Every bot gets its own personality, memory, and face. Spin one up
              and start the conversation.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-2">
            <BotDialog />
          </EmptyContent>
        </Empty>
      </main>
    </div>
  )
}
