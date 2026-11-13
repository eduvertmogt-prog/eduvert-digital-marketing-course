import type { CourseMarkName } from "@/components/course-marks"
import { programFees } from "@/components/program-fees"
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
    price: programFees.flagship.base,
    priceNote: programFees.flagship.note,
    priceCaption: programFees.flagship.caption,
    highlights: [
      { label: "80+ Tools Covered" },
      { label: "Live Projects & Capstone", mobileLabel: "Live Projects" },
      { label: "6+ Certifications" },
      { label: "5–8 Students Per Batch" },
      { label: "Placement Assistance" },
    ],
    href: flagshipProgramHref,
    tone: "soft-blue",
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
    price: programFees.seo.base,
    priceNote: programFees.seo.note,
    priceCaption: programFees.seo.caption,
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
    price: programFees.sem.base,
    priceNote: programFees.sem.note,
    priceCaption: programFees.sem.caption,
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
    price: programFees.smm.base,
    priceNote: programFees.smm.note,
    priceCaption: programFees.smm.caption,
    highlights: [
      { label: "Facebook & Instagram Marketing" },
      { label: "Meta Ads & Audience Targeting" },
      { label: "Content Planning & Reels Strategy" },
      { label: "LinkedIn, X & YouTube Marketing" },
      { label: "Live Campaigns & Performance Analytics" },
    ],
    href: smmCourseHref,
    tone: "warm",
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
    price: programFees.data.base,
    priceNote: programFees.data.note,
    priceCaption: programFees.data.caption,
    highlights: [
      { label: "Excel for Data Analysis" },
      { label: "Python Fundamentals & Jupyter" },
      { label: "NumPy & Pandas" },
      { label: "Data Cleaning & Manipulation" },
      { label: "Data Visualization & Project Assessment" },
    ],
    href: dataCourseHref,
    tone: "white",
    mark: "data",
  },
]

export const courseTones = {
  "soft-blue": {
    rail: "bg-eduvert-tint-soft-blue",
    open: "border-eduvert-border-subtle bg-eduvert-tint-soft-blue",
    rule: "border-eduvert-border-subtle",
    fill: "bg-eduvert-border-subtle",
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
  warm: {
    rail: "bg-eduvert-canvas-warm",
    open: "border-eduvert-border-subtle bg-eduvert-canvas-warm",
    rule: "border-eduvert-border-subtle",
    fill: "bg-eduvert-border-subtle",
  },
  white: {
    rail: "bg-eduvert-surface-white",
    open: "border-eduvert-border-subtle bg-eduvert-surface-white",
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
