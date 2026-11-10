import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core"
import { enquiries } from "@/db/schema/enquiries"

/**
 * Which courses an enquiry is about. An enquiry may name several
 * courses ("SEO and Data Analytics"), hence a separate link table
 * instead of a column on enquiries.
 *
 * course_slug mirrors the slugs in components/courses/course-data.ts
 * (e.g. "seo-course-in-navi-mumbai", "sem-course", "smm-course",
 * "data-analytics-python"). It is TEXT, not a foreign key, for now
 * because the course catalog still lives in code. When the catalog
 * moves into the database, add a courses table and migrate this column
 * to a foreign key — the composite primary key shape already fits.
 *
 * course_label snapshots the course title AT ENQUIRY TIME so history
 * stays accurate even if course names change later.
 */
export const enquiryCourseInterests = pgTable(
  "enquiry_course_interests",
  {
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    courseSlug: text("course_slug").notNull(),
    courseLabel: text("course_label").notNull(),
  },
  (t) => [primaryKey({ columns: [t.enquiryId, t.courseSlug], name: "enquiry_course_interests_pkey" })],
)
