import { liveClassHref, phoneHref, whatsAppHref } from "@/components/site-nav"

const actionClass = "flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-eduvert-8 px-2 eduvert-button min-[1100px]:justify-start min-[1100px]:px-4"

export function SiteContactActions() {
  return (
    <nav className="site-contact-actions z-30" aria-label="Quick contact">
      <a href={liveClassHref} className={`site-contact-start ${actionClass} bg-eduvert-action-primary text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:hidden`}>
        Start Learning
      </a>
      <a href={phoneHref} className={`${actionClass} border border-eduvert-border-subtle bg-eduvert-surface-white text-eduvert-text-primary hover:bg-eduvert-tint-soft-blue`}>
        <PhoneIcon />
        Call
      </a>
      <a href={whatsAppHref} target="_blank" rel="noopener noreferrer" className={`${actionClass} bg-[#176443] text-eduvert-surface-white hover:bg-[#125137]`}>
        <WhatsAppIcon />
        WhatsApp
      </a>
    </nav>
  )
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M8 3H5a2 2 0 0 0-2 2 16 16 0 0 0 16 16 2 2 0 0 0 2-2v-3l-5-2-1.5 2a12 12 0 0 1-6.5-6.5L10 8 8 3Z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M21 11.8a9 9 0 0 1-13.2 8L3 21l1.2-4.6A9 9 0 1 1 21 11.8Z" />
      <path d="M9 8c-.7 0-1.2.7-1.2 1.4 0 2 2.6 5.1 5.3 6 .9.3 2.2-.3 2.4-1.2l-2.3-1.1-.8 1c-1.1-.5-2-1.4-2.6-2.5l.8-.8L9.5 8H9Z" />
    </svg>
  )
}
