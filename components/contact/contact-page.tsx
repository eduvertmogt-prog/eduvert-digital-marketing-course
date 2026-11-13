import { ContactForm } from "@/components/contact/contact-form"
import { counsellorActions } from "@/components/programs/program-content"

export function ContactPage() {
  return (
    <>
      <section aria-labelledby="contact-heading" className="bg-eduvert-canvas-warm">
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-6 py-12 min-[1100px]:grid-cols-[minmax(0,1fr)_480px] min-[1100px]:items-start min-[1100px]:gap-16 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-col gap-3.5">
              <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">CONTACT</p>
              <h1 id="contact-heading" className="max-w-[560px] eduvert-h1 text-eduvert-text-primary">
                Let’s Talk About Your Next Step.
              </h1>
              <p className="max-w-[460px] eduvert-body-large text-eduvert-text-secondary">
                Ask about courses, available batches, or booking a free demo.
              </p>
            </div>
            <ul className="flex flex-col gap-4">
              {contactMethods.map((method) => (
                <li key={method.label}>
                  <p className="eduvert-support font-eduvert-500 text-eduvert-text-secondary">{method.label}</p>
                  <a href={method.href} className="mt-1 inline-flex items-center gap-2 eduvert-body font-eduvert-600 text-eduvert-text-primary hover:text-eduvert-action-primary" target={method.external ? "_blank" : undefined} rel={method.external ? "noopener noreferrer" : undefined}>
                    {method.value}
                    <span aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 min-[1100px]:flex-row">
              <a href={counsellorActions.demoHref} className="flex h-12 items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover">
                {counsellorActions.demoLabel}
              </a>
              <a href={counsellorActions.demoHref} data-demo-intent="counsellor_callback" className="flex h-12 items-center justify-center rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-5 eduvert-button text-eduvert-text-primary hover:bg-eduvert-tint-soft-blue">
                {counsellorActions.talkLabel}
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-eduvert-16 bg-eduvert-surface-white p-6 shadow-[0_12px_32px_color-mix(in_srgb,var(--color-eduvert-text-primary)_6%,transparent)] min-[1100px]:p-7">
              <ContactForm />
            </div>
            <p className="eduvert-support text-eduvert-text-secondary">
              EduVert uses these details to respond to your enquiry.
            </p>
          </div>
        </div>
      </section>
      <section aria-labelledby="visit-heading" className="bg-eduvert-surface-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-12 min-[1100px]:grid-cols-2 min-[1100px]:items-stretch min-[1100px]:gap-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
          <div className="flex flex-col justify-center gap-3">
            <h2 id="visit-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
              Visit EduVert
            </h2>
            <p className="eduvert-h4 text-eduvert-text-primary">EduVert · Seawoods</p>
            <p className="max-w-[420px] eduvert-body text-eduvert-text-secondary">{campusAddress}</p>
          </div>
          <a href={mapHref} target="_blank" rel="noopener noreferrer" className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-eduvert-16 bg-eduvert-tint-blue px-6 py-10 text-center">
            <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-eduvert-surface-white text-eduvert-action-primary">
              <MapPin />
            </span>
            <span className="eduvert-support font-eduvert-600 text-eduvert-text-secondary">Map placeholder</span>
          </a>
        </div>
      </section>
    </>
  )
}

function MapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 16s5-4.2 5-8.1A5 5 0 1 0 4 7.9C4 11.8 9 16 9 16Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="7.5" r="1.6" fill="currentColor" />
    </svg>
  )
}

const campusAddress = "S-10-B, Haware Centurion Mall, 2nd Floor, Seawoods, Navi Mumbai – 400706"

const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campusAddress)}`

const contactMethods = [
  { label: "Phone", value: "+91 96196 78085", href: "tel:+919619678085", external: false },
  { label: "Email", value: "communication@eduvert.co", href: "mailto:communication@eduvert.co", external: false },
  { label: "WhatsApp", value: "Chat on WhatsApp", href: "https://wa.me/919619678085", external: true },
]
