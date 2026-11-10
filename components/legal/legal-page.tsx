import type { LegalBlock, LegalDocument, LegalHeading, LegalInline, LegalListItem } from "@/components/legal/legal-types"

export function LegalPage({ document }: LegalPageProps) {
  return (
    <article className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <header className="max-w-[860px]">
          <h1 className="text-[32px] leading-[38px] font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-[46px] min-[1100px]:leading-[52px] min-[1440px]:text-[54px] min-[1440px]:leading-[60px]">
            {document.title}
          </h1>
        </header>
        <div className="flex max-w-[760px] flex-col gap-5">
          {document.blocks.map((block, index) => (
            <LegalBlockView key={`${block.type}-${index}`} block={block} />
          ))}
        </div>
      </div>
    </article>
  )
}

function LegalBlockView({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className={block.highlight ? "rounded-eduvert-12 bg-eduvert-tint-magenta px-4 py-3 text-[18px] leading-[30px] font-eduvert-700 text-eduvert-action-primary" : "text-[18px] leading-[30px] text-eduvert-text-primary"}>
          {block.inlines.map((inline, index) => <InlineView key={`${inline.type}-${index}`} inline={inline} />)}
        </p>
      )
    case "heading":
      return <LegalHeadingView heading={block} />
    case "list":
      return <LegalListView block={block} />
    default: {
      const unhandled: never = block
      return unhandled
    }
  }
}

function LegalHeadingView({ heading }: { heading: LegalHeading }) {
  switch (heading.level) {
    case 2:
      return (
        <h2 id={heading.id} className="scroll-mt-28 pt-4 text-[28px] leading-9 font-eduvert-700 tracking-[-0.02em] text-eduvert-text-primary min-[1100px]:text-[34px] min-[1100px]:leading-[42px]">
          {heading.text}
        </h2>
      )
    case 3:
      return (
        <h3 id={heading.id} className="scroll-mt-28 pt-2 text-[20px] leading-7 font-eduvert-700 text-eduvert-text-primary min-[1100px]:text-[22px]">
          {heading.text}
        </h3>
      )
    default: {
      const unhandled: never = heading.level
      return unhandled
    }
  }
}

function LegalListView({ block }: { block: Extract<LegalBlock, { type: "list" }> }) {
  const ListTag = block.ordered ? "ol" : "ul"
  const marker = block.ordered ? "list-decimal" : "list-disc"
  return (
    <ListTag className={`${marker} space-y-2 pl-6 text-[18px] leading-[30px] text-eduvert-text-primary`}>
      {block.items.map((item) => (
        <li key={listItemKey(item)}>{typeof item === "string" ? item : item.map((inline, index) => <InlineView key={`${inline.type}-${index}`} inline={inline} />)}</li>
      ))}
    </ListTag>
  )
}

function InlineView({ inline }: { inline: LegalInline }) {
  switch (inline.type) {
    case "text":
      return inline.text
    case "strong":
      return <strong className="font-eduvert-700">{inline.text}</strong>
    case "emphasis":
      return <em>{inline.text}</em>
    case "link":
      return <LegalLinkView inline={inline} />
    default: {
      const unhandled: never = inline
      return unhandled
    }
  }
}

function LegalLinkView({ inline }: { inline: Extract<LegalInline, { type: "link" }> }) {
  const href = safeLegalHref(inline.href)
  if (!href) return inline.text
  const isExternal = href.startsWith("http")
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`${inline.strong ? "font-eduvert-700" : "font-eduvert-500"} inline-flex items-center gap-2 text-eduvert-link hover:text-eduvert-action-primary`}
    >
      <ContactIcon href={href} />
      <span className="underline decoration-eduvert-link/30 underline-offset-2">{inline.text}</span>
    </a>
  )
}

function ContactIcon({ href }: { href: string }) {
  if (href.startsWith("mailto:")) return <MailIcon />
  if (href.startsWith("tel:")) return <PhoneIcon />
  return null
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
      <rect x="2.25" y="4" width="13.5" height="10" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.45" />
      <path d="m3.1 5.2 5.9 4.3 5.9-4.3" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
      <path d="M6.1 3.4h1.5l.9 2.2-1.2.7a7.4 7.4 0 0 0 3.4 3.4l.7-1.2 2.2.9v1.5c0 .7-.6 1.3-1.3 1.4A10 10 0 0 1 4.7 4.7c.1-.7.7-1.3 1.4-1.3Z" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" />
    </svg>
  )
}

function safeLegalHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return href
  if (href.startsWith("https://") || href.startsWith("http://") || href.startsWith("mailto:") || href.startsWith("tel:")) return href
  return null
}

function listItemKey(item: LegalListItem) {
  if (typeof item === "string") return item
  return item.map((part) => part.text).join("")
}

interface LegalPageProps {
  document: LegalDocument
}
