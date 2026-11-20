import { CourseList } from "@/components/course-list"

export function ExploreCourses() {
  return (
    <section id="programs" aria-labelledby="explore-courses-heading" className="border-t border-eduvert-border-subtle bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[18px] px-6 pt-12 pb-10 min-[1100px]:gap-[27px] min-[1100px]:px-10 min-[1100px]:pt-12 min-[1100px]:pb-14 min-[1440px]:px-16">
        <div className="flex flex-col gap-3 min-[1100px]:flex-row min-[1100px]:items-end min-[1100px]:justify-between">
          <div className="flex flex-col gap-2">
            <h2 id="explore-courses-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
              Explore Our Courses
            </h2>
            <p className="eduvert-body text-eduvert-text-secondary min-[1100px]:eduvert-body-large">
              Choose a complete program or a focused course in the skills you want to learn.
            </p>
          </div>
          <p className="eduvert-support font-eduvert-500 text-eduvert-text-secondary">
            <span className="min-[1100px]:hidden">Tap a course to expand it</span>

          </p>
        </div>
        <CourseList />
      </div>
    </section>
  )
}
