"use client"

import * as React from "react"
import { UserButton } from "@clerk/nextjs"
import { formatDistanceToNowStrict } from "date-fns"
import { Plus, Users } from "lucide-react"
import { BotDialog } from "@/components/bot-dialog"
import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { UserChat } from "@/queries/bots"

export interface AppSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  chats?: UserChat[]
}

export function AppSidebar({
  chats = [],
  ...props
}: AppSidebarProps) {
  const [botDialogOpen, setBotDialogOpen] = React.useState(false)

  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader className="flex flex-row items-center justify-end p-2 group-data-[collapsible=icon]:justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="border-none shadow-none text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Plus />
                  <span className="sr-only">Add</span>
                </Button>
              }
            />
            <DropdownMenuContent
              align="end"
              className="w-48 border-none ring-0 ring-transparent shadow-lg"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setBotDialogOpen(true)}>
                  <Plus />
                  <span>Create new bot</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users />
                  <span>Create group chat</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats.map((chat) => {
                  const firstMember = chat.members[0]
                  const bot = firstMember?.bot
                  const botName = chat.name || bot?.name || "Chat"
                  const avatarSeed = bot?.avatar || bot?.name || chat.id
                  const timeAgo = chat.lastMessageAt
                    ? formatDistanceToNowStrict(new Date(chat.lastMessageAt))
                    : ""

                  return (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        size="lg"
                        className="h-auto py-2.5 px-2 gap-3"
                      >
                        <ChatAvatar
                          seed={avatarSeed}
                          className="size-8 shrink-0 rounded-full"
                        />
                        <div className="flex flex-1 min-w-0 flex-col gap-0.5 overflow-hidden group-data-[collapsible=icon]:hidden">
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className="truncate text-sm font-medium text-sidebar-foreground">
                              {botName}
                            </span>
                            {timeAgo && (
                              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                                {timeAgo}
                              </span>
                            )}
                          </div>
                          <span className="truncate text-xs text-muted-foreground text-left">
                            {chat.lastMessagePreview || "No messages yet"}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                render={<div />}
                className="h-12 w-full p-0 transition-colors group-has-[[aria-expanded=true]]/menu-item:bg-sidebar-accent group-has-[[aria-expanded=true]]/menu-item:text-sidebar-accent-foreground"
              >
                <UserButton
                  showName
                  appearance={{
                    elements: {
                      rootBox: "flex h-full w-full items-center bg-transparent!",
                      userButtonTrigger:
                        "flex h-full w-full items-center justify-start gap-2 rounded-md p-2 text-left text-sm text-sidebar-foreground border-none! shadow-none! bg-transparent! hover:bg-transparent! active:bg-transparent! focus:bg-transparent! focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none transition-colors group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!",
                      userButtonBox:
                        "flex flex-row items-center gap-2 w-full h-full bg-transparent!",
                      userButtonAvatarBox:
                        "order-first size-[1.5rem]! w-[1.5rem]! h-[1.5rem]! shrink-0 rounded-md overflow-hidden",
                      userButtonAvatarImage:
                        "size-[1.5rem]! w-[1.5rem]! h-[1.5rem]! rounded-md object-cover",
                      userButtonOuterIdentifier:
                        "order-last flex-1 text-left truncate text-sm font-medium text-sidebar-foreground group-hover/menu-button:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden",
                    },
                  }}
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <BotDialog
        open={botDialogOpen}
        onOpenChange={setBotDialogOpen}
        trigger={<span className="hidden" />}
      />
    </>
  )
}
