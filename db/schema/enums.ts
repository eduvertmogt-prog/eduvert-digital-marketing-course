import { pgEnum } from "drizzle-orm/pg-core"

/**
 * Why the enquiry is being made. Mirrors today's CTAs:
 * - free_demo: "Book a Free Demo" (header, heroes, course pages)
 * - counsellor_callback: "Talk to Our Counsellor" / "Talk to Our Team"
 * - course_enquiry: "Enquire About ..." on course detail pages
 * - contact_message: the contact-page form
 * - career_support: placements-page "Enquire About Career Support"
 * - admission_request: flagship Program's "Reserve My Seat"
 *
 * New values are added with a follow-up migration. Never rename or
 * delete a value in place; retired values stay readable for history.
 */
export const enquiryType = pgEnum("enquiry_type", [
  "free_demo",
  "counsellor_callback",
  "course_enquiry",
  "contact_message",
  "career_support",
  "admission_request",
])

/**
 * Admin-dashboard workflow for an enquiry.
 * - new: just arrived, nobody has acted on it
 * - contacted: team has reached out at least once
 * - qualified: genuine prospect, worth pursuing
 * - enrolled: converted into a paying learner
 * - closed: resolved without enrolment (or withdrawn)
 * - spam: junk / test submissions, hidden from default views
 */
export const enquiryStatus = pgEnum("enquiry_status", [
  "new",
  "contacted",
  "qualified",
  "enrolled",
  "closed",
  "spam",
])

/**
 * Channel used for a follow-up touch. Kept deliberately small;
 * "other" covers anything future (e.g. in-app chat) without a migration.
 */
export const followUpChannel = pgEnum("follow_up_channel", [
  "phone",
  "whatsapp",
  "email",
  "in_person",
  "other",
])

export type EnquiryType = (typeof enquiryType.enumValues)[number]
export type EnquiryStatus = (typeof enquiryStatus.enumValues)[number]
export type FollowUpChannel = (typeof followUpChannel.enumValues)[number]
