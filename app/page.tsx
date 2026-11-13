import { CareerPreparation } from "@/components/career-preparation"
import { WallOfWins } from "@/components/wall-of-wins"
import { CourseFaq } from "@/components/course-faq"
import { ExploreCourses } from "@/components/explore-courses"
import { SiteHeader } from "@/components/site-header"
import { StudentReviews } from "@/components/student-reviews"
import { SkillLabHero } from "@/components/skill-lab-hero"
import { LearningBeyond } from "@/components/learning-beyond"
import { LearningOptions } from "@/components/learning-options"
import { QuestionsBand } from "@/components/questions-band"
import { SiteFooter } from "@/components/site-footer"
import { WhatYouLearn } from "@/components/what-you-learn"
import { WhyEduvert } from "@/components/why-eduvert"

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <SkillLabHero />
        <ExploreCourses />
        <WhyEduvert />
        <LearningBeyond />
        <WhatYouLearn />
        <StudentReviews />
        <WallOfWins />
        <CareerPreparation />
        <LearningOptions />
        <CourseFaq />
        <QuestionsBand />
      </main>
      <SiteFooter />
    </>
  )
}
