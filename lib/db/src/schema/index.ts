import {
  pgTable, serial, text, integer, boolean,
  timestamp, varchar
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentsTable = pgTable("students", {
  id:        serial("id").primaryKey(),
  name:      text("name").notNull(),
  phone:     varchar("phone",   { length: 60 }).notNull(),
  email:     varchar("email",   { length: 255 }),
  country:   varchar("country", { length: 100 }),
  batch:     varchar("batch",   { length: 60 }),
  status:    varchar("status",  { length: 20 }).default("pending").notNull(),
  notes:     text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const paymentsTable = pgTable("payments", {
  id:          serial("id").primaryKey(),
  studentId:   integer("student_id").references(() => studentsTable.id).notNull(),
  receiptData: text("receipt_data"),
  amount:      varchar("amount", { length: 50 }),
  status:      varchar("status", { length: 20 }).default("pending").notNull(),
  reviewedAt:  timestamp("reviewed_at"),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
});

export const zoomSessionsTable = pgTable("zoom_sessions", {
  id:         serial("id").primaryKey(),
  batch:      varchar("batch",  { length: 60 }).notNull(),
  weekNumber: integer("week_number").notNull(),
  title:      varchar("title",  { length: 255 }),
  zoomLink:   text("zoom_link"),
  passcode:   varchar("passcode", { length: 100 }),
  isActive:   boolean("is_active").default(true).notNull(),
  createdAt:  timestamp("created_at").defaultNow().notNull(),
  updatedAt:  timestamp("updated_at").defaultNow().notNull(),
});

export const siteSettingsTable = pgTable("site_settings", {
  key:       varchar("key", { length: 100 }).primaryKey(),
  value:     text("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const adminMessagesTable = pgTable("admin_messages", {
  id:        serial("id").primaryKey(),
  studentId: integer("student_id").references(() => studentsTable.id).notNull(),
  message:   text("message").notNull(),
  sentAt:    timestamp("sent_at").defaultNow().notNull(),
});

export const insertStudentSchema = createInsertSchema(studentsTable)
  .omit({ id: true, createdAt: true, status: true });

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student       = typeof studentsTable.$inferSelect;
export type Payment       = typeof paymentsTable.$inferSelect;
export type ZoomSession   = typeof zoomSessionsTable.$inferSelect;
export type SiteSetting   = typeof siteSettingsTable.$inferSelect;
export type AdminMessage  = typeof adminMessagesTable.$inferSelect;
