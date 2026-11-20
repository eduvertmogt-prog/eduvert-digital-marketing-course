import { and, eq, sql } from "drizzle-orm"
import type { IntakeSettings } from "@/components/intake-model"
import type { Db } from "@/db/client"
import { intakeAnnouncement } from "@/db/schema/intake"

const flagshipAnnouncement = eq(intakeAnnouncement.id, 1)
const intakeFields = {
  enabled: intakeAnnouncement.enabled,
  closesOn: intakeAnnouncement.closesOn,
  seatsRemaining: intakeAnnouncement.seatsRemaining,
  revision: intakeAnnouncement.revision,
}

export async function readIntake(db: Db) {
  const [intake] = await db.select(intakeFields).from(intakeAnnouncement).where(flagshipAnnouncement)
  if (!intake) throw new Error("The flagship intake settings have not been initialized.")
  return intake
}

export async function saveIntake(db: Db, { revision, ...settings }: IntakeSettings) {
  const [updated] = await db.update(intakeAnnouncement)
    .set({ ...settings, revision: sql`${intakeAnnouncement.revision} + 1` })
    .where(and(flagshipAnnouncement, eq(intakeAnnouncement.revision, revision)))
    .returning(intakeFields)
  return updated ?? null
}
