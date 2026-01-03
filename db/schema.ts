import {
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const creatures = pgTable("creatures", {
  id: uuid("id").primaryKey().defaultRandom(),
  githubProfileUrl: text("github_profile_url").notNull(),
  description: text("description").notNull(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  followers: integer("followers").notNull().default(0),
  stars: integer("stars").notNull().default(0),
  powerLevel: real("power_level").notNull().default(0),
  contributions: integer("contributions").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SelectCreature = typeof creatures.$inferSelect;
export type InsertCreature = typeof creatures.$inferInsert;
