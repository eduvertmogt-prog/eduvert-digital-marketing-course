import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CourseDetailPage } from "@/components/courses/course-detail-page"
import { getCourseBySlug } from "@/components/courses/course-data"

const course = getCourseBySlug("sem-course")

export const metadata: Metadata = {
  title: course ? `${course.title} · EduVert` : "EduVert",
  description: course?.description,
}

export default function SemCoursePage() {
  if (!course) notFound()
  return <CourseDetailPage course={course} />
}
