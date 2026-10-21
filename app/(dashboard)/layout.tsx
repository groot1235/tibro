import { auth } from "@clerk/nextjs/server"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { getUserChats } from "@/queries/bots"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth.protect()
  const chats = await getUserChats(userId)

  return (
    <SidebarProvider>
      <AppSidebar chats={chats} />
      {children}
    </SidebarProvider>
  )
}
