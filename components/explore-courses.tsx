import { CourseList } from "@/components/course-list"

export function ExploreCourses() {
  return (
    <section id="programs" aria-labelledby="explore-courses-heading" className="border-t border-eduvert-border-subtle bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[18px] px-6 py-12 min-[1100px]:gap-[27px] min-[1100px]:p-10 min-[1440px]:p-16">
        <div className="flex flex-col gap-3 min-[1100px]:flex-row min-[1100px]:items-end min-[1100px]:justify-between">
          <div className="flex flex-col gap-2">
            <h2 id="explore-courses-heading" className="text-[30px] leading-9 font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-[40px] min-[1100px]:leading-[48px]">
              Explore Our Courses
            </h2>
            <p className="text-[16px] leading-6 text-eduvert-text-secondary min-[1100px]:text-[18px] min-[1100px]:leading-[27px]">
              Choose a complete program or a focused course in the skills you want to learn.
            </p>
          </div>
          <p className="text-[12px] leading-[18px] font-eduvert-500 text-eduvert-text-secondary min-[1100px]:text-[13px]">
            <span className="min-[1100px]:hidden">Tap a course to expand it</span>
            <span className="hidden min-[1100px]:inline">Select a course to expand it. One course opens at a time.</span>
          </p>
        </div>
        <CourseList />
      </div>
    </section>
  )
}
