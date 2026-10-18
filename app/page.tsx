import { Show, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs"
import { nanoid } from "nanoid"
import { BotDialog } from "@/components/bot-dialog"
import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const dynamic = "force-dynamic"

export default function Page() {
  const seed = nanoid()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/95 px-6 backdrop-blur">
        <span className="text-base font-semibold tracking-tight">Tibro</span>
        <div className="flex items-center gap-2">
          <Show when="signed-in">
            <SignOutButton>
              <Button variant="outline" size="sm">
                Sign out
              </Button>
            </SignOutButton>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton>
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </SignInButton>
          </Show>
        </div>
      </header>

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
