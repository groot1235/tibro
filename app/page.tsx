import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button"

export default async function Page() {
  const { isAuthenticated, userId } = await auth()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-tight text-lg">Tibro</span>
        </div>
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Sign up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>

      <main className="flex flex-1 flex-col p-6">
        <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Project ready!</h1>
            <p className="text-muted-foreground mt-1">
              Clerk authentication is now set up and configured.
            </p>
          </div>

          <Show when="signed-in">
            <div className="rounded-lg border bg-card p-4 text-card-foreground">
              <p className="font-medium text-emerald-600 dark:text-emerald-400">
                ✓ Authenticated
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground break-all">
                User ID: {userId}
              </p>
            </div>
          </Show>

          <Show when="signed-out">
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="font-medium">You are currently signed out.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Use the buttons in the top right or click below to sign in or create an account.
              </p>
              <div className="mt-3 flex gap-2">
                <SignInButton mode="modal">
                  <Button size="sm">Sign in</Button>
                </SignInButton>
              </div>
            </div>
          </Show>

          <div className="font-mono text-xs text-muted-foreground">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </div>
      </main>
    </div>
  )
}

