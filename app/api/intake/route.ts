import { intakeHasClosed, type PublicIntake } from "@/components/intake-model"
import { createDb, resolveConnectionString } from "@/db/client"
import { readIntake } from "@/db/intake"

export const dynamic = "force-dynamic"

export async function GET() {
  let intake: PublicIntake | null = null
  try {
    const { enabled, closesOn, seatsRemaining } = await readIntake(createDb(resolveConnectionString()))
    if (enabled && seatsRemaining > 0 && !intakeHasClosed(closesOn)) {
      intake = { closesOn, seatsRemaining }
    }
  } catch (error) {
    console.warn("Could not load the public intake announcement.", error instanceof Error ? error.name : "Unknown error")
  }
  return Response.json({ intake }, { headers: { "Cache-Control": "no-store" } })
}
