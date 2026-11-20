export const demoHref = "/#book-a-free-demo"
export const liveClassSectionId = "live-class-demo"
export const liveClassHref = `/#${liveClassSectionId}`
export const phoneHref = "tel:+919619678085"
export const whatsAppHref = "https://wa.me/919619678085"
export const syllabusHref = "/downloads/eduvert-digital-marketing-syllabus.pdf"

export const coursesHref = "/programs"

export const flagshipProgramHref = "/programs/professional-digital-marketing"

export const seoCourseHref = "/seo-course-in-navi-mumbai"

export const semCourseHref = "/sem-course"

export const smmCourseHref = "/smm-course"

export const dataCourseHref = "/data-analytics-python"

export const contactHref = "/contact"

export const aboutHref = "/about"

export const batchesHref = "/batches"

export const placementsHref = "/placements"

export const testimonialsHref = "/testimonials"

export const blogHref = "/blog"

export const primaryNavigation: NavItem[] = [
  { href: coursesHref, label: "Programs" },
  { href: batchesHref, label: "Batches" },
  { href: placementsHref, label: "Placements" },
  { href: testimonialsHref, label: "Testimonials" },
  { href: aboutHref, label: "About" },
  { href: blogHref, label: "Blog" },
  { href: contactHref, label: "Contact" },
]

interface NavItem {
  href: string
  label: string
}
