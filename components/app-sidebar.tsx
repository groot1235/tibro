"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { formatDistanceToNowStrict } from "date-fns"
import { Plus, Search, Users } from "lucide-react"
import { BotDialog } from "@/components/bot-dialog"
import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
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
  SidebarRail,
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
  const router = useRouter()
  const pathname = usePathname()
  const [botDialogOpen, setBotDialogOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-end group-data-[collapsible=icon]:justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="border-none shadow-none text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8!"
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
          </div>

          <Button
            variant="outline"
            onClick={() => setCommandOpen(true)}
            className="h-9 w-full min-w-0 justify-between rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs transition-colors hover:bg-muted hover:text-foreground dark:bg-input/30 dark:hover:bg-input/50 font-normal text-muted-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-none! group-data-[collapsible=icon]:shadow-none! group-data-[collapsible=icon]:bg-transparent! group-data-[collapsible=icon]:hover:bg-sidebar-accent group-data-[collapsible=icon]:hover:text-sidebar-accent-foreground"
          >
            <div className="flex items-center gap-2 overflow-hidden group-data-[collapsible=icon]:justify-center">
              <Search className="size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:text-sidebar-foreground" />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                Search
              </span>
            </div>
            <Kbd className="bg-transparent text-muted-foreground group-data-[collapsible=icon]:hidden">
              ⌘K
            </Kbd>
          </Button>
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
                    <SidebarMenuItem
                      key={chat.id}
                      className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                    >
                      <SidebarMenuButton
                        size="lg"
                        className="h-auto py-2.5 px-2 gap-3 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center"
                        render={<Link href={`/chats/${chat.id}`} />}
                        isActive={pathname === `/chats/${chat.id}`}
                        tooltip={botName}
                      >
                        <ChatAvatar
                          seed={avatarSeed}
                          className="size-8 shrink-0 rounded-full group-data-[collapsible=icon]:size-[1.5rem]"
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
            <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                size="lg"
                render={<div />}
                className="h-12 w-full p-0 transition-colors group-has-[[aria-expanded=true]]/menu-item:bg-sidebar-accent group-has-[[aria-expanded=true]]/menu-item:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center"
              >
                <UserButton
                  showName
                  appearance={{
                    elements: {
                      rootBox:
                        "flex h-full w-full items-center bg-transparent! group-data-[collapsible=icon]:justify-center",
                      userButtonTrigger:
                        "flex h-full w-full items-center justify-start gap-2 rounded-md p-2 text-left text-sm text-sidebar-foreground border-none! shadow-none! bg-transparent! hover:bg-transparent! active:bg-transparent! focus:bg-transparent! focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none transition-colors group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!",
                      userButtonBox:
                        "flex flex-row items-center gap-2 w-full h-full bg-transparent! group-data-[collapsible=icon]:justify-center",
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
        <SidebarRail />
      </Sidebar>
      <BotDialog
        open={botDialogOpen}
        onOpenChange={setBotDialogOpen}
        trigger={<button type="button" className="hidden" />}
      />
      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        title="Search chats"
        description="Search your bot conversations"
      >
        <Command>
          <CommandInput placeholder="Search chats..." />
          <CommandList>
            <CommandEmpty>No chats found.</CommandEmpty>
            <CommandGroup heading="Chats">
              {chats.map((chat) => {
                const firstMember = chat.members[0]
                const bot = firstMember?.bot
                const botName = chat.name || bot?.name || "Chat"
                const avatarSeed = bot?.avatar || bot?.name || chat.id
                const timeAgo = chat.lastMessageAt
                  ? formatDistanceToNowStrict(new Date(chat.lastMessageAt))
                  : ""

                return (
                  <CommandItem
                    key={chat.id}
                    value={`${botName} ${chat.lastMessagePreview || ""}`.toLowerCase()}
                    onSelect={() => {
                      setCommandOpen(false)
                      router.push(`/chats/${chat.id}`)
                    }}
                    className="flex items-center gap-3 py-2.5 px-3 cursor-pointer [&>svg:last-child]:hidden"
                  >
                    <ChatAvatar
                      seed={avatarSeed}
                      className="size-8 shrink-0 rounded-full"
                    />
                    <div className="flex flex-1 min-w-0 flex-col gap-0.5 overflow-hidden">
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="truncate text-sm font-medium">
                          {botName}
                        </span>
                        {timeAgo && (
                          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                            {timeAgo}
                          </span>
                        )}
                      </div>
                      <span className="truncate text-xs text-muted-foreground">
                        {chat.lastMessagePreview || "No messages yet"}
                      </span>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
