import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const bots = pgTable(
  "bots",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    avatar: text("avatar")
      .notNull()
      .$defaultFn(() => nanoid()),
    job: text("job").notNull(),
    instructions: text("instructions"),
    sandboxId: text("sandbox_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("bots_user_id_idx").on(table.userId)]
);

export const chatKindEnum = pgEnum("chat_kind", ["direct", "group"]);

export const chats = pgTable(
  "chats",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text("user_id").notNull(),
    kind: chatKindEnum("kind").default("direct").notNull(),
    name: text("name"),
    lastMessagePreview: text("last_message_preview"),
    lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("chats_user_id_idx").on(table.userId)]
);

export const chatMembers = pgTable(
  "chat_members",
  {
    chatId: text("chat_id")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    botId: text("bot_id")
      .notNull()
      .references(() => bots.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.chatId, table.botId] }),
    index("chat_members_bot_id_idx").on(table.botId),
  ]
);

export const botsRelations = relations(bots, ({ many }) => ({
  memberships: many(chatMembers),
}));

export const chatsRelations = relations(chats, ({ many }) => ({
  members: many(chatMembers),
}));

export const chatMembersRelations = relations(chatMembers, ({ one }) => ({
  chat: one(chats, {
    fields: [chatMembers.chatId],
    references: [chats.id],
  }),
  bot: one(bots, {
    fields: [chatMembers.botId],
    references: [bots.id],
  }),
}));

export type Bot = typeof bots.$inferSelect;
export type NewBot = typeof bots.$inferInsert;

export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;

export type ChatMember = typeof chatMembers.$inferSelect;
export type NewChatMember = typeof chatMembers.$inferInsert;

export const insertBotSchema = createInsertSchema(bots);
export const selectBotSchema = createSelectSchema(bots);

export const insertChatSchema = createInsertSchema(chats);
export const selectChatSchema = createSelectSchema(chats);

export const insertChatMemberSchema = createInsertSchema(chatMembers);
export const selectChatMemberSchema = createSelectSchema(chatMembers);

export const createBotInputSchema = insertBotSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    sandboxId: true,
  })
  .extend({
    name: z.string().trim().min(1, "Name is required"),
    job: z.string().trim().min(1, "Job is required"),
    avatar: z.string().trim().min(1, "Avatar seed is required"),
    instructions: z.string().trim().optional(),
  });

export type CreateBotInput = z.infer<typeof createBotInputSchema>;

export const updateBotInputSchema = insertBotSchema
  .omit({
    userId: true,
    createdAt: true,
    sandboxId: true,
  })
  .extend({
    id: z.string().min(1, "Bot ID is required"),
    name: z.string().trim().min(1, "Name is required"),
    job: z.string().trim().min(1, "Job is required"),
    avatar: z.string().trim().min(1, "Avatar seed is required"),
    instructions: z.string().trim().optional(),
  });

export type UpdateBotInput = z.infer<typeof updateBotInputSchema>;

export const deleteBotInputSchema = insertBotSchema
  .pick({
    id: true,
  })
  .extend({
    id: z.string().min(1, "Bot ID is required"),
  });

export type DeleteBotInput = z.infer<typeof deleteBotInputSchema>;
