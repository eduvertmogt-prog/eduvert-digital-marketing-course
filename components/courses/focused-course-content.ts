interface FocusedCourseContent {
  outcome: string
  demoLabel?: string
  example: string
  tasks: string[]
  comparison: { question: string; answer: string }[]
}

export const focusedCourseContent: Record<string, FocusedCourseContent> = {
  "seo-course-in-navi-mumbai": {
    demoLabel: "Start Your SEO Journey",
    outcome: "Audit a website, identify what’s holding it back in search, and decide which fixes to prioritise.",
    example: "Audit a local business website",
    tasks: ["Find relevant search terms and review page titles and content.", "Check site structure, backlinks, and visibility on Google Maps.", "Use Search Console to decide what to measure after the fixes."],
    comparison: [
      { question: "Will I practise with a website audit?", answer: "Work through website audits and apply on-page and off-page techniques to practical SEO work." },
      { question: "Does it cover technical and local SEO?", answer: "Review site architecture and technical SEO fundamentals, then work on Google Business listings and Maps visibility." },
      { question: "Which tools will I use?", answer: "Explore Google Search Console, Keyword Planner, Ahrefs, Semrush, and Ubersuggest for research and measurement." },
      { question: "Is a certificate included?", answer: "EduVert provides an SEO course certificate upon successful completion." },
    ],
  },
  "sem-course": {
    demoLabel: "Start Your SEM Journey",
    outcome: "Build a Google Ads search campaign and use conversion data to decide what to improve.",
    example: "Plan a paid search campaign for enquiries",
    tasks: ["Choose search keywords, write ads, and define the target audience.", "Plan a bid and budget, then decide what to A/B test.", "Use conversion and performance data to evaluate the campaign."],
    comparison: [
      { question: "Will I practise building a Google Ads campaign?", answer: "Practise keyword research, ad copy, targeting, bidding, and budget management in campaign exercises, live projects, and case studies." },
      { question: "Will I learn to measure conversions?", answer: "Study conversion tracking and use performance reports to decide what to optimise." },
      { question: "Does it cover testing and remarketing?", answer: "Practise A/B testing and ad optimisation, and learn how remarketing reaches previous visitors." },
    ],
  },
  "smm-course": {
    demoLabel: "Start Your SMM Journey",
    outcome: "Plan a social content calendar and build a paid campaign for Facebook and Instagram.",
    example: "Plan a social launch and a Meta Ads campaign",
    tasks: ["Build a content calendar with posts and Reels.", "Choose an audience and practise setting up Facebook and Instagram ads.", "Review engagement and campaign performance to decide what to change."],
    comparison: [
      { question: "Will I practise content planning and paid ads?", answer: "Build a content calendar, plan Reels, and work on campaign creation and audience targeting assignments." },
      { question: "Which platforms are covered?", answer: "Study strategy for Facebook, Instagram, LinkedIn, X, and YouTube. Paid social practice focuses on Facebook and Instagram." },
      { question: "Will I learn to measure results?", answer: "Review social engagement and campaign performance to assess how your content and ads are doing." },
    ],
  },
  "data-analytics-python": {
    outcome: "Clean and analyse a dataset in Excel and Python, then explain what the results show.",
    example: "Turn a sales spreadsheet into an analysis",
    tasks: ["Inspect the spreadsheet in Excel and load it into a Jupyter notebook.", "Use Pandas to clean and reshape the data.", "Chart a trend and explain what the results show."],
    comparison: [
      { question: "Will I use both Excel and Python?", answer: "Work with spreadsheets in Excel and practise Python in Jupyter, including NumPy and Pandas DataFrames." },
      { question: "What can I do with a dataset by the end?", answer: "Practise importing, cleaning, and manipulating data, creating charts, and interpreting basic statistics." },
      { question: "How is the work assessed?", answer: "The syllabus includes an assignment or project assessment. The course is introductory and welcomes learners new to programming." },
    ],
  },
}
