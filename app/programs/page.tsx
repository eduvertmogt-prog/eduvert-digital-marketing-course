import type { Metadata } from "next"
import { LearningFormats } from "@/components/programs/learning-formats"
import { PageFaq } from "@/components/programs/page-faq"
import { ProgramCatalog } from "@/components/programs/program-catalog"
import { ProgramComparison } from "@/components/programs/program-comparison"
import { programQuestions } from "@/components/programs/program-content"
import { ProgramsHero } from "@/components/programs/programs-hero"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Programs · EduVert",
  description: "Explore practical Digital Marketing and Data Analytics courses designed around hands-on learning, real projects, and expert guidance.",
}

export default function ProgramsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ProgramsHero />
        <ProgramCatalog />
        <ProgramComparison />
        <LearningFormats />
        <PageFaq
          id="program-questions"
          headingId="program-questions-heading"
          title="Frequently Asked Questions"
          intro="A few things to know before choosing a course."
          questions={programQuestions}
        />
      </main>
      <SiteFooter />
    </>
  )
}
