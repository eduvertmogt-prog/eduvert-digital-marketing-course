import { sql } from "drizzle-orm"
import {
  boolean,
  check,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

/**
 * One row per human being, across all of their enquiries.
 *
 * A visitor who books a demo in January and asks about fees in March
 * is ONE person with TWO enquiries. Dedupe happens at the application
 * layer (match on normalized email, then normalized phone); the database
 * keeps a case-insensitive unique index on email as a backstop.
 * (PostgreSQL treats NULLs as distinct, so people with no email are unaffected.)
 *
 * Consent fields exist because phone/email are PII used for follow-ups:
 * the admin dashboard must be able to prove when and where consent
 * was given. See docs/DATABASE.md for the policy notes.
 */
export const persons = pgTable(
  "persons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    phone: text("phone"),
    email: text("email"),
    /** True when the person agreed to be contacted about courses. */
    marketingConsent: boolean("marketing_consent").notNull().default(false),
    /** When consent was last given or withdrawn. Null = never recorded. */
    consentAt: timestamp("consent_at", { withTimezone: true }),
    /** Which form/page captured the consent, e.g. "contact-form v1". */
    consentSource: text("consent_source"),
    /** Free-form admin notes about the person (not per-enquiry). */
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // A person with neither phone nor email can never be followed up with.
    check("persons_contact_present", sql`${t.phone} IS NOT NULL OR ${t.email} IS NOT NULL`),
    uniqueIndex("persons_email_unique").on(sql`lower(${t.email})`),
  ],
)
