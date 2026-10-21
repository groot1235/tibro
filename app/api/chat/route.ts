import { auth } from "@clerk/nextjs/server"
import { streamText, convertToModelMessages } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const { messages, system } = await req.json()

    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      model: xai("grok-2-1212"),
      system,
      messages: modelMessages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Chat route error:", error)
    return new Response(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    )
  }
}
