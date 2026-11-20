import { CourseComparison } from "@/components/courses/course-comparison"
import { programFees } from "@/components/program-fees"

const comparisonRows = [
  {
    question: "What will I build?",
    answer: "Work on live campaigns and build a complete digital marketing strategy for your capstone.",
  },
  {
    question: "Where will I use AI?",
    answer: "Apply AI to content creation, audience segmentation, ad optimisation, and marketing automation.",
  },
  {
    question: "How will classes work?",
    answer: "Four months of live instruction with 120+ training hours. Attend in Navi Mumbai or live online, in batches of 5–8 students.",
  },
  {
    question: "What career support is included?",
    answer: "Get résumé and portfolio guidance, mock interviews, and referrals for relevant opportunities.",
  },
  {
    question: "What is the total fee?",
    answer: `${programFees.flagship.total} including 18% GST. ${programFees.flagship.emiLabel}.`,
  },
]

export function FlagshipComparison() {
  return <CourseComparison id="flagship-comparison" rows={comparisonRows} />
}
