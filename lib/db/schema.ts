import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
  (table) => [
    index("bots_user_id_idx").on(table.userId),
  ]
);

export type Bot = typeof bots.$inferSelect;
export type NewBot = typeof bots.$inferInsert;

export const insertBotSchema = createInsertSchema(bots);
export const selectBotSchema = createSelectSchema(bots);

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
