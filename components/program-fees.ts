export interface ProgramFee {
  base: string
  gst: string
  total: string
  totalPaise: number
  note: string
  caption: string
  line: string
  detail: string
  emi: boolean
}

export const programFees = {
  flagship: formatFee(44000, true),
  seo: formatFee(16000),
  sem: formatFee(16000),
  smm: formatFee(16000),
  data: formatFee(20000),
}

export const programFeeSummary =
  `Professional Digital Marketing Program: ${programFees.flagship.detail} SEO, SEM / Google Ads, and SMM / Meta Ads: ${programFees.seo.detail} Data Analytics with Python & Excel: ${programFees.data.detail}`

function formatFee(baseAmount: number, emi = false): ProgramFee {
  const gstAmount = Math.round(baseAmount * 0.18)
  const totalAmount = baseAmount + gstAmount
  const base = inr(baseAmount)
  const gst = inr(gstAmount)
  const total = inr(totalAmount)
  const caption = emi ? `Total ${total} · EMI available` : `Total ${total}`
  const detail = emi
    ? `${base} + 18% GST (${gst}). Total ${total}. EMI option available.`
    : `${base} + 18% GST (${gst}). Total ${total}.`

  return {
    base,
    gst,
    total,
    totalPaise: totalAmount * 100,
    note: `+ 18% GST (${gst})`,
    caption,
    line: `${base} + 18% GST`,
    detail,
    emi,
  }
}

export function feeForSlug(slug: string) {
  switch (slug) {
    case "digital-marketing":
      return programFees.flagship
    case "seo-course-in-navi-mumbai":
      return programFees.seo
    case "sem-course":
      return programFees.sem
    case "smm-course":
      return programFees.smm
    case "data-analytics-python":
      return programFees.data
    default:
      return null
  }
}

export function feeForCourseId(id: string) {
  switch (id) {
    case "flagship":
      return programFees.flagship
    case "seo":
      return programFees.seo
    case "sem":
      return programFees.sem
    case "smm":
      return programFees.smm
    case "data-analytics":
      return programFees.data
    default:
      return null
  }
}

function inr(amount: number) {
  return `₹${new Intl.NumberFormat("en-IN").format(amount)}`
}
