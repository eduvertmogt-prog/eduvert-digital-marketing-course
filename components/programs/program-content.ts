import { dataCourseHref, demoHref, flagshipProgramHref, semCourseHref, seoCourseHref, smmCourseHref } from "@/components/site-nav"

export const flagshipCourse: FlagshipCourse = {
  eyebrow: "01 / FLAGSHIP PROGRAM",
  title: "Professional Digital Marketing Program",
  duration: "120+ Hours",
  fee: "Enquire for Fees",
  highlightsLabel: "PROGRAM HIGHLIGHTS",
  highlights: [
    "80+ Tools Covered",
    "Live Projects & Capstone",
    "6+ Certifications",
    "Small Batches: 5–8 Students",
    "Placement Assistance",
  ],
  href: flagshipProgramHref,
  action: "View Program",
}

export const focusedCourses: FocusedCourse[] = [
  {
    id: "seo",
    eyebrow: "02 / FOCUSED COURSE",
    title: "Advanced SEO Course",
    tone: "blue",
    highlights: [
      "Keyword Research",
      "Technical & On-Page SEO",
      "Off-Page & Local SEO",
      "Website Audits",
      "Google Search Console & SEO Tools",
    ],
    href: seoCourseHref,
  },
  {
    id: "sem",
    eyebrow: "03 / FOCUSED COURSE",
    title: "SEM & Performance Marketing",
    tone: "white",
    highlights: [
      "Search Advertising",
      "Keyword Targeting & Bidding",
      "Campaign Optimization",
      "Conversion Tracking",
      "Remarketing & Performance Reporting",
    ],
    href: semCourseHref,
  },
  {
    id: "smm",
    eyebrow: "04 / FOCUSED COURSE",
    title: "Social Media Marketing",
    tone: "magenta",
    highlights: [
      "Social Media Strategy",
      "Facebook & Instagram Marketing",
      "Meta Advertising",
      "Content Planning",
      "Performance Analytics",
    ],
    href: smmCourseHref,
  },
  {
    id: "data",
    eyebrow: "05 / FOCUSED COURSE",
    title: "Data Analytics with Python & Excel",
    tone: "blue",
    duration: "30 Hours",
    highlights: [
      "Python & Excel Fundamentals",
      "NumPy & Pandas",
      "Data Cleaning",
      "Data Visualization",
      "Practical Assessment",
    ],
    href: dataCourseHref,
  },
]

export const comparedPrograms: ComparedProgram[] = [
  {
    name: "Professional Digital Marketing Program",
    suitedFor: "Learners seeking a broad marketing foundation",
    skill: "Plan and measure campaigns",
    duration: "120+ hours",
    href: flagshipProgramHref,
    emphasis: true,
  },
  {
    name: "Advanced SEO Course",
    suitedFor: "Website owners and marketers focused on organic traffic",
    skill: "Audit and optimize websites",
    href: seoCourseHref,
  },
  {
    name: "SEM & Performance Marketing",
    suitedFor: "Learners focused on paid customer acquisition",
    skill: "Build and optimize search ads",
    href: semCourseHref,
  },
  {
    name: "Social Media Marketing",
    suitedFor: "Content creators and social media marketers",
    skill: "Plan content and run Meta ads",
    href: smmCourseHref,
  },
  {
    name: "Data Analytics with Python & Excel",
    suitedFor: "Learners who want to work with data in Python and Excel",
    skill: "Clean and visualize data",
    duration: "30 hours",
    href: dataCourseHref,
  },
]

export const learningFormats: LearningFormat[] = [
  {
    eyebrow: "CLASSROOM TRAINING",
    title: "Seawoods, Navi Mumbai",
    detail: "Attend trainer-led sessions at EduVert’s Seawoods location.",
  },
  {
    eyebrow: "LIVE ONLINE LEARNING",
    title: "Live sessions from anywhere",
    detail: "Learn remotely through live sessions. Confirm availability for your program.",
  },
]

export const programQuestions: FaqItem[] = [
  {
    id: "beginners",
    question: "Which EduVert course is right for beginners?",
    answer:
      "If you want a broad introduction to digital marketing, explore the Professional Digital Marketing Program. The EduVert team can help you choose based on your goals and prior experience.",
  },
  {
    id: "online",
    question: "Can I attend classes online?",
    answer:
      "Yes. You can attend classroom sessions in Seawoods, Navi Mumbai, or join live online sessions. Confirm availability for your program.",
  },
  {
    id: "practical",
    question: "Are the courses practical?",
    answer: "Yes. Courses include hands-on assignments, practical projects, and trainer guidance.",
  },
  {
    id: "placement",
    question: "Do you offer placement assistance?",
    answer:
      "The Professional Digital Marketing Program includes placement assistance, with resume support, mock interview sessions, and job referrals. Placement assistance does not guarantee employment.",
  },
  {
    id: "fees",
    question: "How can I enquire about fees and upcoming batches?",
    answer:
      "Book a free demo or talk to our counsellor about fees and upcoming batches. You can also call +91 96196 78085 or email communication@eduvert.co.",
  },
]

export const focusLinks: FocusLink[] = [
  { href: "#complete-program", number: "01", label: "Complete digital marketing program" },
  { href: "#focused-courses", number: "02–04", label: "Focused marketing courses" },
  { href: "#data-analytics", number: "05", label: "Data analytics course" },
]

export const programSteps: ProgramStep[] = [
  {
    title: "Plan and build",
    detail: "Develop a campaign plan, create marketing assets, and set up tracking.",
  },
  {
    title: "Run and measure",
    detail: "Work on campaigns and use analytics to understand what is working.",
  },
  {
    title: "Complete a capstone",
    detail: "Bring the skills together in a practical capstone project.",
  },
]

export const curriculumModules: CurriculumModule[] = [
  {
    number: "01",
    name: "Analytics & Heatmaps",
    title: "Web Analytics, Digital Analytics & Heatmaps",
    tools: "Google Analytics 4 (GA4) · Google Tag Manager · Microsoft Clarity · Hotjar",
  },
  {
    number: "02",
    name: "Social Media & AI",
    title: "Advanced Social Media Marketing & AI Automation",
    tools: "Meta · Instagram · LinkedIn · X · Canva · AI Video",
  },
  {
    number: "03",
    name: "Paid Search & Performance",
    title: "Search Engine Marketing",
    tools: "Google Ads (Search, Display, Video, Merchant Center) · Bing Ads",
  },
  {
    number: "04",
    name: "Email & Automation",
    title: "Email Marketing & Automation",
    tools: "HTML/Text Templates · A/B Testing · CAN-SPAM · Mailchimp",
  },
  {
    number: "05",
    name: "Mobile Marketing",
    tools: "SMS · QR Codes · WhatsApp Business & Chatbots · App Marketing",
  },
  {
    number: "06",
    name: "Advanced SEO, AEO & GEO",
    title: "Advanced SEO: AEO, GEO & AI/LLM SEO",
    tools: "On-page SEO · Off-page SEO · Technical SEO · Schema · E-E-A-T · Local SEO",
  },
  {
    number: "07",
    name: "Live Projects & Capstone",
    title: "Live Projects & Capstone Project",
    tools: "Practical project work · Capstone project",
  },
]

export const programBatches: ProgramBatch[] = [
  { name: "Weekday Morning", days: "Mon / Wed / Fri", time: "8:00–10:00 AM" },
  { name: "Weekday Late Morning", days: "Mon / Wed / Fri", time: "10:00 AM–12:00 PM" },
  { name: "Weekday Afternoon", days: "Mon / Wed / Fri", time: "2:30–4:30 PM" },
  { name: "Weekday Evening", days: "Mon / Wed / Thu", time: "7:00–9:00 PM" },
  { name: "Sunday", days: "Sunday", time: "11:00 AM–3:00 PM" },
]

export const careerSteps: CareerStep[] = [
  {
    number: "01",
    title: "Resume guidance",
    detail: "Present your skills and practical project experience clearly.",
  },
  {
    number: "02",
    title: "Mock interviews",
    detail: "Practise talking through your work and answering interview questions.",
  },
  {
    number: "03",
    title: "Job referrals",
    detail: "Get support with referrals for relevant opportunities.",
  },
]

export const flagshipQuestions: FaqItem[] = [
  {
    id: "beginner",
    question: "Can I take this program as a beginner?",
    answer:
      "Yes. The program covers digital marketing fundamentals and builds toward hands-on campaign work and a capstone project.",
  },
  {
    id: "live-online",
    question: "Can I attend live online?",
    answer: "Yes. You can join live online sessions or attend classroom sessions in Seawoods, Navi Mumbai.",
  },
  {
    id: "practical-work",
    question: "What kind of practical work will I do?",
    answer:
      "You will plan and build campaigns, create marketing assets, set up tracking, measure results, and complete a capstone project.",
  },
  {
    id: "career-support",
    question: "What career support is available?",
    answer:
      "The program includes resume guidance, mock interviews, and job referrals. EduVert provides placement assistance. Employment is not guaranteed.",
  },
  {
    id: "fees-batches",
    question: "How can I check fees, EMI and batch availability?",
    answer:
      "Book a free demo or talk to our counsellor about current program fees, EMI options, and upcoming batches.",
  },
]

export const programStats: ProgramStat[] = [
  { value: "120+", label: "Hours of training" },
  { value: "80+", label: "Tools covered" },
  { value: "5–8", label: "Students per batch" },
  { value: "6+", label: "Certifications" },
]

export const counsellorActions = {
  demoHref,
  demoLabel: "Book a Free Demo",
  talkLabel: "Talk to Our Counsellor",
}

export interface FlagshipCourse {
  eyebrow: string
  title: string
  duration: string
  fee: string
  highlightsLabel: string
  highlights: string[]
  href: string
  action: string
}

export interface FocusedCourse {
  id: string
  eyebrow: string
  title: string
  tone: "blue" | "white" | "magenta"
  duration?: string
  highlights: string[]
  href: string
  external?: boolean
}

export interface ComparedProgram {
  name: string
  suitedFor: string
  skill: string
  duration?: string
  href: string
  external?: boolean
  emphasis?: boolean
}

export interface LearningFormat {
  eyebrow: string
  title: string
  detail: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface FocusLink {
  href: string
  number: string
  label: string
}

export interface ProgramStep {
  title: string
  detail: string
}

export interface CurriculumModule {
  number: string
  name: string
  title?: string
  tools: string
}

export interface ProgramBatch {
  name: string
  days: string
  time: string
}

export interface CareerStep {
  number: string
  title: string
  detail: string
}

export interface ProgramStat {
  value: string
  label: string
}
