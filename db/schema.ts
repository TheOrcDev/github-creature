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

export const battles = pgTable("battles", {
  id: uuid("id").primaryKey().defaultRandom(),
  winnerCreatureId: uuid("winner_creature_id")
    .notNull()
    .references(() => creatures.id),
  loserCreatureId: uuid("loser_creature_id")
    .notNull()
    .references(() => creatures.id),
  playerTeamIds: text("player_team_ids").notNull(),
  opponentTeamIds: text("opponent_team_ids").notNull(),
  totalRounds: integer("total_rounds").notNull(),
  battleReport: text("battle_report"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type SelectBattle = typeof battles.$inferSelect;
export type InsertBattle = typeof battles.$inferInsert;
