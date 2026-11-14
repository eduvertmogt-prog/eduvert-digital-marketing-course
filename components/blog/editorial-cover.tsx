export function EditorialCover({ title, category, variant }: EditorialCoverProps) {
  const tint = coverTints[category] ?? "bg-eduvert-tint-soft-blue"
  if (variant === "card") {
    return (
      <div className={`flex h-[140px] flex-col justify-end gap-2 px-5 pb-4 ${tint}`} aria-hidden="true">
        <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">{category}</p>
        <p className="line-clamp-2 text-[18px] leading-6 font-eduvert-700 tracking-[-0.02em] text-eduvert-text-primary">{title}</p>
      </div>
    )
  }
  return (
    <div className={`flex min-h-[240px] flex-col justify-end gap-3 rounded-eduvert-16 px-6 py-8 min-[1100px]:min-h-[320px] min-[1100px]:px-10 min-[1100px]:py-10 ${tint}`} aria-hidden="true">
      <p className="eduvert-body font-eduvert-700 text-eduvert-action-primary">{category}</p>
      <p className="max-w-[860px] eduvert-h2 tracking-[-0.02em] text-eduvert-text-primary">{title}</p>
    </div>
  )
}

const coverTints: Record<string, string> = {
  "SEO & Search": "bg-eduvert-tint-blue",
  "AI & Marketing": "bg-eduvert-tint-soft-blue",
  "Paid Advertising": "bg-eduvert-tint-yellow",
  "Social Media Marketing": "bg-eduvert-tint-soft-blue",
  Analytics: "bg-eduvert-tint-blue",
  "Digital Marketing": "bg-eduvert-tint-yellow",
  "Career & Skills": "bg-eduvert-tint-soft-blue",
}

interface EditorialCoverProps {
  title: string
  category: string
  variant: "card" | "hero"
}
