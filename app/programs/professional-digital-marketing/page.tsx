import type { Metadata } from "next"
import { PageFaq } from "@/components/programs/page-faq"
import { PracticalLearning } from "@/components/programs/practical-learning"
import { ProgramBatches } from "@/components/programs/program-batches"
import { EnrolmentBand, ProgramCareer } from "@/components/programs/program-career"
import { ProgramCurriculum } from "@/components/programs/program-curriculum"
import { flagshipQuestions } from "@/components/programs/program-content"
import { ProgramHero } from "@/components/programs/program-hero"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Professional Digital Marketing Program · EduVert",
  description: "Plan campaigns, measure what works, and build a portfolio through hands-on assignments, live projects, and a capstone.",
}

export default function ProfessionalDigitalMarketingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ProgramHero />
        <PracticalLearning />
        <ProgramCurriculum />
        <ProgramBatches />
        <ProgramCareer />
        <PageFaq
          id="flagship-questions"
          headingId="flagship-questions-heading"
          eyebrow="COMMON QUESTIONS"
          title="Program FAQs"
          questions={flagshipQuestions}
        />
        <EnrolmentBand />
      </main>
      <SiteFooter />
    </>
  )
}
