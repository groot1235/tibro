import { chat } from "@trigger.dev/sdk/ai";
import { xai } from "@ai-sdk/xai";
import { z } from "zod";

export const chatAgent = chat
  .withClientData({
    schema: z.object({
      system: z.string().optional(),
    }),
  })
  .agent({
    id: "chat-agent",
    run: async ({ messages, signal, streamText, clientData }) => {
      return streamText({
        model: xai("grok-2-1212"),
        system: clientData?.system,
        messages,
        abortSignal: signal,
      });
    },
  });
