import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
// Define the schema for the users table
export const usersTable = pgTable("users", {

// Define the columns of the users table
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
  subscriptionId: varchar()
});
