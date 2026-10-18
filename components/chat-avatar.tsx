import Image from "next/image"
import { Avatar, Style } from "@dicebear/core"
import lorelei from "@dicebear/styles/lorelei.json"
import { cn } from "@/lib/utils"

const style = new Style(lorelei)

export interface ChatAvatarProps {
  seed: string
  animated?: boolean
  className?: string
  alt?: string
}

export function ChatAvatar({
  seed,
  animated,
  className,
  alt = "Chat avatar",
}: ChatAvatarProps) {
  const avatar = new Avatar(style, {
    seed,
    ...(animated ? { tags: ["animation"] } : {}),
  })

  const dataUri = avatar.toDataUri()

  return (
    <Image
      src={dataUri}
      alt={alt}
      width={32}
      height={32}
      unoptimized
      className={cn(
        "size-8 rounded-full object-cover",
        animated && "animate-pulse",
        className
      )}
    />
  )
}
