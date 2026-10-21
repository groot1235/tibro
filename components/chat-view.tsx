"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input"
import { ChatAvatar } from "@/components/chat-avatar"

export interface ChatViewProps {
  bot?: {
    id?: string
    name: string
    job?: string | null
    instructions?: string | null
    avatar?: string | null
  } | null
}

export function ChatView({ bot }: ChatViewProps) {
  const systemPrompt = React.useMemo(() => {
    if (!bot) return undefined
    const parts: string[] = []
    if (bot.instructions) {
      parts.push(bot.instructions)
    }
    if (bot.name && bot.job) {
      parts.push(`You are ${bot.name}, a ${bot.job}.`)
    } else if (bot.name) {
      parts.push(`You are ${bot.name}.`)
    }
    return parts.length > 0 ? parts.join("\n\n") : undefined
  }, [bot])

  const transport = React.useMemo(
    () =>
      new DefaultChatTransport({
        body: systemPrompt ? { system: systemPrompt } : undefined,
      }),
    [systemPrompt]
  )

  const { messages, sendMessage, status, stop, error } = useChat({
    transport,
  })

  const handleSubmit = React.useCallback(
    (message: PromptInputMessage) => {
      const text = message.text.trim()
      if (!text && (!message.files || message.files.length === 0)) {
        return
      }
      sendMessage({
        text: message.text,
        files: message.files,
      })
    },
    [sendMessage]
  )

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <Conversation className="flex-1 min-h-0">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 p-4 md:p-6">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={
                <div className="flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-muted/40 shadow-xs">
                  <ChatAvatar
                    seed={bot?.avatar || bot?.name || "bot"}
                    className="size-14"
                  />
                </div>
              }
              title={bot?.name ? `Chat with ${bot.name}` : "Start a conversation"}
              description={
                bot?.job
                  ? bot.job
                  : "Type a message below to start chatting."
              }
            />
          ) : (
            messages.map((message) => {
              const text = message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("")

              return (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {message.role === "assistant" ? (
                      <MessageResponse>{text}</MessageResponse>
                    ) : (
                      <p className="whitespace-pre-wrap">{text}</p>
                    )}
                  </MessageContent>
                </Message>
              )
            })
          )}

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              <p className="font-medium">Failed to generate response</p>
              <p className="mt-1 text-xs opacity-90">
                {error.message || "An unexpected error occurred while communicating with the AI model."}
              </p>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl p-4">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            placeholder={
              bot?.name ? `Message ${bot.name}...` : "Send a message..."
            }
          />
          <PromptInputFooter>
            <div />
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}
