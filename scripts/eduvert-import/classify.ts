export interface Classification {
  kind: "alreadyExisting" | "excludedStudyAbroad" | "needsReview" | "include" | "duplicate"
  category: string
  reasons: string[]
}

export function classifyPost(input: ClassifyInput) {
  const slug = decodeSlug(input.slug)
  const title = normalizeHaystack(input.title)
  const excerpt = normalizeHaystack(input.excerpt)
  const categoryText = normalizeHaystack(input.categoryNames.join(" "))
  const categorySlugs = input.categorySlugs.map((item) => item.toLowerCase())
  const haystack = `${title} ${slug.replace(/-/g, " ")} ${excerpt}`
  const studyInCategory = categorySlugs.includes("study-abroad") || /\bstudy abroad\b/.test(categoryText)

  if (input.existingSlugs.has(slug) || input.existingTitles.has(normalizeTitle(input.title))) {
    return result("alreadyExisting", "", [`Already present as ${slug}`])
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return result("needsReview", "", ["Slug is not a plain URL slug"])
  }
  if (/\bwebinar\b/.test(haystack)) {
    return result("needsReview", "", ["Event or webinar announcement"])
  }
  if (isConfirmedStudyAbroad(haystack, slug)) {
    return result("excludedStudyAbroad", "", ["Title, slug, or excerpt matches a study-abroad rule"])
  }
  if (campusPattern.test(haystack) && topicCategory(haystack)) {
    return result("needsReview", "", ["Campus wording conflicts with a marketing topic"])
  }
  if (campusPattern.test(haystack)) {
    return result("excludedStudyAbroad", "", ["Title, slug, or excerpt matches a university or campus rule"])
  }
  if (studyInCategory && !topicCategory(haystack)) {
    return result("excludedStudyAbroad", "", ["WordPress category is Study Abroad and the title has no marketing topic"])
  }
  if (studyInCategory) {
    return result("needsReview", "", ["WordPress category is Study Abroad but the title also matches a marketing topic"])
  }

  const titleTopic = topicCategory(`${title} ${slug.replace(/-/g, " ")}`)
  const excerptTopic = topicCategory(excerpt)
  const categoryTopic = topicCategory(categoryText)
  const category = titleTopic || excerptTopic || categoryTopic
  if (!category) return result("needsReview", "", ["No deterministic marketing topic match"])
  const source = titleTopic ? "title" : excerptTopic ? "excerpt" : "category"
  return result("include", category, [`Matched ${category} from the ${source}`])
}

export function normalizeTitle(title: string) {
  return normalizeHaystack(title).replace(/[^a-z0-9]+/g, " ").trim()
}

export function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug).toLowerCase()
  } catch {
    return slug.toLowerCase()
  }
}

export function editorialFlags(title: string, publishedOn: string, text: string) {
  const flags: string[] = []
  const normalizedTitle = normalizeHaystack(title)
  const normalizedText = normalizeHaystack(text)
  if (publishedOn && publishedOn < "2024-01-01") flags.push("Published before 2024")
  const years = normalizedTitle.match(/\b20(?:1\d|2[0-5])\b/g)
  if (years) flags.push(`Title cites ${[...new Set(years)].join(", ")}`)
  if (/\bcovid(?:-19)?\b/.test(normalizedTitle) || /\bcovid(?:-19)?\b/.test(normalizedText)) flags.push("Mentions COVID-19")
  const bodyYears = normalizedText.match(/\b20(?:1\d|2[0-4])\b/g)
  if (bodyYears) flags.push(`Body cites ${[...new Set(bodyYears)].join(", ")}, which may be outdated`)
  if (/\b(guaranteed rankings?|skyrocket|100%|unstoppable|overnight success|get rich|instant results|secret to)\b/.test(`${normalizedTitle} ${normalizedText}`)) {
    flags.push("Contains an unsupported absolute claim")
  }
  return flags
}

function isConfirmedStudyAbroad(haystack: string, slug: string) {
  if (slug.includes("study-abroad") || slug.includes("study-in-")) return true
  return studyPatterns.some((pattern) => pattern.test(haystack))
}

function topicCategory(haystack: string) {
  for (const rule of topicRules) {
    if (rule.pattern.test(haystack)) return rule.category
  }
  return ""
}

function result(kind: Classification["kind"], category: string, reasons: string[]): Classification {
  return { kind, category, reasons }
}

function normalizeHaystack(value: string) {
  return value.toLowerCase().replace(/<[^>]+>/g, " ").replace(/&amp;/g, " and ").replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim()
}

interface ClassifyInput {
  slug: string
  title: string
  excerpt: string
  categoryNames: string[]
  categorySlugs: string[]
  existingSlugs: Set<string>
  existingTitles: Set<string>
}

const studyPatterns = [
  /study[\s-]?abroad/,
  /studying abroad/,
  /study in (the )?(uk|u\.?s\.?a?|usa|united states|canada|australia|germany|ireland|france|europe|new zealand|singapore|dubai)/,
  /student visa/,
  /\bvisa\b/,
  /\bielts\b/,
  /\btoefl\b/,
  /\bpte\b/,
  /scholarship/,
  /courses abroad/,
  /abroad destination/,
  /international student/,
  /statement of purpose/,
  /\bsop\b/,
  /\btuition\b/,
  /\bintake\b/,
  /\bbachelor/,
  /master'?s/,
  /\bmasters\b/,
  /\bmba\b/,
  /for indian students/,
]

const campusPattern = /universit|imperial college|college london/

const topicRules: { category: string, pattern: RegExp }[] = [
  { category: "Career & Skills", pattern: /\b(careers?|interviews?|portfolios?|freshers?|freelanc\w*|salar(?:y|ies)|\bjobs?\b|placements?|resumes?|\bcv\b|employab\w*|\bhired\b|\bhiring\b)\b/ },
  { category: "Paid Advertising", pattern: /\b(google ads|adwords|\bppc\b|\bsem\b|search engine marketing|paid ads?|paid advertising|performance max|remarketing|retargeting|ad copy|copywriting|facebook ads|meta ads|andromeda|campaign optimization|quality score)\b/ },
  { category: "SEO & Search", pattern: /\b(seo|search engines?|keywords?|rankings?|\brank\b|google updates?|core updates?|e-e-a-t|eeat|search console|backlinks?|on-page|off-page|organic search|answer engine|\baeo\b|\bgeo\b|zero-click|zero click|search everywhere|voice search|featured snippets?|google discover)\b/ },
  { category: "AI & Marketing", pattern: /\b(artificial intelligence|\bai\b|chatgpt|generative|machine learning|ai tools?|ai marketing)\b/ },
  { category: "Social Media Marketing", pattern: /\b(social media|instagram|linkedin|tiktok|\breels?\b|influencers?|user-generated|\bugc\b|youtube|whatsapp)\b/ },
  { category: "Analytics", pattern: /\b(analytics|heatmaps?|google analytics|user tracking|metrics|dashboards?)\b/ },
  { category: "Digital Marketing", pattern: /\b(digital marketing|content marketing|email marketing|e-?commerce|\bmarketing\b|\bbrands?\b|\bbranding\b|\bcampaigns?\b|\bconversions?\b|\bfunnels?\b)\b/ },
]
