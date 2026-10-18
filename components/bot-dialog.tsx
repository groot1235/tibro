"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, ShuffleIcon } from "lucide-react"
import { nanoid } from "nanoid"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { ChatAvatar } from "@/components/chat-avatar"
import { createBot } from "@/actions/bot"
import {
  createBotInputSchema,
  type CreateBotInput,
} from "@/lib/db/schema"
import { cn } from "@/lib/utils"

const PRESET_BOTS = [
  {
    id: "research-assistant",
    label: "Research assistant",
    name: "Ada",
    job: "Research assistant",
    instructions:
      "Answer briefly, cite sources, and ask before running anything destructive.",
  },
  {
    id: "code-reviewer",
    label: "Code reviewer",
    name: "Linus",
    job: "Code reviewer",
    instructions:
      "Review code thoroughly for correctness, performance, edge cases, and best practices. Suggest clean, idiomatic improvements.",
  },
  {
    id: "writing-editor",
    label: "Writing editor",
    name: "Hemingway",
    job: "Writing editor",
    instructions:
      "Polish writing for conciseness, rhythm, tone, and grammar while respecting the original voice.",
  },
  {
    id: "tutor",
    label: "Tutor",
    name: "Socrates",
    job: "Tutor",
    instructions:
      "Guide learning with structured explanations, thought-provoking questions, and practical analogies.",
  },
]

export interface BotDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactElement
  children?: React.ReactElement
  onSuccess?: () => void
}

export function BotDialog({
  open,
  onOpenChange,
  trigger,
  children,
  onSuccess,
}: BotDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const handleOpenChange = onOpenChange || setInternalOpen

  const [selectedPreset, setSelectedPreset] = React.useState<string>(
    PRESET_BOTS[0].id
  )
  const [avatarSeed, setAvatarSeed] = React.useState<string>(() => nanoid())

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBotInput>({
    resolver: zodResolver(createBotInputSchema),
    defaultValues: {
      name: PRESET_BOTS[0].name,
      job: PRESET_BOTS[0].job,
      instructions: PRESET_BOTS[0].instructions,
      avatar: avatarSeed,
    },
  })

  // Synchronize avatar seed into form when it changes
  React.useEffect(() => {
    setValue("avatar", avatarSeed, { shouldValidate: true })
  }, [avatarSeed, setValue])

  function handleSelectPreset(preset: (typeof PRESET_BOTS)[number]) {
    setSelectedPreset(preset.id)
    setValue("name", preset.name, { shouldValidate: true })
    setValue("job", preset.job, { shouldValidate: true })
    setValue("instructions", preset.instructions, { shouldValidate: true })
  }

  function handleShuffle() {
    const newSeed = nanoid()
    setAvatarSeed(newSeed)
    setValue("avatar", newSeed, { shouldValidate: true })
  }

  const onSubmit = async (values: CreateBotInput) => {
    try {
      const result = await createBot(values)

      if (!result.success) {
        toast.add({
          title: "Failed to create bot",
          description: result.error,
        })
        return
      }

      toast.add({
        title: "Bot created",
        description: `${result.bot.name} is ready to chat!`,
      })

      handleOpenChange(false)
      onSuccess?.()

      // Reset to defaults
      const nextSeed = nanoid()
      setAvatarSeed(nextSeed)
      setSelectedPreset(PRESET_BOTS[0].id)
      reset({
        name: PRESET_BOTS[0].name,
        job: PRESET_BOTS[0].job,
        instructions: PRESET_BOTS[0].instructions,
        avatar: nextSeed,
      })
    } catch (err) {
      toast.add({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
      })
    }
  }

  const triggerElement = trigger ?? children ?? (
    <Button variant="secondary" className="rounded-xl px-4">
      <PlusIcon data-icon="inline-start" />
      Create a new bot
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger render={triggerElement} />
      <DialogContent className="max-w-[480px] gap-0 p-0 sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex flex-col gap-5 p-6">
            <DialogHeader className="gap-1">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                New bot
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Give it a face, a name, and a job to do.
              </DialogDescription>
            </DialogHeader>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_BOTS.map((preset) => {
                const isSelected = selectedPreset === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                      isSelected
                        ? "bg-secondary text-secondary-foreground border border-border shadow-xs"
                        : "bg-muted/40 text-muted-foreground border border-border/40 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>

            {/* Face preview and shuffle */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted/30">
                  <ChatAvatar seed={avatarSeed} className="size-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-tight">Face</span>
                  <span className="text-xs text-muted-foreground">
                    Shuffle until you find one you like.
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleShuffle}
                className="h-8 gap-1.5 rounded-lg px-3 text-xs"
              >
                <ShuffleIcon data-icon="inline-start" />
                Shuffle
              </Button>
            </div>

            {/* Form Fields */}
            <FieldGroup className="gap-4">
              <Field data-invalid={!!errors.name}>
                <FieldLabel
                  htmlFor="bot-name"
                  className="text-xs font-medium text-foreground"
                >
                  Name
                </FieldLabel>
                <Input
                  id="bot-name"
                  placeholder="Ada"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                  className="rounded-lg border-border/60 bg-muted/20"
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.job}>
                <FieldLabel
                  htmlFor="bot-job"
                  className="text-xs font-medium text-foreground"
                >
                  Job
                </FieldLabel>
                <Input
                  id="bot-job"
                  placeholder="Research assistant"
                  aria-invalid={!!errors.job}
                  {...register("job")}
                  className="rounded-lg border-border/60 bg-muted/20"
                />
                {errors.job && <FieldError>{errors.job.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.instructions}>
                <FieldLabel
                  htmlFor="bot-instructions"
                  className="text-xs font-medium text-foreground"
                >
                  How it should work
                </FieldLabel>
                <Textarea
                  id="bot-instructions"
                  rows={3}
                  placeholder="Answer briefly, cite sources, and ask before running anything destructive."
                  aria-invalid={!!errors.instructions}
                  {...register("instructions")}
                  className="min-h-24 resize-none rounded-lg border-border/60 bg-muted/20"
                />
                {errors.instructions && (
                  <FieldError>{errors.instructions.message}</FieldError>
                )}
              </Field>
            </FieldGroup>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-border/40 bg-muted/10 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="rounded-lg px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg px-4"
            >
              {isSubmitting && <Spinner data-icon="inline-start" />}
              Create bot
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
