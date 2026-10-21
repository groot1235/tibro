<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git

1. Never create branches, worktrees, or commits automatically. Only do so when the user explicitly asks for that specific action in the current request.
2. Leave changes uncommitted in the working tree on the current branch and let the user decide when and how to commit.

## Database

1. Only perform database push (`npm run db:push` or `drizzle-kit push`).
2. Never perform database migrations (do not generate migration files or run migration scripts).
3. This is a development project. There is no backward compatibility and the data is worthless. Prefer data loss: never backfill, migrate, or preserve existing rows and never spend efforts on keeping old data working. Every schema change means a new slate.

## DiceBear

Use DiceBear 10. Documentation: https://www.dicebear.com/llms.txt

There are seven native cores with identical output, not one library with
wrappers. Use the one matching this project's language. Do not reach for the
JavaScript core when the project is written in something else:

    JavaScript  @dicebear/core + @dicebear/styles
    PHP         dicebear/core + dicebear/styles
    Python      dicebear-core + dicebear-styles
    Rust        dicebear-core + dicebear-styles
    Go          github.com/dicebear/dicebear-go/v10 + github.com/dicebear/styles/v10
    Dart        dicebear_core + dicebear_styles
    C#          DiceBear.Core + DiceBear.Styles

Every style page carries a loading snippet for all seven, for example
https://www.dicebear.com/styles/lorelei/index.md

HTTP API: https://api.dicebear.com/10.x/<style>/svg?seed=<seed> The seed is a
query parameter, not a path segment. Options are query parameters too; array
values are separated by commas.

Options named after a component end in Variant: eyesVariant, not eyes. This
holds in all seven cores and in the HTTP API. Look up the options of a style at
https://api.dicebear.com/10.x/<style>/options.json

Write these forms, not the ones on the left. The left column is pre-10 and the
API does not reject it, so an outdated call runs and silently does the wrong
thing:

    avatars.dicebear.com/api/<style>/<seed>.svg  ->  api.dicebear.com/10.x/<style>/svg?seed=<seed>
    api.dicebear.com/9.x/<style>/svg             ->  api.dicebear.com/10.x/<style>/svg
    npm install @dicebear/collection             ->  npm install @dicebear/styles
    npm install @dicebear/lorelei                ->  npm install @dicebear/styles
    createAvatar(lorelei, { seed })              ->  new Avatar(new Style(definition), { seed })
    { eyes: ['variant01'] }                      ->  { eyesVariant: ['variant01'] }
    ?radius=50                                   ->  ?borderRadius=50

Only JavaScript and the HTTP API have a pre-10 form. The other six cores were
released in 2026 and never had one, so any older-looking PHP, Python, Rust, Go,
Dart or C# API attributed to DiceBear is invented rather than outdated.

## Forms & Server Actions

### 1. Schema Placement & "use server" Boundary
- **Never export schemas or constants from `"use server"` files.** Next.js App Router treats every export in a `"use server"` file as a Server Action (an async RPC endpoint). Non-function exports become action proxies or undefined on the client, causing `@hookform/resolvers/zod` to fail at runtime with `"Invalid input: not a Zod schema"`.
- **Always define validation schemas in standard modules without `"use server"`** (e.g., `lib/db/schema.ts` or `lib/validations/*.ts`), and import them into both the client component (`react-hook-form` + `zodResolver`) and the server action.
- Server action files (`actions/*.ts`) must only export async server action functions and TypeScript types.

### 2. Drizzle & Zod Validation
- Use `createInsertSchema` and `createSelectSchema` from `drizzle-zod` directly on Drizzle table definitions.
- Keep dependencies aligned: this project uses `zod@^3` and `drizzle-zod@0.7.x` for compatibility with `@hookform/resolvers`.
- Derive form schemas by omitting server-controlled fields:
  ```ts
  export const createItemInputSchema = insertItemSchema
    .omit({ id: true, userId: true, createdAt: true })
    .extend({
      name: z.string().trim().min(1, "Name is required"),
    });
  ```
- Always re-validate with `insertItemSchema.parse({ ...input, userId })` inside the Server Action before database insertion.

### 3. Shadcn Form Composition
- Always use `FieldGroup` + `Field` + `FieldLabel` + `FieldError` from `@/components/ui/field`. Never use raw `div` with `space-y-*` or `grid gap-*` for form layout.
- Bind validation attributes: `data-invalid={!!errors.fieldName}` on `<Field>` and `aria-invalid={!!errors.fieldName}` on controls (`<Input>`, `<Textarea>`).
- Button loading state: `Button` has no `isPending` or `isLoading` prop. Compose with `<Spinner data-icon="inline-start" />` and `disabled={isSubmitting}`.
- Button icons must use `data-icon="inline-start"` or `data-icon="inline-end"` with no sizing classes.

### 4. Dialog & Modal Form Composition
- This project uses Base UI (`@base-ui/react/dialog`). Triggers and close buttons use `render={<Button ... />}` (not Radix's `asChild`).
- Component trigger props should be typed as `React.ReactElement` (not `React.ReactNode`) to satisfy Base UI's `render` prop type requirements.
- Always include `DialogTitle` and `DialogDescription` inside `DialogHeader` for accessibility.

### 5. Authentication in Actions
- Never trust `userId` passed from client form submissions.
- Always retrieve the authenticated user on the server inside Server Actions using Clerk's `await auth()` from `@clerk/nextjs/server`:
  ```ts
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }
  ```
- For Clerk conditional UI rendering in Next.js 16 / Core 3, use `<Show when="signed-in">` and `<Show when="signed-out">` (do not use removed `<SignedIn>`/`<SignedOut>` components).

<!-- TRIGGER.DEV SKILLS START -->
## Trigger.dev agent skills

This project has Trigger.dev agent skills installed in `.agents/skills/`. Before writing or changing Trigger.dev code (background tasks, scheduled tasks, realtime, or chat.agent AI agents), load the most relevant skill: `trigger-authoring-chat-agent`, `trigger-authoring-tasks`, `trigger-chat-agent-advanced`, `trigger-cost-savings`, `trigger-getting-started`, `trigger-realtime-and-frontend`.
<!-- TRIGGER.DEV SKILLS END -->
