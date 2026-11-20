import { programFeeSummary, programFees } from "@/components/program-fees"
import { dataCourseHref, demoHref, flagshipProgramHref, semCourseHref, seoCourseHref, smmCourseHref } from "@/components/site-nav"

export const flagshipCourse: FlagshipCourse = {
  eyebrow: "01 / FLAGSHIP PROGRAM",
  title: "Professional Digital Marketing Program with AI",
  duration: "4 Months · 120+ Hours",
  fee: programFees.flagship.base,
  feeNote: programFees.flagship.note,
  feeCaption: programFees.flagship.caption,
  highlightsLabel: "PROGRAM HIGHLIGHTS",
  highlights: [
    "80+ Tools Covered",
    "Live Projects & Capstone",
    "AI-Powered Tools",
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
    duration: "4–5 Weeks",
    fee: programFees.seo.base,
    feeNote: programFees.seo.note,
    feeCaption: programFees.seo.caption,
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
    duration: "4–5 Weeks",
    fee: programFees.sem.base,
    feeNote: programFees.sem.note,
    feeCaption: programFees.sem.caption,
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
    tone: "soft-blue",
    duration: "4–5 Weeks",
    fee: programFees.smm.base,
    feeNote: programFees.smm.note,
    feeCaption: programFees.smm.caption,
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
    fee: programFees.data.base,
    feeNote: programFees.data.note,
    feeCaption: programFees.data.caption,
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
    duration: "4 months · 120+ hours",
    fee: programFees.flagship.line,
    feeTotal: programFees.flagship.total,
    href: flagshipProgramHref,
    emphasis: true,
  },
  {
    name: "Advanced SEO Course",
    suitedFor: "Website owners and marketers focused on organic traffic",
    duration: "4–5 weeks",
    fee: programFees.seo.line,
    feeTotal: programFees.seo.total,
    href: seoCourseHref,
  },
  {
    name: "SEM & Performance Marketing",
    suitedFor: "Learners focused on paid customer acquisition",
    duration: "4–5 weeks",
    fee: programFees.sem.line,
    feeTotal: programFees.sem.total,
    href: semCourseHref,
  },
  {
    name: "Social Media Marketing",
    suitedFor: "Content creators and social media marketers",
    duration: "4–5 weeks",
    fee: programFees.smm.line,
    feeTotal: programFees.smm.total,
    href: smmCourseHref,
  },
  {
    name: "Data Analytics with Python & Excel",
    suitedFor: "Learners who want to work with data in Python and Excel",
    duration: "30 hours",
    fee: programFees.data.line,
    feeTotal: programFees.data.total,
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
    question: "What are the fees, and is EMI available?",
    answer: `${programFeeSummary} Call +91 96196 78085 or email communication@eduvert.co to ask about upcoming batches.`,
  },
]

export const focusLinks: FocusLink[] = [
  { href: "#complete-program", number: "01", label: "Complete digital marketing program" },
  { href: "#focused-courses", number: "02–04", label: "Focused marketing courses" },
  { href: "#data-analytics", number: "05", label: "Data analytics course" },
]

export const programSteps: ProgramStep[] = [
  {
    title: "Plan and create",
    detail: "Use AI to draft blog posts, ads, and social content. Build a campaign plan around audience segments and practise tailoring messages for each group.",
  },
  {
    title: "Run and improve campaigns",
    detail: "Work on live business campaigns and simulations. Apply SEO and social media tactics, optimise paid ads with AI, and use campaign data to decide what to change.",
  },
  {
    title: "Build a capstone strategy",
    detail: "Bring research, content, promotion, and measurement together in a complete digital marketing strategy you can discuss in a portfolio or interview.",
  },
]

export const curriculumModules: CurriculumModule[] = [
  {
    number: "01",
    name: "Search Engine Optimization, AEO & GEO",
    outcome: "Find ways to improve how a site appears in search and AI answers.",
    detail: "Audit a website, research what customers search for, and improve pages for organic and local search. Explore how structured content helps search engines, answer engines, and generative AI systems understand and surface it.",
    topics: "On-page, off-page, and technical SEO · Structured data · Local SEO · Semrush · Ahrefs",
  },
  {
    number: "02",
    name: "Search Engine Marketing & Performance Marketing",
    outcome: "Build a paid search campaign and track what turns into a lead.",
    detail: "Build paid campaigns from keyword selection and ad copy through bidding and conversion tracking. Use performance data and AI-assisted optimisation to refine targeting and improve results.",
    topics: "Google Ads · Microsoft Advertising (Bing Ads) · Conversion tracking · Bidding",
  },
  {
    number: "03",
    name: "Advanced Social Media Marketing",
    outcome: "Plan platform-specific content and measure engagement.",
    detail: "Build a social strategy, plan a content calendar, and adapt posts and paid creative to each platform. Review engagement and campaign performance to decide what to test next.",
    topics: "Meta · Instagram · LinkedIn · X · Canva · Social performance reporting",
  },
  {
    number: "04",
    name: "Social Media Optimization & AI Automation",
    outcome: "Use AI to personalise content and automate repeatable work.",
    detail: "Use AI to draft and adapt social posts and creative, personalise messages for different audiences, and automate repeatable marketing tasks. Explore how chatbots handle common enquiries.",
    topics: "AI content creation · Audience segmentation · Personalisation · Chatbots",
  },
  {
    number: "05",
    name: "Email Marketing & Automation",
    outcome: "Build an email campaign and test variations.",
    detail: "Create email campaigns and automated follow-ups for different audience segments. Test subject lines or content variations and use the results to improve future sends.",
    topics: "Mailchimp · Email templates · Audience segmentation · A/B testing",
  },
  {
    number: "06",
    name: "Web Analytics & Heatmaps",
    outcome: "Set up tracking and interpret campaign reports and heatmaps.",
    detail: "Set up tracking, read campaign and website reports, and use heatmaps to see how people interact with a page. Explore predictive analytics as a way to inform campaign decisions.",
    topics: "Google Analytics 4 · Google Tag Manager · Microsoft Clarity · Hotjar",
  },
  {
    number: "07",
    name: "Mobile Marketing with WhatsApp & Shopify",
    outcome: "Plan a mobile customer journey across WhatsApp and Shopify.",
    detail: "Explore how WhatsApp and a Shopify store can support a mobile customer journey. Plan mobile-friendly campaigns and follow-ups from first contact through to a purchase.",
    topics: "WhatsApp Business · Shopify · Mobile campaign planning",
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
    title: "Career counselling and portfolio support",
    detail: "Discuss roles that fit your goals and get guidance on using campaign work and your capstone to build a portfolio and résumé.",
  },
  {
    title: "Interview preparation",
    detail: "Practise in mock interviews and learn to explain your campaign decisions, the tools you used, and what the results showed.",
  },
  {
    title: "Job opportunities and referrals",
    detail: "Get access to job opportunities and support with referrals for relevant roles in digital marketing.",
  },
]

export const flagshipQuestions: FaqItem[] = [
  {
    id: "beginner",
    question: "Do I need prior experience?",
    answer:
      "No prior experience is required. Beginners start with core digital marketing concepts, while working professionals can build on existing skills with AI tools and practical campaign work.",
  },
  {
    id: "business-owners",
    question: "Is the program suitable for business owners?",
    answer:
      "Yes. Business owners can use the training to plan campaigns, reach relevant audiences, automate follow-ups, and measure what is working for their own business.",
  },
  {
    id: "included",
    question: "What does the four-month AI digital marketing program cover?",
    answer:
      "The program covers SEO, AEO and GEO, paid advertising, social media, email automation, web analytics, and mobile marketing. You’ll apply AI to content creation, audience targeting, campaign optimisation, and performance analysis across the course.",
  },
  {
    id: "ai-training",
    question: "How will I use AI during the course?",
    answer:
      "You’ll apply AI to draft content, segment customers, personalise campaigns, optimise ads, and automate repetitive tasks. You’ll also explore chatbots and how predictive analytics can inform campaign decisions.",
  },
  {
    id: "practical-work",
    question: "What kind of hands-on work will I do?",
    answer:
      "You’ll work on live business campaigns, practise SEO and social media strategies, run paid ads, and review performance. For the capstone, you’ll combine what you learned into a complete digital marketing strategy.",
  },
  {
    id: "ai-tools",
    question: "What kinds of AI tools will I learn to use?",
    answer:
      "You’ll work with AI tools for content creation, analytics, marketing automation, and campaign optimisation. Assignments focus on applying them to marketing tasks and interpreting the results.",
  },
  {
    id: "certificate",
    question: "Will I receive a certificate?",
    answer:
      "Yes. You receive a certificate after successfully completing the program.",
  },
  {
    id: "career-support",
    question: "What placement assistance is available?",
    answer:
      "EduVert offers career counselling, résumé and portfolio guidance, mock interviews, and access to relevant job opportunities and referrals.",
  },
  {
    id: "career-paths",
    question: "What roles can I pursue after the course?",
    answer:
      "Possible paths include digital marketing executive, SEO specialist, social media manager, PPC specialist, content strategist, and AI marketing specialist.",
  },
  {
    id: "job-market",
    question: "How can the program help me show employers what I can do?",
    answer:
      "Live campaign work and the capstone give you examples to discuss in an interview. You can show how you chose an audience, built a campaign, measured results, and used AI to improve your work.",
  },
  {
    id: "live-online",
    question: "Can I study in a classroom or live online?",
    answer:
      "Yes. Attend classroom sessions in Navi Mumbai or join live online. Both formats include interactive sessions, hands-on assignments, and mentor support.",
  },
  {
    id: "fees-batches",
    question: "What is the fee, and is EMI available?",
    answer: `${programFees.flagship.detail} Ask about the next batch when you book a demo or talk to a counsellor.`,
  },
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
  feeNote: string
  feeCaption: string
  highlightsLabel: string
  highlights: string[]
  href: string
  action: string
}

export interface FocusedCourse {
  id: "seo" | "sem" | "smm" | "data"
  eyebrow: string
  title: string
  tone: "blue" | "white" | "soft-blue"
  duration: string
  fee: string
  feeNote: string
  feeCaption: string
  highlights: string[]
  href: string
  external?: boolean
}

export interface ComparedProgram {
  name: string
  suitedFor: string
  duration: string
  fee: string
  feeTotal: string
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
  outcome: string
  detail: string
  topics: string
}

export interface ProgramBatch {
  name: string
  days: string
  time: string
}

export interface CareerStep {
  title: string
  detail: string
}
