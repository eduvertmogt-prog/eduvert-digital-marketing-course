import type { Metadata } from "next"
import { FlagshipStickyDemo } from "@/components/programs/flagship-booking"
import { FlagshipComparison } from "@/components/programs/flagship-comparison"
import { PageFaq } from "@/components/programs/page-faq"
import { PracticalLearning } from "@/components/programs/practical-learning"
import { ProgramAudience } from "@/components/programs/program-audience"
import { ProgramBatches } from "@/components/programs/program-batches"
import { EnrolmentBand, ProgramCareer } from "@/components/programs/program-career"
import { ProgramCurriculum } from "@/components/programs/program-curriculum"
import { flagshipQuestions } from "@/components/programs/program-content"
import { ProgramHero } from "@/components/programs/program-hero"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Professional Digital Marketing Program with AI · EduVert",
  description: "Learn digital marketing with AI in four months. Explore seven modules, live campaigns, a capstone, certification, and placement support in Navi Mumbai or live online.",
}

export default function ProfessionalDigitalMarketingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ProgramHero />
        <PracticalLearning />
        <ProgramAudience />
        <ProgramCurriculum />
        <FlagshipComparison />
        <ProgramCareer />
        <PageFaq
          id="flagship-questions"
          headingId="flagship-questions-heading"
          title="Program FAQs"
          questions={flagshipQuestions}
          groupHeadings={{
            beginner: "Who the program is for",
            included: "Course work and certification",
            "career-support": "Career support",
            "live-online": "Class formats and fees",
          }}
        />
        <div id="flagship-enrolment">
          <ProgramBatches />
          <EnrolmentBand />
        </div>
        <FlagshipStickyDemo />
      </main>
      <SiteFooter />
    </>
  )
}
