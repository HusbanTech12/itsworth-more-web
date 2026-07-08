import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const placeholder = pgTable("placeholder", {
  id: text("id").primaryKey().default("placeholder"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
