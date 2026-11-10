import type { CourseMarkName } from "@/components/course-marks"
import { dataCourseHref, flagshipProgramHref, semCourseHref, seoCourseHref, smmCourseHref } from "@/components/site-nav"

export const courseCatalog: Course[] = [
  {
    id: "flagship",
    number: "01",
    eyebrow: "01 \u00a0 / \u00a0 FLAGSHIP PROGRAM",
    title: ["Professional Digital", "Marketing Program"],
    shortName: ["Digital", "Marketing"],
    mobileName: ["Professional Digital", "Marketing Program"],
    summary: "4 Months · 120+ Hours · Classroom (Seawoods) & Live Online",
    summaryLines: ["4 Months · 120+ Hours", "Classroom (Seawoods) & Live Online"],
    duration: "4 Months · 120+ Hours",
    price: "₹44,000",
    priceNote: "+ 18% GST",
    priceCaption: "EMI Option Available",
    highlights: [
      { label: "80+ Tools Covered" },
      { label: "Live Projects & Capstone", mobileLabel: "Live Projects" },
      { label: "6+ Certifications" },
      { label: "5–8 Students Per Batch" },
      { label: "Placement Assistance" },
    ],
    href: flagshipProgramHref,
    tone: "magenta",
    mark: "flagship",
  },
  {
    id: "seo",
    number: "02",
    eyebrow: "02 \u00a0 / \u00a0 SEO",
    title: ["Advanced SEO,", "AEO & GEO"],
    shortName: ["SEO"],
    mobileName: ["Advanced SEO, AEO & GEO"],
    summary: "4–5 Weeks",
    summaryLines: ["4–5 Weeks"],
    duration: "4–5 Weeks",
    description:
      "Learn to improve search visibility through keyword research, website optimization, technical SEO and practical audits.",
    price: "Enquire for Fees",
    highlights: [
      { label: "Keyword Research & Competitor Analysis" },
      { label: "On-Page & Technical SEO" },
      { label: "Off-Page & Local SEO" },
      { label: "Website Audits & Live Practice" },
      { label: "Google Search Console, Ahrefs & SEMrush" },
    ],
    href: seoCourseHref,
    tone: "blue",
    mark: "seo",
  },
  {
    id: "sem",
    number: "03",
    eyebrow: "03 \u00a0 / \u00a0 SEM",
    title: ["SEM & Performance", "Marketing"],
    shortName: ["SEM"],
    mobileName: ["SEM & Performance Marketing"],
    summary: "4–5 Weeks",
    summaryLines: ["4–5 Weeks"],
    duration: "4–5 Weeks",
    description:
      "Learn to create, manage and optimize paid search campaigns using targeting, bidding, tracking and performance analysis.",
    price: "Enquire for Fees",
    highlights: [
      { label: "Google Ads & Bing Ads" },
      { label: "Keyword Research & Ad Creation" },
      { label: "Audience Targeting & Bid Strategies" },
      { label: "A/B Testing & Campaign Optimization" },
      { label: "Conversion Tracking & Remarketing" },
    ],
    href: semCourseHref,
    tone: "yellow",
    mark: "sem",
  },
  {
    id: "smm",
    number: "04",
    eyebrow: "04 \u00a0 / \u00a0 SMM",
    title: ["Social Media Marketing", "& Meta Ads"],
    shortName: ["SMM"],
    mobileName: ["Social Media Marketing", "& Meta Ads"],
    summary: "4–5 Weeks",
    summaryLines: ["4–5 Weeks"],
    duration: "4–5 Weeks",
    description:
      "Develop social media strategies, create engaging content and manage paid campaigns across major platforms.",
    price: "Enquire for Fees",
    highlights: [
      { label: "Facebook & Instagram Marketing" },
      { label: "Meta Ads & Audience Targeting" },
      { label: "Content Planning & Reels Strategy" },
      { label: "LinkedIn, X & YouTube Marketing" },
      { label: "Live Campaigns & Performance Analytics" },
    ],
    href: smmCourseHref,
    tone: "blush",
    mark: "smm",
  },
  {
    id: "data-analytics",
    number: "05",
    eyebrow: "05 \u00a0 / \u00a0 DATA ANALYTICS",
    title: ["Data Analytics with", "Python & Excel"],
    shortName: ["Data", "Analytics"],
    mobileName: ["Data Analytics with", "Python & Excel"],
    summary: "30 Hours",
    summaryLines: ["30 Hours"],
    duration: "30 Hours",
    description:
      "Build foundational data analysis skills using Python and Excel, from data cleaning to visualization and interpretation.",
    price: "Enquire for Fees",
    highlights: [
      { label: "Excel for Data Analysis" },
      { label: "Python Fundamentals & Jupyter" },
      { label: "NumPy & Pandas" },
      { label: "Data Cleaning & Manipulation" },
      { label: "Data Visualization & Project Assessment" },
    ],
    href: dataCourseHref,
    tone: "slate",
    mark: "data",
  },
]

export const courseTones = {
  magenta: {
    rail: "bg-eduvert-tint-magenta",
    open: "border-[#ebcfe3] bg-eduvert-tint-magenta",
    rule: "border-[#ebcfe3]",
    fill: "bg-[#ebcfe3]",
  },
  blue: {
    rail: "bg-eduvert-tint-blue",
    open: "border-eduvert-border-subtle bg-eduvert-tint-blue",
    rule: "border-eduvert-border-subtle",
    fill: "bg-eduvert-border-subtle",
  },
  yellow: {
    rail: "bg-eduvert-tint-yellow",
    open: "border-eduvert-border-subtle bg-eduvert-tint-yellow",
    rule: "border-eduvert-border-subtle",
    fill: "bg-eduvert-border-subtle",
  },
  blush: {
    rail: "bg-[#fcf0f8]",
    open: "border-eduvert-border-subtle bg-[#fcf0f8]",
    rule: "border-eduvert-border-subtle",
    fill: "bg-eduvert-border-subtle",
  },
  slate: {
    rail: "bg-[#f1f4f8]",
    open: "border-eduvert-border-subtle bg-[#f1f4f8]",
    rule: "border-eduvert-border-subtle",
    fill: "bg-eduvert-border-subtle",
  },
}

interface CourseHighlight {
  label: string
  mobileLabel?: string
}

export interface Course {
  id: string
  number: string
  eyebrow: string
  title: string[]
  shortName: string[]
  mobileName: string[]
  summary: string
  summaryLines: string[]
  duration: string
  description?: string
  price: string
  priceNote?: string
  priceCaption?: string
  highlights: CourseHighlight[]
  href: string
  tone: keyof typeof courseTones
  mark: CourseMarkName
}
