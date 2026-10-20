"use client"

import { useRouter } from "next/navigation"
import { Monitor } from "lucide-react"
import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import { BotDialog } from "@/components/bot-dialog"
import { cn } from "@/lib/utils"

export interface ChatHeaderMember {
  bot?: {
    id: string
    name: string
    avatar?: string | null
    job?: string | null
    instructions?: string | null
  } | null
}

export interface ChatHeaderProps {
  chat: {
    id: string
    name?: string | null
    members?: ChatHeaderMember[]
  }
  className?: string
}

export function ChatHeader({ chat, className }: ChatHeaderProps) {
  const router = useRouter()
  const firstMember = chat.members?.[0]
  const bot = firstMember?.bot
  const botName = chat.name || bot?.name || "Chat"
  const avatarSeed = bot?.avatar || bot?.name || chat.id

  return (
    <header
      className={cn(
        "flex h-12 w-full shrink-0 items-center justify-between border-b border-border bg-background px-4",
        className
      )}
    >
      {bot ? (
        <BotDialog
          bot={bot}
          trigger={
            <Button
              type="button"
              variant="ghost"
              className="h-auto -ml-2 gap-2.5 px-2 py-1.5 rounded-lg text-foreground hover:bg-muted/60 transition-colors font-medium text-sm"
            >
              <ChatAvatar
                seed={avatarSeed}
                className="size-6 shrink-0 rounded-full"
              />
              <span>{botName}</span>
            </Button>
          }
          onSuccess={() => {
            router.refresh()
          }}
          onDelete={() => {
            router.push("/")
            router.refresh()
          }}
        />
      ) : (
        <div className="flex items-center gap-2.5">
          <ChatAvatar
            seed={avatarSeed}
            className="size-6 shrink-0 rounded-full"
          />
          <span className="text-sm font-medium text-foreground">{botName}</span>
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground hover:text-foreground"
      >
        <Monitor />
        <span className="sr-only">Desktop</span>
      </Button>
    </header>
  )
}
