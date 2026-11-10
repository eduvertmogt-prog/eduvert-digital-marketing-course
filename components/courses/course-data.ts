/**
 * EduVert course-detail content for the approved sitemap.
 * Research source: public EduVert course pages, checked 2026-11-09.
 * Curriculum entries group published topics. They are not official module numbers.
 * Internal review notes stay out of this file so they cannot render on the site.
 */

export type CourseHeroVisual =
  | "learning-studio"
  | "search-workspace"
  | "paid-campaign-studio"
  | "social-content-studio"
  | "data-analysis-studio"

export interface CourseCurriculumGroup {
  title: string
  topics: string[]
}

export interface CourseFaq {
  question: string
  answer: string
}

export interface CourseTool {
  name: string
  detail: string
}

export interface Course {
  slug: string
  path: string
  sourceUrl: string
  title: string
  eyebrow: string
  description: string
  heroVisual: CourseHeroVisual
  duration: string | null
  price: string | null
  learningMode: string | null
  highlights: string[]
  curriculum: CourseCurriculumGroup[]
  practicalWork: string[]
  audience: string[]
  tools: CourseTool[]
  enquiryPoints: string[]
  faqs: CourseFaq[]
  ctaLabel: string
}

export const courses: Course[] = [
  {
    slug: "digital-marketing",
    path: "/digital-marketing/",
    sourceUrl: "https://www.eduvert.co/digital-marketing/",
    title: "Professional Digital Marketing Program",
    eyebrow: "FLAGSHIP PROGRAM",
    description:
      "Learn digital marketing through hands-on campaigns, analytics, practical assignments, and live projects covering social media, paid search, SEO, email, and mobile marketing.",
    heroVisual: "learning-studio",
    duration: "120+ hours",
    price: "₹44,000 + 18% GST",
    learningMode: "Classroom and live online options",
    highlights: [
      "Hands-on live campaigns and projects",
      "80+ digital marketing and AI tools covered",
      "6+ certifications advertised",
      "Live projects and capstone work",
      "Resume guidance, mock interviews, and job referrals",
    ],
    curriculum: [
      {
        title: "Web Analytics & Heatmaps",
        topics: ["Google Analytics 4", "Google Tag Manager", "Microsoft Clarity", "Hotjar", "Reporting and interpretation"],
      },
      {
        title: "Social Media Marketing, Meta Ads & AI",
        topics: ["Meta campaign setup and reporting", "Instagram advertising", "Content strategy", "LinkedIn and X advertising", "AI-assisted creative production"],
      },
      {
        title: "Search Engine Marketing",
        topics: ["Google Ads and Bing Ads", "Search, display and video campaigns", "Keywords, audiences and bidding", "Campaign measurement and optimization"],
      },
      {
        title: "Email Marketing & Automation",
        topics: ["Email campaign setup", "Templates and lists", "A/B testing", "Automation and reporting"],
      },
      {
        title: "Mobile Marketing",
        topics: ["Mobile advertising", "SMS marketing", "WhatsApp chatbot and automation", "Mobile analytics"],
      },
      {
        title: "Advanced SEO, AEO & GEO",
        topics: ["SEO audits", "Technical and on-page SEO", "Keyword research", "Local SEO", "Structured data", "AEO and GEO"],
      },
      {
        title: "Live Projects & Capstone",
        topics: ["Apply course techniques through live campaigns and practical projects"],
      },
    ],
    practicalWork: [
      "Build and track digital marketing campaigns",
      "Use analytics and campaign reporting tools",
      "Apply skills in live projects and capstone work",
    ],
    audience: ["Students and job seekers", "Business owners and freelancers", "Professionals developing digital marketing skills"],
    tools: [
      { name: "Google Analytics 4", detail: "Website measurement" },
      { name: "Google Tag Manager", detail: "Tag setup" },
      { name: "Google Ads", detail: "Paid search" },
      { name: "Meta Ads", detail: "Paid social" },
      { name: "Google Search Console", detail: "Search performance" },
      { name: "Canva", detail: "Creative production" },
      { name: "Microsoft Clarity", detail: "Session recordings" },
    ],
    enquiryPoints: [
      "Hands-on live campaigns and projects",
      "Live projects and capstone work",
      "Resume guidance, mock interviews, and job referrals",
    ],
    faqs: [
      {
        question: "What does the program cover?",
        answer:
          "It covers analytics, social media and Meta Ads, search advertising, email and mobile marketing, advanced SEO including AEO/GEO topics, and practical projects.",
      },
      {
        question: "Does the program include practical work?",
        answer: "Yes. EduVert describes live campaigns, practical assignments, and capstone projects as part of the training.",
      },
      {
        question: "Can I attend online or in person?",
        answer: "EduVert advertises online and offline batch options. Confirm current availability with the team.",
      },
      {
        question: "Is placement assistance available?",
        answer:
          "The institute advertises resume support, mock interviews, and job referrals. Placement assistance is not a job guarantee.",
      },
      {
        question: "How can I check fees and batches?",
        answer: "Contact EduVert to confirm the current fee, applicable taxes, batch schedule, and enrollment details.",
      },
    ],
    ctaLabel: "Book a Free Demo",
  },
  {
    slug: "seo-course-in-navi-mumbai",
    path: "/seo-course-in-navi-mumbai/",
    sourceUrl: "https://www.eduvert.co/seo-course-in-navi-mumbai/",
    title: "Advanced Search Engine Optimization (SEO) Course",
    eyebrow: "ADVANCED SEO COURSE",
    description:
      "Learn keyword research, on-page and off-page optimization, technical SEO, website audits, local SEO, and search performance analysis through practical training.",
    heroVisual: "search-workspace",
    duration: null,
    price: null,
    learningMode: null,
    highlights: [
      "Keyword and competitor research",
      "On-page and technical SEO",
      "Off-page SEO and local visibility",
      "Website audits and practical SEO work",
      "Google Search Console and SEO tools",
    ],
    curriculum: [
      { title: "Search Engine Fundamentals", topics: ["How search engines work", "Organic versus paid results", "SEO principles"] },
      { title: "Keyword Research", topics: ["Keyword Planner", "Relevant search terms", "Competitor research"] },
      { title: "On-Page SEO", topics: ["Content optimization", "Page titles and descriptions", "SEO plugins"] },
      { title: "Technical SEO & Audits", topics: ["Website architecture", "Site audits", "Technical SEO fundamentals"] },
      { title: "Off-Page SEO", topics: ["Link building", "Competitor analysis", "Website reputation"] },
      { title: "Local SEO", topics: ["Google Business listings", "Google Maps visibility", "Local search"] },
      { title: "SEO Tools & Measurement", topics: ["Google Search Console", "Ahrefs", "SEMrush", "Search performance analysis"] },
    ],
    practicalWork: ["Review websites through SEO audits", "Practice on-page and off-page techniques", "Use SEO analysis tools"],
    audience: ["Beginners exploring SEO", "Digital marketing learners", "Professionals looking to develop SEO skills"],
    tools: [
      { name: "Google Search Console", detail: "Search performance" },
      { name: "Google Keyword Planner", detail: "Keyword research" },
      { name: "Ahrefs", detail: "Backlink research" },
      { name: "SEMrush", detail: "Competitor analysis" },
      { name: "Ubersuggest", detail: "Keyword ideas" },
    ],
    enquiryPoints: [
      "Practical SEO training",
      "Website audits and real-world SEO practice",
      "Certificate upon successful completion",
    ],
    faqs: [
      {
        question: "What topics are covered?",
        answer: "Keyword research, on-page SEO, off-page SEO, technical SEO, local SEO, audits, and analytics.",
      },
      {
        question: "Is the SEO course suitable for beginners?",
        answer: "Yes. The course page says beginners and professionals interested in digital marketing can enroll.",
      },
      {
        question: "Does the course include hands-on practice?",
        answer: "Yes. EduVert describes website audits, real-world SEO campaign practice, and practical training.",
      },
      {
        question: "Which tools are introduced?",
        answer: "The course page references Google Search Console, Ahrefs, SEMrush, and keyword research tools.",
      },
      {
        question: "Will I receive a certificate?",
        answer: "EduVert states that its Advanced SEO Certification Program provides a certificate upon successful completion.",
      },
    ],
    ctaLabel: "Enquire About SEO",
  },
  {
    slug: "sem-course",
    path: "/sem-course/",
    sourceUrl: "https://www.eduvert.co/sem-course/",
    title: "SEM & Performance Marketing",
    eyebrow: "SEARCH ENGINE MARKETING",
    description:
      "Learn to create and optimize paid search campaigns using keyword research, targeting, bid management, testing, conversion tracking, and performance reporting.",
    heroVisual: "paid-campaign-studio",
    duration: "Typically 4–6 weeks; varies by batch",
    price: null,
    learningMode: null,
    highlights: [
      "Google Ads and paid search fundamentals",
      "Keywords, ad copy and targeting",
      "Bid and budget management",
      "Conversion tracking and remarketing",
      "Campaign testing and reporting",
    ],
    curriculum: [
      { title: "SEM Fundamentals", topics: ["What search engine marketing is", "How paid search campaigns work"] },
      { title: "Keywords & Ad Copy", topics: ["Keyword research", "Ad creation and messaging"] },
      { title: "Targeting & Bidding", topics: ["Audience and demographic targeting", "Bidding", "Budget management"] },
      { title: "Campaign Testing", topics: ["A/B testing", "Ad optimization"] },
      { title: "Conversion Tracking", topics: ["Conversion measurement", "Using conversion data to improve campaigns"] },
      { title: "Remarketing", topics: ["Reaching previous site visitors", "Campaign retargeting concepts"] },
      { title: "Analytics & Reporting", topics: ["Performance reporting", "Campaign analysis", "SEM best practices"] },
    ],
    practicalWork: [
      "Practice campaign creation and optimization",
      "Explore targeting and bid strategies",
      "Work with live projects and case studies",
    ],
    audience: ["Beginners interested in paid search", "Marketing professionals looking to improve SEM skills"],
    tools: [{ name: "Google Ads", detail: "Paid search campaigns" }],
    enquiryPoints: [
      "Practice campaign creation and optimization",
      "Explore targeting and bid strategies",
      "Work with live projects and case studies",
    ],
    faqs: [
      {
        question: "What topics are covered in the SEM course?",
        answer: "Google Ads, campaign management, keyword research, ad copywriting, targeting, optimization, and analytics.",
      },
      {
        question: "Is this suitable for beginners?",
        answer: "Yes. EduVert says its SEM course is designed for beginners and marketing professionals.",
      },
      {
        question: "How long does the course usually take?",
        answer: "The published FAQ says typically 4–6 weeks, depending on the batch and depth of content.",
      },
      {
        question: "What practical skills will I learn?",
        answer: "Campaign creation, bidding strategy, audience targeting, conversion tracking, performance analysis, and optimization.",
      },
      {
        question: "Does it include practical projects?",
        answer: "Yes. EduVert states that its SEM courses include live projects and case studies.",
      },
    ],
    ctaLabel: "Enquire About SEM",
  },
  {
    slug: "smm-course",
    path: "/smm-course/",
    sourceUrl: "https://www.eduvert.co/smm-course/",
    title: "Social Media Marketing & Meta Ads",
    eyebrow: "SOCIAL MEDIA MARKETING",
    description:
      "Learn social media strategy, content planning, audience targeting, paid social advertising, engagement techniques, and performance measurement.",
    heroVisual: "social-content-studio",
    duration: null,
    price: null,
    learningMode: null,
    highlights: [
      "Facebook and Instagram marketing",
      "LinkedIn, X and YouTube strategy",
      "Content calendars and Reels planning",
      "Paid ads and audience targeting",
      "Social analytics and engagement",
    ],
    curriculum: [
      { title: "Social Media Platforms", topics: ["Facebook", "Instagram", "LinkedIn", "X/Twitter", "YouTube"] },
      { title: "Content Strategy", topics: ["Content planning", "Content calendars", "Reels strategy"] },
      { title: "Paid Social Campaigns", topics: ["Facebook and Instagram paid ads", "Audience targeting", "Campaign creation"] },
      { title: "Engagement & Reporting", topics: ["Engagement tactics", "Analytics and performance review"] },
      { title: "Practical Assignments", topics: ["Campaign creation", "Content calendar building", "Target audience planning"] },
    ],
    practicalWork: ["Build content calendars", "Practice campaign creation", "Work on audience targeting assignments"],
    audience: ["Students", "Entrepreneurs", "Influencers", "Marketing professionals"],
    tools: [
      { name: "Facebook", detail: "Platform and paid ads" },
      { name: "Instagram", detail: "Reels and paid ads" },
      { name: "LinkedIn", detail: "Included platform" },
      { name: "YouTube", detail: "Included platform" },
      { name: "Canva", detail: "Course tool" },
    ],
    enquiryPoints: [
      "Campaign creation",
      "Content calendar building",
      "Target audience planning",
    ],
    faqs: [
      {
        question: "Which social platforms are included?",
        answer: "EduVert names Facebook, Instagram, LinkedIn, Twitter/X, and YouTube.",
      },
      {
        question: "What will I learn about Instagram?",
        answer: "Content planning, Reels strategy, paid ads, analytics, and engagement tactics.",
      },
      {
        question: "Who can take this course?",
        answer: "EduVert lists entrepreneurs, students, influencers, and marketing professionals.",
      },
      {
        question: "Is there practical work?",
        answer: "Yes. The course page references campaign creation, content calendar building, and audience targeting assignments.",
      },
      {
        question: "Does the course include certification?",
        answer: "EduVert describes a social media marketing certification on its course page; confirm the current issuing details with the team.",
      },
    ],
    ctaLabel: "Enquire About SMM",
  },
  {
    slug: "data-analytics-python",
    path: "/data-analytics-python/",
    sourceUrl: "https://www.eduvert.co/data-analytics-python/",
    title: "Data Analytics with Python & Excel",
    eyebrow: "DATA ANALYTICS",
    description:
      "Develop foundational data analysis skills using Python and Excel, from understanding datasets and cleaning information to visualization and basic statistical interpretation.",
    heroVisual: "data-analysis-studio",
    duration: "30 hours of topics",
    price: null,
    learningMode: null,
    highlights: [
      "Excel for data analysis",
      "Python and Jupyter fundamentals",
      "NumPy and Pandas basics",
      "Data cleaning and manipulation",
      "Visualization and assignment project",
    ],
    curriculum: [
      {
        title: "Data Analysis Foundations",
        topics: ["Overview of Python, Excel, Jupyter and data analysis", "Developing an analytical mindset"],
      },
      {
        title: "Excel & Python Basics",
        topics: ["Excel analysis", "Variables", "Data types", "Conditions", "Loops", "Functions", "Lists and tuples"],
      },
      {
        title: "Working with Data",
        topics: ["NumPy basics", "Pandas DataFrames", "Reading and writing CSV and Excel files"],
      },
      { title: "Cleaning & Manipulation", topics: ["Data cleaning", "Data manipulation"] },
      {
        title: "Visualization & Statistics",
        topics: ["Graphs and visualizations", "Descriptive and inferential statistics basics", "Correlation and simple linear regression concepts"],
      },
      { title: "Assessment", topics: ["Assignment and project"] },
    ],
    practicalWork: ["Analyze data in Excel", "Practice working with data in Python and Pandas", "Complete an assignment or project"],
    audience: ["Students new to programming", "Teachers and school leaders", "Managers", "Marketing and sales professionals", "Researchers"],
    tools: [
      { name: "Microsoft Excel", detail: "Spreadsheet analysis" },
      { name: "Python", detail: "Programming basics" },
      { name: "Jupyter", detail: "Notebook practice" },
      { name: "NumPy", detail: "Numerical data" },
      { name: "Pandas", detail: "DataFrames" },
    ],
    enquiryPoints: [
      "Analyze data in Excel",
      "Practice working with data in Python and Pandas",
      "Complete an assignment or project",
    ],
    faqs: [
      {
        question: "Is this suitable for beginners?",
        answer: "Yes. EduVert describes it as an introductory course suitable for learners with no prior programming experience.",
      },
      { question: "Which tools will I learn?", answer: "Excel, Python, Jupyter, NumPy, and Pandas are covered." },
      {
        question: "What kinds of analysis are introduced?",
        answer: "Cleaning and manipulating data, data visualization, and basic descriptive and inferential concepts.",
      },
      { question: "Is there a project?", answer: "Yes. The published syllabus includes an assignment/project assessment." },
      {
        question: "How long is the course?",
        answer: "The published syllabus is labeled 'Topics Covered in 30 Hours'. Confirm the current timetable and total duration with EduVert.",
      },
    ],
    ctaLabel: "Enquire About Data Analytics",
  },
]

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug)
}
