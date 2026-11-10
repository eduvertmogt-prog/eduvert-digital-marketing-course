export function formatArticleDate(publishedOn: string) {
  const [year, month, day] = publishedOn.split("-")
  const monthName = monthNames[Number(month) - 1]
  if (!year || !monthName || !day) return publishedOn
  return `${monthName} ${Number(day)}, ${year}`
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
