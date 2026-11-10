import { relations } from "drizzle-orm"
import { enquiries } from "@/db/schema/enquiries"
import { enquiryCourseInterests } from "@/db/schema/enquiry-course-interests"
import { followUps } from "@/db/schema/follow-ups"
import { persons } from "@/db/schema/persons"

export const personsRelations = relations(persons, ({ many }) => ({
  enquiries: many(enquiries),
}))

export const enquiriesRelations = relations(enquiries, ({ many, one }) => ({
  person: one(persons, {
    fields: [enquiries.personId],
    references: [persons.id],
  }),
  courseInterests: many(enquiryCourseInterests),
  followUps: many(followUps),
}))

export const enquiryCourseInterestsRelations = relations(enquiryCourseInterests, ({ one }) => ({
  enquiry: one(enquiries, {
    fields: [enquiryCourseInterests.enquiryId],
    references: [enquiries.id],
  }),
}))

export const followUpsRelations = relations(followUps, ({ one }) => ({
  enquiry: one(enquiries, {
    fields: [followUps.enquiryId],
    references: [enquiries.id],
  }),
}))
