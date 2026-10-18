"use client"

import * as React from "react"
import { UserButton } from "@clerk/nextjs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
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
  )
}
