import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CourseDetailPage } from "@/components/courses/course-detail-page"
import { getCourseBySlug } from "@/components/courses/course-data"

const course = getCourseBySlug("seo-course-in-navi-mumbai")

export const metadata: Metadata = {
  title: course ? `${course.title} · EduVert` : "EduVert",
  description: course?.description,
}

export default function SeoCoursePage() {
  if (!course) notFound()
  return <CourseDetailPage course={course} />
}
