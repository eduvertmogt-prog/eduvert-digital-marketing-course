/**
 * Short metadata lives here — NOT in shorts.tsx. Plain data must stay in
 * a server-safe module: shorts-strip.tsx renders on the server and
 * importing a value from a "use client" file arrives as undefined
 * at runtime (only components cross that boundary).
 */

export interface ShortItem {
  id: string
  label: string
  title: string
}

export const shorts: ShortItem[] = [
  {
    id: "_9crOuDXJy4",
    label: "Course Overview & Student Feedback",
    title: "Explore Digital Marketing Excellence | Course Overview and Student Feedback",
  },
  {
    id: "_K4dRHGwIaI",
    label: "Student Success Stories",
    title: "Professional Digital Marketing Course: Student Success Stories | Eduvert Institute",
  },
  {
    id: "EQOAhg6z_UA",
    label: "Asma Dawnak's Story",
    title: "Student Success Stories at Eduvert Institute | Student Testimonial (Asma Dawnak)",
  },
  {
    id: "28qywg6u-W8",
    label: "Sapna Surana's Perspective",
    title: "Digital Marketing Course: The Student's Perspective (Sapna Surana)",
  },
]
