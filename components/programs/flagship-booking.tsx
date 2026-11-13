import { CourseDemoLink, StickyCourseDemo } from "@/components/courses/course-demo-booking"
import { programFees } from "@/components/program-fees"

const heroDemoId = "flagship-hero-demo"
const course = {
  courseSlug: "digital-marketing",
  courseLabel: "Professional Digital Marketing Program with AI",
}

export function FlagshipDemoLink({ inHero = false }: { inHero?: boolean }) {
  return <CourseDemoLink id={inHero ? heroDemoId : undefined} {...course} />
}

export function FlagshipStickyDemo() {
  return (
    <StickyCourseDemo
      triggerId={heroDemoId}
      bookingId="flagship-final-booking"
      total={programFees.flagship.total}
      {...course}
    />
  )
}
